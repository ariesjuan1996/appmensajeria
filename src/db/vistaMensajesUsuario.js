import Database from './database';
import modelContacto from './contactos';

import {momentGlobal} from '../context/momentConfig';
const init=async()=>{
    let results = await Database.executeSql("CREATE TABLE IF NOT EXISTS vistaMensajesUsuario(id INTEGER PRIMARY KEY,usuario text NOT NULL,mensaje text NOT NULL,fechaEnvio text NOT NULL,numero text NOT NULL,numeromensajesnoleidos text NOT NULL,tipomensaje text  NULL);",[]);
    //let results = await Database.executeSql("drop TABLE  IF  EXISTS mensajesUsuarios;",[]);
}
const registrarActualizar =async(data) => {
   try {
    await init();
    let visto=data.visto  ;
    let existeNombreUsuario=data.usuario==null || data.usuario=="" || data.usuario==undefined ? false : true;
    let numero=("'"+data.numero+"'");
    let usuario=existeNombreUsuario ? ("'"+data.usuario+"'") : numero;
    let mensaje=("'"+data.mensaje+"'");
    let tipomensaje=("'"+data.tipomensaje+"'");
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
            let cantidadVisto=0;
            if(!visto){
                let generarNumeroVisto = await Database.executeSql("select numeromensajesnoleidos from vistaMensajesUsuario where  numero="+numero+";",[]);
                cantidadVisto=generarNumeroVisto.rows.raw().length ? (generarNumeroVisto.rows.raw()[0].numeromensajesnoleidos==null ? 0 :generarNumeroVisto.rows.raw()[0].numeromensajesnoleidos ): (0) ;
                cantidadVisto=parseInt(cantidadVisto)+1;
            }
            
            let mensajeFormat=mensaje;
            let resposeRegistroUsuario = await Database.executeSql("insert into vistaMensajesUsuario(usuario,mensaje,fechaEnvio,numero,numeromensajesnoleidos,tipomensaje) values("+usuario+","+mensajeFormat+","+tempFechaEnvio+","+numero+","+cantidadVisto+","+tipomensaje+");",[]);
            return resposeRegistroUsuario;
            return null;
        }
        return "ok";
    }else{
        let responseValidFecha = await Database.executeSql("select max(fechaEnvio)  as cantidadFecha from vistaMensajesUsuario where  numero="+numero+";",[]);
        let fechaMax=responseValidFecha.rows.raw()[0].cantidadFecha;

        if(fechaMax==null || fechaMax=="" || ( !(fechaMax==null || fechaMax=="") && stringSinComillas>fechaMax )){
            let cantidadVisto=0;
            if(!visto){
                let generarNumeroVisto = await Database.executeSql("select numeromensajesnoleidos from vistaMensajesUsuario where  numero="+numero+";",[]);
                cantidadVisto=generarNumeroVisto.rows.raw().length ? (generarNumeroVisto.rows.raw()[0].numeromensajesnoleidos==null ? 0 :generarNumeroVisto.rows.raw()[0].numeromensajesnoleidos ): (0) ;
                cantidadVisto=parseInt(cantidadVisto)+1;
            }
            let resposeRegistroUsuario = await Database.executeSql("update vistaMensajesUsuario set usuario="+usuario+",mensaje="+mensaje+",fechaEnvio="+tempFechaEnvio+",numeromensajesnoleidos="+cantidadVisto+",tipomensaje="+tipomensaje+" where numero="+numero+" ;",[]);
            return resposeRegistroUsuario;
        }
        return "ok";
    }
   } catch (error) {
       return null;
   }
    
};
const actualizarVistaNumeroVista =async(data) => {
    try {
     await init();//",numeromensajesnoleidos="+cantidadVisto+
     let resposeRegistroUsuario = await Database.executeSql("update vistaMensajesUsuario set "+"numeromensajesnoleidos=0 where numero="+data+" ;",[]);
     return resposeRegistroUsuario;
    } catch (error) {
    }
     
 };
const listar =async() => {
    let tempData=[];
    try {
        await init();
        await modelContacto.init();
        //id INTEGER PRIMARY KEY,usuario text NOT NULL,mensaje text NOT NULL,fechaEnvio text NOT NULL
        let listado = await Database.executeSql("select vistaMensajesUsuario.numero,id,usuario as nombre,mensaje as mensaje,vistaMensajesUsuario.fechaEnvio,contacto.imagen as imagenContacto,vistaMensajesUsuario.numeromensajesnoleidos,vistaMensajesUsuario.tipomensaje  from vistaMensajesUsuario as vistaMensajesUsuario left join contacto as contacto on contacto.numero=vistaMensajesUsuario.numero  order by  vistaMensajesUsuario.fechaEnvio desc;",[]);
        tempData=listado.rows.raw();
        tempData.forEach(element => {
          element.horaUltimoMensaje=momentGlobal(element.fechaEnvio).format("HH:mm");
        });
        return tempData;        
    } catch (error) {

    }
    return tempData;

};
export default {listar,registrarActualizar,actualizarVistaNumeroVista};