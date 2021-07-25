import Database from '../db/database';
import  {requestApi}  from '../api';
import modelMensajesUsuario from '../db/mensajesUsuarios';

import { useSelector } from "react-redux";
import RNFetchBlob from 'react-native-fetch-blob';
const init=async()=>{
    results = await Database.executeSql("CREATE TABLE IF NOT EXISTS contacto(id INTEGER PRIMARY KEY,nombre TEXT NOT NULL,telefono TEXT NOT NULL UNIQUE);",[]);
   
}
const listarMensajesUsuario =async(e) => {
    try {
        let fechaMaxima=await modelMensajesUsuario.obtenerFechaMaxima(e);
        let listData=await modelMensajesUsuario.listarMensajeUsuario(e.origen,e.destino);
        let response=await requestApi(
        "usuarios/listarMensajes?origen="+e.origen+"&destino="+e.destino+"&fechaMinima="+(fechaMaxima==null ? "" : fechaMaxima),
        {
        },
        "get"
        );
       
        let responseData=response.estado ? response.data : [];
        responseData.forEach(element => {
            modelMensajesUsuario.registrarMensajeEnvio({
                destino:element.destino,
                mensaje:element.mensaje,
                fechaEnvio:element.fechaEnvio,
                origen:element.origen,
                tipomensaje:element.tipomensaje
            });
            listData.push({
                destino:element.destino,
                mensaje:element.mensaje,
                fechaEnvio:element.fechaEnvio,
                origen:element.origen,
                tipomensaje:element.tipomensaje
            });
        });
        return  listData;
    } catch (error) {
    }
    return [];
};

const obtenerDatosUsuario =async(numeroUsuarios) => {
    try {
       
        let response=await requestApi(
        "usuarios/obtenerdataUsuario",
        {
            numeroUsuarios:numeroUsuarios
        },
        "post"
        );
        let data=response.estado ? (response.data.length ? response.data : null) : null;
        return {
            estado:data ? true : false,
            data:data,
            errorPeticion:false
        };        
    } catch (error) {
        return {
            estado:false,
            mensaje:"Hubo un error en la peticiòn.",
            errorPeticion:true
        };
    }finally{
       
    }
    
};
const descargarImagen = async (directorioImagenesMensajes,url) => {
    try {
      const assetsDirExists = await RNFetchBlob.fs.isDir(directorioImagenesMensajes);

      if (!assetsDirExists) {
          await RNFetchBlob.fs.mkdir(directorioImagenesMensajes);
      }
      let extension=url.split(".")[url.split(".").length-1];
      var d=new Date();
      let nameFile=d.getTime();
      var path = directorioImagenesMensajes +nameFile+ '.'+extension;


      let response=await RNFetchBlob
      .config({
          path :path
      })
      .fetch('GET', url);
      const saveImage=await RNFetchBlob.fs.scanFile([ { path : response.path(), mime : 'image/'+extension } ]);
      return nameFile+ '.'+extension;      
    } catch (error) {
        return null;
      
    }



  };
export default {listarMensajesUsuario,obtenerDatosUsuario ,descargarImagen};