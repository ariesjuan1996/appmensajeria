import Database from './database';
import vistaMensaje from './vistaMensajesUsuario';
const init=async()=>{
    let results = await Database.executeSql("CREATE TABLE IF NOT EXISTS mensajesUsuarios(id INTEGER PRIMARY KEY,destino text NOT NULL,origen text NOT NULL,mensaje text NOT NULL,fechaEnvio text NOT NULL,idmensajeapi text  NULL,fecharegistromensajeapi text  NULL);",[]);
    //let results = await Database.executeSql("drop TABLE  IF  EXISTS mensajesUsuarios;",[]);
}

const registrarMensajeEnvio =async(data) => {
    await init();
    let tempOrigen=("'"+data.origen+"'");
    let tempDestino=("'"+data.destino+"'");
    let tempMensaje=("'"+data.mensaje+"'");
    let tempFechaEnvio=("'"+data.fechaEnvio+"'");
    let resposeRegistroUsuario = await Database.executeSql("insert into mensajesUsuarios(destino,mensaje,fechaEnvio,origen) values("+tempDestino+","+tempMensaje+","+tempFechaEnvio+","+tempOrigen+");",[]);
    return resposeRegistroUsuario.insertId;
};
const actualizarUsuarioVisto =async(data) => {
    await init();
    let tempId=(""+data.id+"");
    let tempEnviado=data.idApi;
    let fechaRegistro=data["fechaRegistro"]==null || data["fechaRegistro"]=="" ? ("null") : ("'"+data["fechaRegistro"]+"'");
    let resposeRegistroUsuario = await Database.executeSql(     "update mensajesUsuarios set idmensajeapi='"+tempEnviado+"',fecharegistromensajeapi="+fechaRegistro+" where id="+tempId+";",[]);
    return resposeRegistroUsuario;
};
const actualizarListadoUsuarioVista =async(data) => {
    await init();
    try {
        let idActualizados=[];
        data.forEach(async(element) => {
          try {
            let tempId=(""+element.id+"");
            let tempEnviado=element.idmensajeapi;
            let fechaRegistro=element["fechaRegistro"]==null || element["fechaRegistro"]=="" ? ("null") : ("'"+element["fechaRegistro"]+"'");
            let resposeRegistroUsuario = await Database.executeSql(     "update mensajesUsuarios set idmensajeapi='"+tempEnviado+"',fecharegistromensajeapi="+fechaRegistro+" where id="+tempId+";",[]);
            idActualizados.push(tempId);
            
          } catch (error) {

            console.log("error",error);
          }        
        });
        console.log("idActualizados:_-okkkk ",idActualizados);
        return idActualizados.join();                
    } catch (error) {
        return false;
    }
    
};
const obtenerFechaMaxima =async(data) => {
    await init();
    let resposeRegistroUsuario = await Database.executeSql("select max(mensajes.fechaEnvio) as fechaMaxima from mensajesUsuarios as mensajes where ((mensajes.origen='"+data.origen+"' and mensajes.destino='"+data.destino+"') OR (mensajes.origen='"+data.origen+"' and mensajes.destino='"+data.origen +"') )",[]);
    return resposeRegistroUsuario.rows.raw()[0].fechaMaxima;
};

