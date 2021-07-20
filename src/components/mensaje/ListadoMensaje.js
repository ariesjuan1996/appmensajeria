import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,

  Text,
  Touchable,
  TouchableOpacity,
  View
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { useSelector } from "react-redux";
import {TextInput,  StyleSheet } from 'react-native';
import {MensajeComponent} from './MensajeComponent';
import { Header, Left,Icon,Body} from 'native-base';
import {FlatList} from 'react-native-bidirectional-infinite-scroll';
import {useRef} from 'react';
import { Dimensions } from 'react-native';
import {ImagenPreviaMensaje} from './ImagenPreviaMensaje'; 
import {momentGlobal} from '../../../src/context/momentConfig'; 
import modelVistaMensajesUsuario from '../../../src/db/vistaMensajesUsuario';
import modelMensajesUsuario from '../../../src/db/mensajesUsuarios';
import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { socket} from '../../../src/context/socket'; 

import * as RNFS from 'react-native-fs';
const anchoCaja=Dimensions.get("window").width-80;
const App =React.memo( (props) => {
  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");
  //const [dimensions, setDimensions] = useState({ window, screen });
  const [loaderTop,setLoaderTop] = useState(false);
  const [inicial,setInicial] = useState(true);
  const {contactoSeleccionado,listadoMensajes,numero,refrescarPagina}=props;
  const [mensaje,setMensaje] = useState("");
  const [tipomensaje,setTipoMensaje] = useState("texto");
  
  const directorioImagenesMensajes = useSelector((state) => state.directorioImagenesMensajes);
  let flatList = useRef();
  const loadMoreOlderMessages = async () => {
    setInicial(false);
    setLoaderTop(true);
    let tempFechaEnvio=listadoMensajes.length ? listadoMensajes[0].fechaEnvio : null;      
    await props.refrescarMensajesScrooll(numero,tempFechaEnvio);
    setLoaderTop(false);
  };
  const optionsCamara=[];
  const atras=React.useCallback(()=>{
    props.onCambioVista("HOME");
  },[]);
 
  const enviarMensajeApp = async () => {
  if(!(mensaje==null || mensaje=="")){
      try {
        let idInsert=await modelMensajesUsuario.registrarMensajeEnvio({
          destino:contactoSeleccionado.numero,
          mensaje:mensaje,
          fechaEnvio:momentGlobal().format("YYYY-MM-DD HH:mm:ss"),
          origen:numero,
          tipomensaje:tipomensaje
       });
       await  modelVistaMensajesUsuario.registrarActualizar({
          numero:contactoSeleccionado.numero,
          mensaje:mensaje,
          usuario:contactoSeleccionado.nombre,
          visto:true,
          tipomensaje:tipomensaje
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
        idLocalId:idInsert,
        tipomensaje:tipomensaje
      };
      try {
         let response=await socket.emit('nuevo-mensaje', dataRequest);
         setMensaje("");
      } catch (error) {
        setMensaje("");
        estadoEnvioMensaje=false;
      }
        
      } catch (error) {
      console.log("error",error);
      }finally{
      }

  }

  };
  const descargarImagen = async (numero,url) => {
    console.log("url",url);
    try {
      //let extension=url.split(".")[url.split(".").length-1];

      let response=await RNFetchBlob
      .config({
          path : directorioImagenesMensajes+numero+'.'+"jpg"
      })
      .fetch('GET', url);
      console.log("response.path():",response.path());
      // const saveImage=await RNFetchBlob.fs.scanFile([ { path : response.path(), mime : 'image/'+extension } ]);
      return {estado:true,imagen: numero+'.'+"jpg"};      
    } catch (error) {
      console.log("error",error);
      return {estado:false,imagen:null};
      
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
    setTipoMensaje("texto");
    setMensaje(val);
  }
  const seleccionarImagenes=async()=>{
    const response = await MultipleImagePicker.openPicker(optionsCamara);
    if(response.length>0){
      setTipoMensaje("imagen");
     
      //setMensajesSeleccionadas
      let opcionesMensajes=[];
      response.forEach(async(element) => {
        //response
        let base64si=await RNFS.readFile(element.realPath, 'base64');
        let stringType="data:"+element.mine+";base64,"+base64si;
        const d = new Date();
        let nameFile=d.getTime()+".jpg";
        await RNFS.copyFileAssets(element.realPath, directorioImagenesMensajes+nameFile);
        let idInsert=await modelMensajesUsuario.registrarMensajeEnvio({
          destino:contactoSeleccionado.numero,
          mensaje:stringType,
          fechaEnvio:momentGlobal().format("YYYY-MM-DD HH:mm:ss"),
          origen:numero,
          tipomensaje:"imagen"
       });

      
       await  modelVistaMensajesUsuario.registrarActualizar({
          numero:contactoSeleccionado.numero,
          mensaje:nameFile,
          usuario:contactoSeleccionado.nombre,
          visto:true,
          tipomensaje:"imagen"
        });
        let dataRequest={
          origen:numero,
          destino:contactoSeleccionado.numero,
          mensaje:stringType,
          usuario:contactoSeleccionado.nombre,
          idLocalId:idInsert,
          tipomensaje:"imagen"
        };
        
        let response=await socket.emit('nuevo-mensaje', dataRequest); 
        //opcionesMensajes.push(stringType);
      });
    
    }
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
          style={{height:"75%",marginBottom:30,marginTop:20}}
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
            
            <MensajeComponent item={itemData} numero={numero}     key={indexItem}  length={listadoMensajes.length-1}/>
          )}
        />
        </SafeAreaView>
     
      <TouchableOpacity style={styles.sendMessageButton}>
        <TextInput
          value={mensaje}  
          onChangeText={escribirMensaje}
          style={{    
            width:anchoCaja-60,
            backgroundColor:"#fff",
            textAlignVertical: "top",
            minHeight: 20,
            maxHeight: 80,
            left:0,
            position:"relative",
            height: "auto",
            marginRight:50,
            height:50} }
          numberOfLines={2}
          blurOnSubmit={false}
          placeholder="Ingrese un nombre"
          multiline={true} />
          <IconAntDesign  style={ {backgroundColor:"transparent",position:"absolute",right:0,height:50,textAlign:"center", width:50,borderRadius:50,top:0,lineHeight:50,textAlign:"center",color:"#6D7275"}}  name="camera" size={30} 
          onPress={seleccionarImagenes}/> 
         
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1}  onPress={enviarMensajeApp} style={styles.sendMessageButton2} >
          
          <Text style={styles.sendButtonTitle}>Enviar </Text>
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
    bottom:0,
    width:anchoCaja,
    borderRadius:10,
    backgroundColor:"#fff",
    borderWidth: 1,
    bottom:10,
    borderColor: "#fff",
    left:10
  },
  sendMessageButton2: {
    alignItems: 'center',
    position: 'absolute',                                          
    height:55,
    margin:0,
    backgroundColor: '#007D75',
    bottom:0,
    width:55,
    right:0,
    borderRadius:55,
    bottom:10
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