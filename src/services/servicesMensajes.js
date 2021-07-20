import Database from '../db/database';
import  {requestApi}  from '../api';
import modelMensajesUsuario from '../db/mensajesUsuarios';

import modelVistaMensajesUsuario from '../db/vistaMensajesUsuario';
import {momentGlobal} from '../context/momentConfig';

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
        //console.log("sed listData",listData);
        return  listData;
    } catch (error) {
//console.log("sed listData error",error);
    }
    return [];
};
const enviarMensaje =async(e) => {
    try {
        

        return   ;
    } catch (error) {
    }finally{
        
    }
    return {
        estado:false,
        mensaje:"Hubo un error en el envio del mensaje."
    };
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
export default {listarMensajesUsuario,enviarMensaje,obtenerDatosUsuario };