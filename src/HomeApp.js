
import * as React from 'react';
import { View,ScrollView,FlatList,SafeAreaView ,Button,Text} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MainTabNavigator from './components/navigator/MainTabNavigator';
import ItemContacto from './components/contacto/ItemContacto';
import ListadoMensaje from './components/mensaje/ListadoMensaje';
import BuscarContacto from './components/buscador/BuscarContacto';
import  {requestApi}  from './api';
import modelMensajesUsuario from './db/mensajesUsuarios';
import modelVistaMensajesUsuario from './db/vistaMensajesUsuario';
import { actualizarListadoUsuarioVista } from "../src/store/actions";
//import   servicesMensajes from '../src/services/servicesMensajes';


import LocalNotification from '../src/NotifService';
import   style from '../src/css/HomeAppStyle';
const Tab = createMaterialTopTabNavigator();
const HomeComponent=React.forwardRef((props,ref) => {

  const useData= (vistaDefault)=>{
    const [paginaVista,setPagina] = React.useState(vistaDefault);
    const cambiarPagina=(val)=>{
    setPagina(val);
    }
    return {paginaVista,cambiarPagina}
  }
  const dispatch = useDispatch();
  const listadoContactosTotal = useSelector((state) => state.listadoContactosTotal);
  const dataUsuarioTelefono = useSelector((state) => state.dataUsuarioTelefono);
  const contactosMensajeVista = useSelector((state) => state.listadoUsuarioVista);
  const [contactoSeleccionado,setContactoSeleccionado] = React.useState(null); 
  const [buscadorActivo,setBuscadorActivo] = React.useState(false);
  const [textValorBuscador,setTextValorBuscador] = React.useState("");
  const [listadoContactos,setListadoContactos] = React.useState([]);
  const [listadoMensajes,setListadoMensajes] = React.useState([]);
  const [loading,setLoader] = React.useState(false);
  const {paginaVista,cambiarPagina}=useData("HOME");
  let notif={};
  const handleButtonPress = () => {
    LocalNotification();
  };
  React.useImperativeHandle(
     ref, () => ({
      listarMensajesUsuarioVista:async (mensajes) =>{
        listarMensajesUsuarioVista();
      },
       refrescarEstadoMensajeSincronizado:async (mensajes) =>{
        if(contactoSeleccionado!=null){
          //if(contactoSeleccionado.numero==value.origen){
            try {
              await refrescarEstadoMensajeSincronizado(mensajes);
            } catch (error) {
             // console.log("error",error);          
            }
          //}
          
        }

      },
      refrescarEstadoMensaje:async (mensajes) =>{
        try {
          await refrescarEstadoMensaje(mensajes[0]);
        } catch (error) {
         // console.log("error",error);          
        }
      },
      useRefrescarMensajes:async (value,nombre) =>{
        if(contactoSeleccionado!=null){
       
          if(contactoSeleccionado.numero==value.origen){
            setListadoMensajes(listadoMensajes => [...listadoMensajes, value]);
            let itemValue=await buscarContactoNumero(contactoSeleccionado.numero);
            if(nombre==null){
              nombre=value.origen;
            }
            console.log("contactoSeleccionado.numero==value.origen");
            modelVistaMensajesUsuario.registrarActualizar({
              numero:contactoSeleccionado.numero,
              usuario:nombre,
              mensaje:value.mensaje,
              visto:true
            });
            let numeroUsuario=contactoSeleccionado!=null ? contactoSeleccionado.numero : null;
            listarMensajesUsuarioVista(numeroUsuario);
          }
        }else{
          if(nombre==null){
            nombre=value.origen;
          }
          let itemValue=await buscarContactoNumero(value.origen);
          await modelVistaMensajesUsuario.registrarActualizar({
            numero:value.origen,
            usuario:nombre/*itemValue!=null ? itemValue.nombre : value.origen*/ ,
            mensaje:value.mensaje,
            visto:false
          });
          
          await refrescarMensajeVista({
            numero:value.origen,
            usuario:nombre,
            mensaje:value.mensaje,
          });
          await listarMensajesUsuarioVista();
        }
      }
    }),
    [contactoSeleccionado,listadoContactosTotal,contactosMensajeVista,listadoMensajes]
  );
  React.useEffect(() => {
    LocalNotification.localNotification({
      /* Android Only Properties */
      channelId:  'sound-channel-id' ,
      ticker: 'My Notification Ticker', // (optional)
      autoCancel: true, // (optional) default: true
      largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
      smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
      bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
      subText: 'This is a subText', // (optional) default: none
      color: 'red', // (optional) default: system default
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      tag: 'some_tag', // (optional) add tag to message
      group: 'group', // (optional) add group to message
      groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
      ongoing: false, // (optional) set whether this is an "ongoing" notification
      actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      when: null, // (optionnal) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
      usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
      timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

      /* iOS only properties */
      category: '', // (optional) default: empty string
      subtitle: "My Notification Subtitle", // (optional) smaller title below notification title

      /* iOS and Android properties */
      id: this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      title: 'Local Notification', // (optional)
      message: 'My Notification Message', // (required)
      userInfo: { screen: 'home' }, // (optional) default: {} (using null throws a JSON value '<null>' error)
      playSound: true, // (optional) default: true
      soundName:  'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
      number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    });;
  }, [] );
  React.useEffect(() => {
   
  }, [listadoContactosTotal,contactosMensajeVista] );
  const listarMensajesUsuarioVista =React.useCallback( (e) => {
    console.log("listData-cargar-listarMensajesUsuarioVista");
    modelVistaMensajesUsuario.listar().then((listData)=>{
    
      dispatch(actualizarListadoUsuarioVista(listData));
    });
  },[contactosMensajeVista]);
  const refrescarImagen  =React.useCallback( (e) => {
    let temData=[...contactosMensajeVista];
    contactosMensajeVista.forEach(element => {
      
    });
  },[contactosMensajeVista]);
  const refrescarMensajeVista =React.useCallback( (e) => {
    let existe=false;
    const newcontactosMensajeVista = {...contactosMensajeVista};
    Object.entries(newcontactosMensajeVista).forEach(([key, value]) => {
      if(value.numero==e.numero){
        existe=true;
        value.horaUltimoMensaje=e.horaUltimoMensaje;
        value.fechaEnvio=e.fechaEnvio;
        value.nombre=e.usuario;
        value.mensaje=e.mensaje;
        value.ultimoMensaje=e.ultimoMensaje;
        newcontactosMensajeVista[key]=value;
      }
    });
    if(existe==false){
      console.log("e");
      e.nombre=e.usuario;
      console.log("newcontactosMensajeVista",e);
      newcontactosMensajeVista[e.numero]=e;

      //newcontactosMensajeVista.push(e);
      dispatch(actualizarListadoUsuarioVista(newcontactosMensajeVista));
    }else{
      dispatch(actualizarListadoUsuarioVista(newcontactosMensajeVista));
    }
  },[contactosMensajeVista]);

  const setContactosVis=React.useCallback((newcontactosMensajeVista)=>{
    dispatch(actualizarListadoUsuarioVista(newcontactosMensajeVista));
  });

  const refrescarMensajesScrooll=async(numero,reqId,nuevoMensaje)=>{

    if(nuevoMensaje==true){
      let dataTemp=reqId;
      modelMensajesUsuario.listarMensajeUsuarioPaginadoDespues(numero,contactoSeleccionado.numero,dataTemp).
      then(async(listData)=>{
        let temData=[...listadoMensajes];
       
        if(listData.length>0){
         await  listData.map((value,index)=>{
            temData.unshift(value);
          });
          setListadoMensajes(temData);
        }
      });

      return false;
    }
    
    
    modelMensajesUsuario.listarMensajeUsuarioPaginado(numero,contactoSeleccionado.numero,reqId).
    then(async(listData)=>{
      let temData=[...listadoMensajes];
      if(listData.length>0){
       await  listData.map((value,index)=>{
          //temData.push(listData[listData.length-index-1]);
          temData.unshift(value);
        });
       
        await setListadoMensajes(temData);
      }
    });
  };
  const refrescarVista=React.useCallback(async(request)=>{
    let temData=[...listadoMensajes];
    let dataPe=temData.length ? temData[temData.length-1].fechaEnvio : null;
    let listData=await modelMensajesUsuario.listarMensajeUsuarioPaginadoDespues(request.origen,request.destino,dataPe);
    listData.map((value)=>{
      temData.push(value);
    });
    setListadoMensajes(temData);
    
  });
  
  const refrescarEstadoMensajeSincronizado=React.useCallback(async(request)=>{
    let temData=[...listadoMensajes];
    let listData=await modelMensajesUsuario.obtenerEstadoMensajeDespuesSincronizar(request);
    temData.map((value)=>{
      if(value.id==request.idLocalId){
        value.idmensajeapi=listData.length ? listData[0].idmensajeapi :null;
      }
    });
    setListadoMensajes(temData);
    
  },[listadoMensajes]);
  const refrescarEstadoMensaje=React.useCallback(async(request)=>{
    let temData=[...listadoMensajes];
    let listData=await modelMensajesUsuario.obtenerEstadoMensajeDespues(request.idLocalId);
    temData.map((value)=>{
      if(value.id==request.idLocalId){
        
        value.idmensajeapi=listData.length ? listData[0].idmensajeapi :null;
      }
    });
    setListadoMensajes(temData);
    
  },[listadoMensajes]);
  const listarMensajesUsuario= React.useCallback(async(e) => {
    let fechaMaxima=await modelMensajesUsuario.obtenerFechaMaxima(e);
    modelMensajesUsuario.listarMensajeUsuario(e.origen,e.destino).then(async(listData)=>{
      listData=listData.reverse ();
      setListadoMensajes(listData);
    });
  }, [listadoMensajes, setListadoMensajes]);
  const onCambiarActivaBuscador=React.useCallback((data)=>{
    setBuscadorActivo(data);
  },[]);
  const buscarContacto=React.useCallback((data)=>{
    setTextValorBuscador(data);
    filtrosContactos(data);
   
  },[listadoContactosTotal]);

  const filtrosContactos =React.useCallback(async(data) => {
    let tempList=[];
    Object.entries(listadoContactosTotal).forEach(([key, value]) => {
      if(value.nombre.toUpperCase().indexOf(data.toUpperCase())>-1){
        tempList.push(value);
        setListadoContactos(tempList);
      }
      
    });
},[listadoContactosTotal,setListadoContactos]);
const buscarContactoNumero=React.useCallback(async(numeroBus)=>{
  let filtro=[];
  if(listadoContactosTotal.length>0){
    await Object.entries(listadoContactosTotal).forEach(([key, value]) => {
      if(value.numero==numeroBus){
        filtro.push(value);
      }
      
    });
    return    filtro.length ? filtro[0] : null;
  
  }
  return    null;

},[]);
/*
const obtenerDatosUsuarioApi=React.useCallback(async(numero)=>{
  let dataUser=await servicesMensajes.obtenerDatosUsuario(numero);
  return dataUser ;
});*/
const seleccionarContacto=React.useCallback( (item)=>{
  setContactoSeleccionado(item); 
  cambiarPagina("MENSAJEVISTA") ;
  setBuscadorActivo(false) ;
  listarMensajesUsuario({
    origen:dataUsuarioTelefono.numero,
    destino:item.numero
  }).then(()=>{

    setListadoContactos([]);
  });
},[]);
const onCambioVista=React.useCallback( (data)=>{
  cambiarPagina(data);
  if(data=="HOME"){
    setContactoSeleccionado(null);
   setListadoMensajes([]);
  }
  listarMensajesUsuarioVista();
});
/*
  YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', // TODO: Remove when fixed
  ])*/

  const onContactoSeleccionado=React.useCallback((data)=>{
    setContactoSeleccionado(data);
    cambiarPagina("MENSAJESCONTACTO");

  });
  const ListadoContactosScreen= React.memo((props)=> {
    const seleccionarContacto =  (data) => {
      props.onContactoSeleccionado(data);
      cambiarPagina("CONTACTO");
      listarMensajesUsuario({
        origen:dataUsuarioTelefono.numero,
        destino:data.numero,
      }).then(()=>{
        modelVistaMensajesUsuario.actualizarVistaNumeroVista(data.numero);
      });
           
    }
    React.useEffect(() => {
      
    }, [] );

    const DetalleContacto=React.memo((props)=>{
      return(
     
        <ItemContacto  data={props.item} seleccionarContacto={seleccionarContacto}  />
)
    }
    );
      return (
            <>
          <Button title={'Local Push Notification'} onPress={handleButtonPress} />
            <FlatList 
              initialNumToRender={ Object.entries(contactosMensajeVista).length}
              style={{ flex: 0 }}
              contentContainerStyle={style.contentContainerStyle}    
              keyExtractor={(item,index) => (index.toString())}    
              data={ Object.values(contactosMensajeVista)}
              renderItem={({ index,item }) => (
                <View
                style={{
                  marginTop: 0,
                  width: '100%'
                }}
              >
              <DetalleContacto key={index} item={item}/>
              
            </View>
            
            )}
            /></>
      );
  });
  const Historial=React.memo( (props)=> {
    const seleccionarContacto =  (data) => {
      listarMensajesUsuario({
        origen:dataUsuarioTelefono.numero,
        destino:data.numero,
      }).then(()=>{
        props.onContactoSeleccionado(data);
        cambiarPagina("CONTACTO");
      });
           
    }
      return (
        <ScrollView style={{flex: 1}} nestedScrollEnabled={true}  >
          <Text>aaaaaaaaaaaaaa</Text>
        </ScrollView>
      );
  });
  return (
    <>
    {
      loading ?
      <Text></Text>
      :
      (
      <>
        {
          paginaVista!='HOME' ?
          (<>
            <ListadoMensaje 
              lengthMensajes={listadoMensajes.length}
              listadoMensajes={listadoMensajes} 
              listarMensajesUsuario={listarMensajesUsuario}
              refrescarMensajesScrooll={refrescarMensajesScrooll}
              refrescarVista={refrescarVista}
              numero={dataUsuarioTelefono.numero}
              contactoSeleccionado={contactoSeleccionado}
              seleccionarContacto={seleccionarContacto} 
              onCambioVista={onCambioVista}/>
          </>) :
          (  <>
            <MainTabNavigator {...props} onCambiarActivaBuscador={onCambiarActivaBuscador} buscarContacto={buscarContacto}/>
            {
              buscadorActivo ? 
             
  
                <BuscarContacto seleccionarContacto={seleccionarContacto} listDataContacto={listadoContactos} />
               : 
                <NavigationContainer >
                    <Tab.Navigator >
                    <Tab.Screen   name="Mensajes" children={(props)=><ListadoContactosScreen  onContactoSeleccionado={onContactoSeleccionado} /> }>
                      
                    </Tab.Screen>
                    <Tab.Screen   name="Historias"  onCambioVista={onCambioVista}  children={(props)=><Historial/> }>
                     
                    </Tab.Screen>
                  </Tab.Navigator>
                </NavigationContainer>
              
             
            }
    </>) 
        }
      </>
        
        )
    }
    </>

  );
  });
export default React.memo(HomeComponent);

 