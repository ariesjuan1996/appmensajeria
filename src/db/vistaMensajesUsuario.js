import Database from './database';
import modelContacto from './contactos';

import {momentGlobal} from '../context/momentConfig';
const init=async()=>{
    let results = await Database.executeSql("CREATE TABLE IF NOT EXISTS vistaMensajesUsuario(id INTEGER PRIMARY KEY,usuario text NOT NULL,mensaje text NOT NULL,fechaEnvio text NOT NULL,numero text NOT NULL);",[]);
    //let results = await Database.executeSql("drop TABLE  IF  EXISTS mensajesUsuarios;",[]);
}
const registrarActualizar =async(data) => {
   try {
    await init();
    let numero=("'"+data.numero+"'");
    let usuario=("'"+data.usuario+"'");
    let mensaje=("'"+data.mensaje+"'");
    let stringSinComillas=null;
    let tempFechaEnvio=data.fechaRegistroApi==undefined || data.fechaRegistroApi=="" || data.fechaRegistroApi==null ? null : ("'"+momentGlobal(data.fechaRegistroApi).format("YYYY-MM-DD HH:mm:ss")+"'") ;
    if(tempFechaEnvio==null){
        stringSinComillas=momentGlobal().format("YYYY-MM-DD HH:mm:ss");
        tempFechaEnvio=("'"+momentGlobal().format("YYYY-MM-DD HH:mm:ss")+"'");
    }else{
        stringSinComillas=momentGlobal(data.fechaRegistroApi).format("YYYY-MM-DD HH:mm:ss");
    }
    let response = await Database.executeSql("select count(*) as cantidad from vistaMensajesUsuario where numero="+numero+";",[]);
    if(response.rows.raw()[0].cantidad==0){
        let responseValidFecha = await Database.executeSql("select max(fechaEnvio)  as cantidadFecha from vistaMensajesUsuario where numero="+numero+";",[]);
        let fechaMax=responseValidFecha.rows.raw()[0].cantidadFecha;
        if(fechaMax==null || fechaMax=="" || ( !(fechaMax==null || fechaMax=="") && stringSinComillas>fechaMax )){
            let resposeRegistroUsuario = await Database.executeSql("insert into vistaMensajesUsuario(usuario,mensaje,fechaEnvio,numero) values("+usuario+","+mensaje+","+tempFechaEnvio+","+numero+");",[]);
            return resposeRegistroUsuario;
        }
        return "ok";
    }else{
        let responseValidFecha = await Database.executeSql("select max(fechaEnvio)  as cantidadFecha from vistaMensajesUsuario where  numero="+numero+";",[]);
        console.log("responseValidFecha",responseValidFecha.rows.raw()[0].cantidadFecha);
        let fechaMax=responseValidFecha.rows.raw()[0].cantidadFecha;

        if(fechaMax==null || fechaMax=="" || ( !(fechaMax==null || fechaMax=="") && stringSinComillas>fechaMax )){
            let resposeRegistroUsuario = await Database.executeSql("update vistaMensajesUsuario set usuario="+usuario+",mensaje="+mensaje+",fechaEnvio="+tempFechaEnvio+"where numero="+numero+" ;",[]);
            return resposeRegistroUsuario;
        }
        return "ok";
    }
   } catch (error) {
        console.log("Okkkk-error:",error);  
   }
    
};
const listar =async(data) => {
    let tempData=[];
    try {
        await init();
        await modelContacto.init();
        //id INTEGER PRIMARY KEY,usuario text NOT NULL,mensaje text NOT NULL,fechaEnvio text NOT NULL
        let listado = await Database.executeSql("select vistaMensajesUsuario.numero,id,usuario as nombre,mensaje as mensaje,vistaMensajesUsuario.fechaEnvio,contacto.imagen as imagenContacto from vistaMensajesUsuario as vistaMensajesUsuario left join contacto as contacto on contacto.numero=vistaMensajesUsuario.numero  order by  vistaMensajesUsuario.fechaEnvio desc;",[]);
        tempData=listado.rows.raw();
        tempData.forEach(element => {
          element.horaUltimoMensaje=momentGlobal(element.fechaEnvio).format("HH:mm");
        });
        return tempData;        
    } catch (error) {

    }
    return tempData;

};
export default {listar,registrarActualizar};