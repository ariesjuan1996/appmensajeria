
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
import * as RNFS from 'react-native-fs';
//import  modelMensajesUsuarios from './db/mensajesUsuarios';
import RNFetchBlob from 'react-native-fetch-blob';
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
  const [listaImagenes,setListaImagenes] = React.useState([]);
  const [listaImagenesRuta,setListaImagenesRuta] = React.useState([]);
  const {paginaVista,cambiarPagina}=useData("HOME");
  const directorioImagenesMensajes = useSelector((state) => state.directorioImagenesMensajes);
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
            }
          //}
          
        }

      },
      refrescarEstadoMensaje:async (mensajes) =>{
        try {
          await refrescarEstadoMensaje(mensajes[0]);
        } catch (error) {
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
            modelVistaMensajesUsuario.registrarActualizar({
              numero:contactoSeleccionado.numero,
              usuario:nombre,
              mensaje:value.mensaje,
              visto:true,
              tipomensaje:value.tipomensaje
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
            visto:false,
            tipomensaje:value.tipomensaje,
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
   
  }, [listadoContactosTotal,contactosMensajeVista] );
  const listarMensajesUsuarioVista =React.useCallback( (e) => {
    modelVistaMensajesUsuario.listar().then((listData)=>{
    
      dispatch(actualizarListadoUsuarioVista(listData));
    });
  },[contactosMensajeVista]);
  const refrescarImagenes=()=>{
    actualizarListadoImagenes(contactoSeleccionado.numero,dataUsuarioTelefono.numero);
  }
  const actualizarListadoImagenes=async(numeroDestino,numeroOrigen)=>{
    const base64 = RNFetchBlob.base64;
    let listadoFormato =await modelMensajesUsuario.listarImagenes(numeroDestino,numeroOrigen);
    let tempImagenes=[];
    let tempImagenesRutas=[];
    await listadoFormato.forEach(async(element) => {
        if(element.tipomensaje=="imagen"){
          tempImagenesRutas.push(directorioImagenesMensajes+element.mensaje);
          setListaImagenesRuta(tempImagenesRutas);
          let base64si=await RNFS.readFile(directorioImagenesMensajes+element.mensaje, 'ascii');
          let mine=element.mensaje.split(".")[1];
          const codificada=base64.encode(base64si);
          let base64Formatos="data:"+mine+";base64,"+codificada;
          tempImagenes.push({url:base64Formatos});
          setListaImagenes(tempImagenes);
        
        }
    });
   
   
  }
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
      e.nombre=e.usuario;
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
    //let fechaMaxima=await modelMensajesUsuario.obtenerFechaMaxima(e);
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
        actualizarListadoImagenes(data.numero,dataUsuarioTelefono.numero);
        modelVistaMensajesUsuario.actualizarVistaNumeroVista(data.numero);
      });
           
    }
 
    const DetalleContacto=React.memo((props)=>{
      return(
     
        <ItemContacto  data={props.item} seleccionarContacto={seleccionarContacto}  />
)
    }
    );
      return (
            <>
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
              listaImagenes={listaImagenes} 
              listarMensajesUsuario={listarMensajesUsuario}
              refrescarMensajesScrooll={refrescarMensajesScrooll}
              refrescarVista={refrescarVista}
              numero={dataUsuarioTelefono.numero}
              contactoSeleccionado={contactoSeleccionado}
              seleccionarContacto={seleccionarContacto} 
              onCambioVista={onCambioVista}
              refrescarImagenes={refrescarImagenes}
              listaImagenesRuta={listaImagenesRuta}/>
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
                    <Tab.Screen   name="Datos"  onCambioVista={onCambioVista}  children={(props)=><Historial/> }>
                     
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

 