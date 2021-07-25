import React, { useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
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
import ItemContactoInformacion from '../contacto/ItemContactoInformacion';
import MultipleImagePicker from "@baronha/react-native-multiple-image-picker";
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { socket} from '../../../src/context/socket'; 
import RNFetchBlob from 'react-native-fetch-blob';
import * as RNFS from 'react-native-fs';
import { Thumbnail } from 'native-base';
const anchoCaja=Dimensions.get("window").width-80;
const App =React.memo( (props) => {
  const [loaderTop,setLoaderTop] = useState(false);
  const [inicial,setInicial] = useState(true);
  const {contactoSeleccionado,listadoMensajes,numero,refrescarPagina,lengthMensajes,listaImagenes,listaImagenesRuta}=props;
  const [mensaje,setMensaje] = useState("");
  const [imagenSeleccionada,setImagenSeleccionada] = useState("");
  const [tipomensaje,setTipoMensaje] = useState("texto");
  const [tipoVista,setTipoVista] = React.useState(true);
  const [itemContactoInformacion,setItemContactoInformacion] = React.useState(false);
  const [indexImagen,setIndexImagen] = React.useState(0);
  //const [listaImagenes,setListaImagenes] = useState([]);
  const directorioImagenesMensajes = useSelector((state) => state.directorioImagenesMensajes);
  const dataUsuarioTelefono = useSelector((state) => state.dataUsuarioTelefono);
  const directorioPefil = useSelector((state) => state.directorioPefil);
  let flatList = useRef();
  const loadMoreOlderMessages = async () => {
    setInicial(false);
    setLoaderTop(true);
    let tempFechaEnvio=listadoMensajes.length ? listadoMensajes[0].fechaEnvio : null;      
    await props.refrescarMensajesScrooll(numero,tempFechaEnvio);
    setLoaderTop(false);
  };
  const optionsCamara={
    singleSelectedMode:false,
    isPreview:true,
    mediaType:"all"
  };
  const atras=React.useCallback(()=>{
    props.onCambioVista("HOME");
  },[]);
  const atrasPrevio=()=>{
    setTipoVista(!tipoVista);
  }
  React.useEffect(() => {
    console.log("listadoMensajes",listadoMensajes);
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
    setTipoMensaje("texto");
    setMensaje(val);
  }
  const seleccionarImagenes=async()=>{
    try {
      const response = await MultipleImagePicker.openPicker(optionsCamara);
      if(response.length>0){
        setTipoMensaje("imagen");
        const assetsDirExists = await RNFetchBlob.fs.isDir(directorioImagenesMensajes);
        if (!assetsDirExists) {
            await RNFetchBlob.fs.mkdir(directorioImagenesMensajes);
        }
        response.forEach(async(element) => {
          //RNFetchBlob
          let base64si=await RNFS.readFile(element.realPath, 'ascii');
          let base64Formatos=null;
          let pathRegistro=null;
          try {
            const fs = RNFetchBlob.fs
            const base64 = RNFetchBlob.base64
            const codificada=base64.encode(base64si);
            base64Formatos="data:"+element.mime+";base64,"+codificada;
            var d=new Date();
            let nameFile=d.getTime();
            
            var path = directorioImagenesMensajes +nameFile+ '.'+element.mime.split("/")[1];
            pathRegistro=nameFile+ '.'+element.mime.split("/")[1];
          //base64Formatos=codificada;
            fs.createFile(path, base64.encode(base64si), 'base64')
            
          } catch (error) {
          }
          try {
          
          let idInsert=await modelMensajesUsuario.registrarMensajeEnvio({
            destino:contactoSeleccionado.numero,
            mensaje:pathRegistro,
            fechaEnvio:momentGlobal().format("YYYY-MM-DD HH:mm:ss"),
            origen:numero,
            tipomensaje:"imagen"
         });
        
         await  modelVistaMensajesUsuario.registrarActualizar({
            numero:contactoSeleccionado.numero,
            mensaje:pathRegistro,
            usuario:contactoSeleccionado.nombre,
            visto:true,
            tipomensaje:"imagen"
          });
          await props.refrescarVista({
            origen:numero,
            destino:contactoSeleccionado.numero,
            fechaEnvio:null
          });
          flatList.current.scrollToEnd({animated:false, index: 0 });
          let dataRequest={
            origen:numero,
            destino:contactoSeleccionado.numero,
            mensaje:base64Formatos,
            usuario:contactoSeleccionado.nombre,
            idLocalId:idInsert,
            tipomensaje:"imagen"
          };
          let response=await socket.emit('nuevo-mensaje', dataRequest); 
          await props.refrescarImagenes();
          } catch (error) {
          }
          
        });
      
      }   
    } catch (errorEpp) {
    }

  }
  const seleccionarImagen=(props)=>{
    let indexSelect=0;
    listaImagenesRuta.forEach((element,index) => {
      if( element==props){
        indexSelect=index;

      }
    });
    setIndexImagen(indexSelect);
    setImagenSeleccionada(props);
    setTipoVista(!tipoVista);
    //listaImagenesRuta
    //alert("seleccionar imagen");
  }
  const seleccionarPerfilContacto=()=>{
    setItemContactoInformacion(true);
    console.log("contactoSeleccionado.numero",contactoSeleccionado.numero);
  }
  const atrasContacto=()=>{
    setItemContactoInformacion(false);
  }
  return (
    < >
      <ItemContactoInformacion atrasContacto={atrasContacto} contactoSeleccionado={contactoSeleccionado} itemContactoInformacion={itemContactoInformacion} />
      <View style={(tipoVista && !itemContactoInformacion  ? {opacity:1} : {opacity:0}),{height:"100%"} }>
        
          <Header   style={{height:60,backgroundColor:"#fff"}}  >
            <Left style={{width:"5%",marginLeft:-20}}>
              <TouchableOpacity circle style={{borderRadius:50,marginLeft:0}}    onPress={atras}>
                <Icon name='arrow-back' style={{color:"#000",marginLeft:0,marginTop:15,top:0,width:60,height:50}}/>
              </TouchableOpacity>
              
            </Left>
        <TouchableOpacity style={{backgroundColor:"#fff",marginLeft:-5,marginTop:10,width:"90%"}}  onPress={seleccionarPerfilContacto}>
          <Body style={[ {flexDirection: "row",marginLeft:-155}]}>
          {
            contactoSeleccionado.imagenContacto==null ?
            <Thumbnail style={{width:45,height:45}} circle source={require('../../assets/usuariodefault.jpg' )} circle />
            :
          <Thumbnail style={{width:45,height:45}} circle source={{uri: Platform.OS === 'android' ? 'file://' + (directorioPefil+contactoSeleccionado.imagenContacto)  : '' + (directorioPefil+contactoSeleccionado.imagenContacto)}} circle />
          }
          <Text style={styles.headerTitle}>{contactoSeleccionado.nombre}</Text>
          </Body></TouchableOpacity>
        </Header>
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
                
                <MensajeComponent seleccionarImagen={seleccionarImagen} item={itemData} numero={numero}     key={indexItem}  length={listadoMensajes.length-1}/>
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
      </View> 
      {
        !tipoVista && !itemContactoInformacion ?
        <ImagenPreviaMensaje indexImagen={indexImagen} listaImagenes={listaImagenes}  contactoSeleccionado={contactoSeleccionado} imagenSeleccionada={imagenSeleccionada} atras={atrasPrevio}  />
        :
        null
      }
     
  </ >
  );
});

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    borderBottomColor: '#BEBEBE',
    flexDirection:"row",
    backgroundColor:"#fff"
  },
  headerTitle: {fontSize: 20, fontWeight: 'bold',marginTop:10,marginLeft:10},
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