import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,

  Text,
  Touchable,
  TouchableOpacity,
  View
} from 'react-native';
import {TextInput,  StyleSheet } from 'react-native';
//import {FlatList} from 'react-native-bidirectional-infinite-scroll';
import {MessageBubble} from './MessageBubble';
import { Header, Left,Icon,Body} from 'native-base';
import { FlatList } from '@stream-io/flat-list-mvcp';
import {useRef} from 'react';
import servicesMensajes from '../../services/servicesMensajes';
import {MomentContext,momentGlobal} from '../../../src/context/momentConfig'; 
import modelVistaMensajesUsuario from '../../../src/db/vistaMensajesUsuario';
import modelMensajesUsuario from '../../../src/db/mensajesUsuarios';

import {SocketContext, socket} from '../../../src/context/socket'; 
const App =React.memo( (props) => {
  const [loaderTop,setLoaderTop] = useState(false);
  const [inicial,setInicial] = useState(true);
  const {contactoSeleccionado,listadoMensajes,numero,refrescarPagina}=props;
  const [mensaje,setMensaje] = useState("");
  let flatList = useRef();
  const loadMoreOlderMessages = async () => {
    setInicial(false);
    setLoaderTop(true);
    let tempFechaEnvio=listadoMensajes.length ? listadoMensajes[0].fechaEnvio : null;      
    await props.refrescarMensajesScrooll(numero,tempFechaEnvio);
    setLoaderTop(false);
  };
  
  const atras=React.useCallback(()=>{
    props.onCambioVista("HOME");
  },[]);
  const loadMoreRecentMessages = async () => {
  };
  const enviarMensajeApp = async () => {
  if(!(mensaje==null || mensaje=="")){
      try {
        let idInsert=await modelMensajesUsuario.registrarMensajeEnvio({
          destino:contactoSeleccionado.numero,
          mensaje:mensaje,
          fechaEnvio:momentGlobal().format("YYYY-MM-DD HH:mm:ss"),
          origen:numero
       });
       await  modelVistaMensajesUsuario.registrarActualizar({
          numero:contactoSeleccionado.numero,
          mensaje:mensaje,
          usuario:contactoSeleccionado.nombre,
          visto:true
      });
      
        //await setInicial(true);
      setInicial(true);
      await props.refrescarVista({
        origen:numero,
        destino:contactoSeleccionado.numero,
        fechaEnvio:null
      });
      flatList.current.scrollToEnd({animated:false, index: 0 });
      let dataRequest={
        origen:numero,
        destino:contactoSeleccionado.numero,
        mensaje:mensaje,
        usuario:contactoSeleccionado.nombre,
        idLocalId:idInsert
      };
      try {
         let response=await socket.emit('nuevo-mensaje', dataRequest);
         setMensaje("");
      } catch (error) {
        setMensaje("");
        estadoEnvioMensaje=false;
      }
        
      } catch (error) {
      //  console.log("error",error);
      }finally{
      }

  }

  };
 
  const refrescar=async()=>{
    loadMoreOlderMessages();
  }
  const escribirMensaje=(val)=>{
    
    if(val=="" || val==null ){
      //setHabilitar(false); 
    }else{
    // setHabilitar(true);
    }
    setMensaje(val);
  }
  if (!listadoMensajes) {
    return null;
  }
const HeaderComponent=React.memo(()=>{
  return(      
  <Header   style={{height:60,backgroundColor:"#fff"}}  >
  <Left>
    <TouchableOpacity circle style={{borderRadius:50,marginLeft:0}}    onPress={atras}>
      <Icon name='arrow-back' style={{color:"#000",marginLeft:0,marginTop:15,top:0,width:60,height:50}}/>
    </TouchableOpacity>
  </Left>
  <Body style={[ {flexDirection: "row",marginLeft:-10}]}>
  <Text style={styles.headerTitle}>{contactoSeleccionado.nombre}</Text>
  </Body>
</Header>);
});

  return (
    < >
      <HeaderComponent/>
      <SafeAreaView style={{height:"85%"}}>
     
        <FlatList
          scrollEnabled={true}
          initialNumToRender={8}
          maxToRenderPerBatch={2}
          onEndReachedThreshold={0.5}
          style={{height:"100%",marginBottom:30,marginTop:20}}
          refreshing={loaderTop}
          nestedScrollEnabled={true} 
          ref={flatList}
          onScroll={(e)=>{}}
          onContentSizeChange={(e) =>{
            if(inicial){
              flatList.current.scrollToEnd({animated:false, index: 0 });
            }
            
          }}
          initialNumToRender={0}
          windowSize={22} 
          data={listadoMensajes}
          onScrollToIndexFailed={()=>{}}
          keyExtractor =  {(item) => JSON.stringify(item)}
          onRefresh={(e) =>refrescar(e)}
          onStartReachedThreshold={50} 
          onEndReachedThreshold={50}
          renderItem={(itemData,indexItem ) => (
            
            <MessageBubble item={itemData} numero={numero}     key={indexItem}  length={listadoMensajes.length-1}/>
          )}
        />
        </SafeAreaView>
     
      <TouchableOpacity style={styles.sendMessageButton}>
        <TextInput
          value={mensaje}  
          onChangeText={escribirMensaje}
          style={{       
            width:"78%",
            backgroundColor:"#fff",
            borderColor:"#676768",
            textAlignVertical: "top",
            minHeight: 20,
            height: "auto",
            right:"10%"} }
          numberOfLines={2}
          blurOnSubmit={false}
          placeholder="Ingrese un nombre"
          multiline={true} />
        <TouchableOpacity activeOpacity={1}  onPress={enviarMensajeApp} style={styles.sendMessageButton2} >
          <Text style={styles.sendButtonTitle}>Enviar </Text>
        </TouchableOpacity>
      </TouchableOpacity>
     
  </ >
  );
});

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    borderBottomColor: '#BEBEBE',
    flexDirection:"row",
    backgroundColor:"red"
  },
  headerTitle: {fontSize: 20, fontWeight: 'bold'},
  safeArea: {
    flex: 1,
  },
  sendMessageButton: {
    alignItems: 'center',
    position: 'absolute',                                          
    height:"auto",
    margin:0,
    bottom:0,
    width:"100%",
    right:0,
    backgroundColor:"#fff"
  },
  sendMessageButton2: {
    alignItems: 'center',
    position: 'absolute',                                          
    height:60,
    margin:0,
    backgroundColor: 'blue',
    bottom:0,
    width:"20%",
    right:0
  },
  sendButtonTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign:"center" ,
    lineHeight:60
  },
});

export default App;