const listarMensajeUsuario =async(reqnumeroorigen,reqnumerodestino) => {
    await init();
    //destino text NOT NULL,origen
    let resposeRegistroUsuario = await Database.executeSql("SELECT * FROM mensajesUsuarios as mensajes WHERE  ((mensajes.origen='"+reqnumeroorigen+"' and mensajes.destino='"+reqnumerodestino+"') OR (mensajes.origen='"+reqnumerodestino+"' and mensajes.destino='"+reqnumeroorigen+"') ) ORDER BY mensajes.fechaenvio desc limit 0,15;",[]);
    return resposeRegistroUsuario.rows.raw();
};
const listarMensajeUsuarioPaginado =async(reqnumeroorigen,reqnumerodestino,reId) => {
    await init();
    if(reId==null || reId==""){
       let data =await listarMensajeUsuario(reqnumeroorigen,reqnumerodestino);
       return data;
    }
    //destino text NOT NULL,origen
    let sql= "SELECT * FROM mensajesUsuarios as mensajes WHERE  ((mensajes.origen='"+reqnumeroorigen+"' and mensajes.destino='"+reqnumerodestino+"') OR (mensajes.origen='"+reqnumerodestino+"' and mensajes.destino='"+reqnumeroorigen+"' )  ) and fechaenvio<'"+reId+"'  ORDER BY mensajes.fechaenvio desc  limit 0,5;";
    let resposeRegistroUsuario = await Database.executeSql( sql,[]);
    let datosData=resposeRegistroUsuario.rows.raw();
    return datosData;
};
const listarMensajeUsuarioPaginadoDespues =async(reqnumeroorigen,reqnumerodestino,reId) => {
    await init();

    if(reId==null || reId==""){
        let data =await listarMensajeUsuario(reqnumeroorigen,reqnumerodestino);
        return data;
     }
    //destino text NOT NULL,origen
    let sql= "SELECT * FROM mensajesUsuarios as mensajes WHERE  ((mensajes.origen='"+reqnumeroorigen+"' and mensajes.destino='"+reqnumerodestino+"') OR (mensajes.origen='"+reqnumerodestino+"' and mensajes.destino='"+reqnumeroorigen+"' )  ) and fechaenvio>'"+reId+"'  ORDER BY mensajes.fechaenvio asc  ";
    let resposeRegistroUsuario = await Database.executeSql( sql,[]);
    return resposeRegistroUsuario.rows.raw();
};
const obtenerEstadoMensajeDespues =async(reId) => {
    await init();
    let sql= "SELECT * FROM mensajesUsuarios as mensajes WHERE    id>="+reId+"  ORDER BY mensajes.fechaenvio asc;";
    let resposeRegistroUsuario = await Database.executeSql( sql,[]);
    return resposeRegistroUsuario.rows.raw();
};
const obtenerEstadoMensajeDespuesSincronizar =async(reId) => {
    await init();
    let sql= "SELECT * FROM mensajesUsuarios as mensajes WHERE    id IN ("+reId+")  ORDER BY mensajes.fechaenvio asc;";
    let resposeRegistroUsuario = await Database.executeSql( sql,[]);
    return resposeRegistroUsuario.rows.raw();
};
const obtenerMensajesSinEnviar =async(reId) => {
    await init();
    let sql= "SELECT * FROM mensajesUsuarios as mensajes where mensajes.idmensajeapi is null;";
    let resposeRegistroUsuario = await Database.executeSql( sql,[]);
    return resposeRegistroUsuario.rows.raw();
};
//,dataUsuarioTelefono.numero,listadoContactosTotal
const registrarMensajeMasivo =async(request,numero,listadoTotal) => {
    await init();
    let stadoRegistro=false;
    try {
        console.log("request",request);
        await request.forEach(async(element) => {
            let tempIdMensajeApi=("'"+element.id+"'");
            let responseValid = await Database.executeSql("select count(*) as cantidad from mensajesUsuarios where idmensajeapi="+tempIdMensajeApi+";",[]);
            if(responseValid.rows.raw()[0].cantidad==0){
                let tempOrigen=("'"+element.origen+"'");
                let tempDestino=("'"+element.destino+"'");
                let tempMensaje=("'"+element.mensaje+"'");
                let tempFechaRegistro=("'"+element.fechaRegistro+"'");
                let tempFechaEnvio=("'"+element.fechaEnvio+"'");
                let usuario=listadoTotal[element.origen]==null || listadoTotal[element.origen]=="" || listadoTotal[element.origen]=="" ? null :listadoTotal[element.origen].nombre;
                await vistaMensaje.registrarActualizar({
                    numero:element.origen,
                    mensaje:element.mensaje,
                    fechaRegistroApi:element.fechaRegistro,
                    usuario:usuario
                });
                let resposeRegistroUsuario = await Database.executeSql("insert into mensajesUsuarios(destino,mensaje,fechaEnvio,origen,fecharegistromensajeapi,idmensajeapi) values("+tempDestino+","+tempMensaje+","+tempFechaEnvio+","+tempOrigen+","+tempFechaRegistro+","+tempIdMensajeApi+");",[]);
            }
            
        });
        stadoRegistro=true;
        return stadoRegistro;
    } catch (error) {
        console.log("error",error);
        stadoRegistro=false;
        return stadoRegistro;
    }
};
export default {registrarMensajeEnvio,actualizarUsuarioVisto,obtenerFechaMaxima ,listarMensajeUsuario,listarMensajeUsuarioPaginado,listarMensajeUsuarioPaginadoDespues,obtenerEstadoMensajeDespues,obtenerMensajesSinEnviar,actualizarListadoUsuarioVista,obtenerEstadoMensajeDespuesSincronizar,registrarMensajeMasivo};