
import React,{useRef,memo,useCallback,useEffect,useState} from 'react';
import {BackHandler,Image, PermissionsAndroid,View,Text} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Contacts from 'react-native-contacts';
import modelMensajesUsuario from './src/db/mensajesUsuarios';
import { actualizarLoader,actualizarDataUsuarioTelefono,actualizarListadoContactos,actualizarListadoUsuarioVista } from "./src/store/actions";
import  HomeApp from './src/HomeApp';
import  modelUsuario from './src/db/usuario';
import  modelContacto from './src/db/contactos';
import  VerificacionApp from './src/components/verify/VerificacionApp';
import {Provider } from 'react-native-paper';
import {SocketContext, socket} from './src/context/socket'; 
import {MomentContext,momentGlobal} from './src/context/momentConfig'; 
import   servicesMensajes from './src/services/servicesMensajes';
import RNFetchBlob from 'react-native-fetch-blob';
import modelVistaMensajesUsuario from './src/db/vistaMensajesUsuario';
import stylesApp from './src/css/AppStyle';
//import { NetInfo } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import  {requestApi}  from './src/api/';
import  RemotePushController  from './src/RemotePushController';

import { LogBox } from 'react-native';


/*
messaging().setBackgroundMessageHandler(async remoteMessage => {
});*/
const AppComponent=memo((props,ref) => {
  LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  let myRef = useRef(null);
  const dispatch = useDispatch();
  const directorioPefil = useSelector((state) => state.directorioPefil);
  const listadoContactosTotal = useSelector((state) => state.listadoContactosTotal);
  const listadoUsuarioVista = useSelector((state) => state.listadoUsuarioVista);
  const dataUsuarioTelefono = useSelector((state) => state.dataUsuarioTelefono);
  const loaderData = useSelector((state) => state.loaderData);
  const [usuarioExiste,setUsuarioExiste] = useState(null);
  const [contactoCargado,setContactoCargado] = useState(false);
  const directorioImagenesMensajes = useSelector((state) => state.directorioImagenesMensajes);
  const [stateConectInternet,setStateConectInternet] = useState({
    type:null,
    isConnected:false
  }); 
  
  
  useEffect( () => {
    NetInfo.addEventListener(networkState => {
      setStateConectInternet(networkState);
    });

  }, [stateConectInternet,setStateConectInternet]);
  useEffect( () => {
    if(stateConectInternet.isConnected && socket.connected){
      (async()=>{
        let listDataEnviar=await modelMensajesUsuario.obtenerMensajesSinEnviar(directorioImagenesMensajes);
       
        try {
          let response=await socket.emit('sincronizar-mensaje', listDataEnviar);
        } catch (error) {
        }


      })();
    }
  }, [stateConectInternet.isConnected,stateConectInternet.type,socket.connected]);

  useEffect(() => {
    (async()=>{
      if(dataUsuarioTelefono!=null && dataUsuarioTelefono.numero!=undefined){
       // await  tokenGenerar();
      }
    })();
  }, [dataUsuarioTelefono]);
  useEffect(() => {
    actualizarVista();
  },[Object.entries(listadoUsuarioVista).length]);
  useEffect(() => {
 
    requestPermisos().then(async(valueTodoPermisos)=>{
      if(valueTodoPermisos){
        (async()=>{

          await verificarSiRegistro();  
          if(!!dataUsuarioTelefono.numero){
            initLoader(dataUsuarioTelefono.numero);
          }
          actualizarLoaderMetodo(false);
        })();
        
      }else{
        BackHandler.exitApp();

      }
      }
    );

  },[dataUsuarioTelefono.numero] );
  useEffect(() => {
    if(dataUsuarioTelefono.numero!=null && contactoCargado){
     
      inicializarSoket(dataUsuarioTelefono.numero);
    }
  },[dataUsuarioTelefono.numero,contactoCargado]);
  
  useEffect( () => {
    if(stateConectInternet.isConnected && socket.connected && dataUsuarioTelefono.numero!=null && dataUsuarioTelefono.numero!="" && dataUsuarioTelefono.numero!=undefined && contactoCargado==true && myRef!=null){
      (async()=>{
        
        try {
          let listDataEnviar=await obtenerMensajesPendientes(dataUsuarioTelefono.numero);
          if(listDataEnviar.length){
            await modelMensajesUsuario.registrarMensajeMasivo(directorioImagenesMensajes,listDataEnviar,dataUsuarioTelefono.numero,listadoContactosTotal);
            let responseEmit=await socket.emit('actualizar-mensaje-estadomensaje-masivo', listDataEnviar);
            myRef.current.listarMensajesUsuarioVista();
          }

        } catch (error) {
        }


      })();
    }
  }, [stateConectInternet.isConnected,stateConectInternet.type,socket.connected,dataUsuarioTelefono.numero,contactoCargado]);
  
  const obtenerMensajesPendientes=async(numerousuario)=>{
    try {
      let response=await requestApi(
      "usuarios/listarMensajesPendientes?origen="+numerousuario,
      {
      },
      "get"
      ); 
      return response.estado ? response.data : [];
    } catch (error) {
      return [];
    }
  }  


  const initLoader=useCallback(async(num)=>{
    listarMensajesUsuarioVista();
    //actualizarLoaderMetodo(false);
    cargarContactos();
    actualizarLoaderMetodo(false);
  
  },[]);

  const initLoader2=useCallback(()=>{
    requestPermisos().then((valueTodoPermisos)=>{
      if(valueTodoPermisos){
        cargarContactos();
        verificarSiRegistro();
        inicializarSoket(dataUsuarioTelefono.numero);
        actualizarLoaderMetodo(false);
      }else{
        BackHandler.exitApp();

      }

    });
  });
  const inicializarSoket=useCallback((num)=>{
    socket.on("nuevo-mensaje-"+num,async(val)=>{
      let pathImagen=null;
      if(val.tipomensaje=="imagen"){
          
          pathImagen=await servicesMensajes.descargarImagen(directorioImagenesMensajes,val.mensaje);
          //tempMensaje=("'"+pathImagen+"'");
          val.mensaje=pathImagen;
         
      }
     
      let nombreTemporalEnvio=listadoContactosTotal[val.origen]==null || listadoContactosTotal[val.origen]=="" || listadoContactosTotal[val.origen]==undefined ? null : listadoContactosTotal[val.origen].nombre;
      modelMensajesUsuario.registrarMensajeEnvio({
        contactoNumero:val.destino,
        destino:val.destino,
        mensaje:val.mensaje,
        fechaEnvio:val.fechaEnvio,
        origen:val.origen,
        tipomensaje:val.tipomensaje,
        nombre:nombreTemporalEnvio
      });

    if(myRef!=null){
      myRef.current.useRefrescarMensajes(val,nombreTemporalEnvio);
      let response=await socket.emit('actualizar-mensaje-estadomensaje', val);
    }
    },[]);
    socket.on("respuesta-mensaje-enviado-"+num,(val)=>{
      modelMensajesUsuario.actualizarUsuarioVisto(    {
        "id":val.idLocalId,
        "idApi":val.idMensaje,
        "fechaRegistro":val.fechaRegistro
      });
      if(myRef!=null){
        
        myRef.current.refrescarEstadoMensaje(
          [
            {
              idLocalId:val.idLocalId,
              idMensaje:val.idMensaje
            }
          ]
        );
      }
    
    },[]);
    socket.on("respuesta-mensaje-enviado-sincronizado-"+num,async(val)=>{
      let responseIds=await modelMensajesUsuario.actualizarListadoUsuarioVista( val);
     
      if(myRef!=null){
        myRef.current.refrescarEstadoMensajeSincronizado(responseIds);
      }
    
    },[]);
   
  },[contactoCargado]);
  const actualizarLoaderMetodo =useCallback(  (request) => {
    dispatch(actualizarLoader(request));
  },[loaderData]);

  const cargarContactos = useCallback((data) => {
    Contacts.getAll().then((contactss) => {
      let tempContactos={};
      contactss.map((element,index)=>{
        let numeroContacto=null;
        let id=null;
         if(element.phoneNumbers.length>0){
            numeroContacto=element.phoneNumbers[0].number.split(" ").join("").split("+").join("");
            id=element.phoneNumbers[0].id;
         }
         if(numeroContacto!=null){
          let tempExisteContactoUnico={};
          tempExisteContactoUnico=tempContactos[numeroContacto];
          if(tempExisteContactoUnico===undefined){
              let dataImagen=null;
              tempContactos[numeroContacto]={
                nombre:element.givenName,
                imagenContacto:dataImagen,
                numero:numeroContacto,
                id: index
              };
              
          }
          
         }
      });

      setListadoContactoss(tempContactos);
     //setContactoCargado
     setContactoCargado(true);
    },[listadoContactosTotal,setListadoContactoss]);
    
  },[listadoContactosTotal,setListadoContactoss]);

  const listarMensajesUsuarioVista =useCallback( async() => {
    let listData=await modelVistaMensajesUsuario.listar();
    let objectoFormato={};
    
    listData.map(element => {
      objectoFormato[element.numero]=element;
    });
    actualizarListVista(objectoFormato);
   
  },[listadoUsuarioVista,actualizarListVista]);
  const actualizarVista=useCallback( async()=>{
    let stringNumero=[];
    Object.entries(listadoUsuarioVista).forEach(([key, value]) => {
      stringNumero.push(value.numero);

    });
    let tempstringNumero= stringNumero.join(",");
  
    let datos =await obtenerDatosUsuarioApi(tempstringNumero);
    let listDatos=datos.estado ? datos.data : [];
    actualizarImagenes(listDatos);
  });
  const actualizarListVista=useCallback( (listData)=>{
    dispatch(actualizarListadoUsuarioVista(listData));
  },[listadoUsuarioVista]);
  const actualizarImagenes=async(requestData)=>{
    //let datos =await obtenerDatosUsuarioApi(numeroContacto);
    requestData.forEach(async(element) => {
        let responseImagen=await descargarImagen(element.numerousuario,element.imagen);
        dataImagen=responseImagen.imagen;
        await modelContacto.actualizarUsuarioImagen(element.numerousuario,dataImagen,element.nombreImagen)
    });
    
   
  }
  const obtenerDatosUsuarioApi=async(numero)=>{
    let dataUser=await servicesMensajes.obtenerDatosUsuario(numero);
    return dataUser ;
  }
  const obtenerImagenContacto=async(numero)=>{
    let data=await modelContacto.obtenerDatosUsuarioContacto(numero);
    return dataUsuarioTelefono.imagen ;
  }
  const setListadoContactoss=(tempContactos)=>{
    dispatch(actualizarListadoContactos(tempContactos) );
  }
  const requestPermisos=async()=>{
    let responsePermiso=await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
      //CAMERA
    ]);
    let existePermisoDetenido=true;
    for (var index in responsePermiso) {
      if(responsePermiso[index]=="denied"){
        existePermisoDetenido=false;
      }
    }
    return existePermisoDetenido;
  }
  descargarImagen = async (numero,url) => {
    try {
      let extension=url.split(".")[url.split(".").length-1];
      let response=await RNFetchBlob
      .config({
          path : directorioPefil+numero+'.'+extension
      })
      .fetch('GET', url);
      const saveImage=await RNFetchBlob.fs.scanFile([ { path : response.path(), mime : 'image/'+extension } ]);
      return {estado:true,imagen: numero+'.'+extension};      
    } catch (error) {
        return {estado:false,imagen:null};
      
    }



  };

  const verificarSiRegistro=async()=>{
    let datos= await modelUsuario.obtenerDatosUsuario();
    
    if(datos){
      await dispatch(actualizarDataUsuarioTelefono({
        nombre:datos.nombre,
        numero:datos.telefono,
        imagen:datos.imagen
      }));
    }
    await setUsuarioExiste(datos ? 1 : 2);
  }
  const verificarRegistradoUsuario= (request)=>{
    verificarSiRegistro().then(()=>{
      if(dataUsuarioTelefono.numero){
        initLoader2();
      }
    });
  }

  return (
    
      <Provider>
        {
          dataUsuarioTelefono.numero && contactoCargado ? 
          <RemotePushController listadoContactosTotal={listadoContactosTotal}/>
          :
          null  
        }
        
        {loaderData ?
        <View
        
        style={stylesApp.View}
        >
          <Text></Text>
          <Image style={stylesApp.Image}  source={require('./src/assets/logoapp.jpg')} /></View> :     
        <> 
          {
            usuarioExiste==1 ? <>
            
              <SocketContext.Provider value={socket}>
                <MomentContext.Provider value={momentGlobal} >
                 
                  <HomeApp ref={myRef}    dataUsuarioTelefono={dataUsuarioTelefono} />
                  
                </MomentContext.Provider>
              </SocketContext.Provider>
            
            </>: 
            
            ( usuarioExiste==2 ? <VerificacionApp verificarRegistradoUsuario={verificarRegistradoUsuario}/> : <></>) 
          }
        </>}
    </Provider>
    )
  });
export default AppComponent;

 