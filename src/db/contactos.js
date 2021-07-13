import Database from './database';
const init=async()=>{
    results = await Database.executeSql("CREATE TABLE IF NOT EXISTS contacto(numero TEXT NOT NULL,imagen TEXT NOT NULL,imagenNombre TEXT  NULL);",[]);
}
const registrarContactos =async(e) => {
    await init();
    let numero=("'"+data.numero+"'");
    let nombreImagen=data.nombreImagen!=null ? "'"+data.nombreImagen+"'" : "null";
    let imagen=!(data.imagen==null || data.imagen=="" )? ("'"+data.imagen+"'") : "null" ;
    let response = await Database.executeSql("select count(*) as cantidad from contacto where numero="+numero+";",[]);
    if(response.rows.raw()[0].cantidad==0){
        let resposeRegistroUsuario = await Database.executeSql("insert into contacto(numero,imagen,nombreImagen) values("+numero+","+imagen+",nombreImagen"+nombreImagen+");",[]);
        return resposeRegistroUsuario;
    }else{
        let resposeRegistroUsuario = await Database.executeSql("update contacto set imagen="+imagen+",nombreImagen="+nombreImagen+" where numero="+numero+";",[]);
        return resposeRegistroUsuario;
    }
  
};
const actualizarContacto =async(data) => {
    await init();
    let imagen=data.imagen!=null ? "'"+data.imagen+"'" : "null";
    let nombreImagen=data.nombreImagen!=null ? "'"+data.nombreImagen+"'" : "null";
    let numero="'"+data.numero+ "'";
    let resposeExisteUsuario = await Database.executeSql("select count(*) from contacto where numero="+numero+ ";",[]);
    let existeUsuario=resposeExisteUsuario.rows.raw();
    if(existeUsuario.length){
        let resposeRegistroUsuario = await Database.executeSql("update contacto set imagen="+imagen+"nombreImagen='"+nombreImagen+"' where numero="+numero+";",[]);
        return resposeRegistroUsuario;
    }else{
        let resposeRegistroUsuario = await Database.executeSql("insert into contacto(numero,imagen,nombreImagen) values("+numero+","+imagen+","+numero+","+nombreImagen+");",[]);
        return resposeRegistroUsuario;
    }

};
const actualizarUsuarioImagen=async(numero,imagen,nombreImagen)=>{
    
    //let resposeRegistroUsuario = await Database.executeSql( "update contacto set imagen='"+imagen+"',imagenNombre='"+nombreImagen+ "' where numero='"+numero+"';",[]);
    //return resposeRegistroUsuario;
    

    imagen=imagen!=null ? "'"+imagen+"'" : "null";
    nombreImagen=nombreImagen!=null ? "'"+nombreImagen+"'" : "null";
    numero="'"+numero+ "'";
    let resposeExisteUsuario = await Database.executeSql("select count(*) as cantidad from contacto where numero="+numero+ ";",[]);
   
    let existeUsuario=resposeExisteUsuario.rows.raw();
    if(existeUsuario[0].cantidad){
        let resposeRegistroUsuario = await Database.executeSql("update contacto set imagen="+imagen+",imagenNombre="+nombreImagen+" where numero="+numero+";",[]);
        return resposeRegistroUsuario;
    }else{
        let resposeRegistroUsuario = await Database.executeSql("insert into contacto(numero,imagen,imagenNombre) values("+numero+","+imagen+","+nombreImagen+");",[]);
        return resposeRegistroUsuario;
    }
}
const obtenerDatosUsuarioContacto=async(numero)=>{
    let resposeRegistroUsuario = await Database.executeSql("select numero,imagen from contacto where numero='"+numero+"';",[]);
    return resposeRegistroUsuario.rows.raw();
}

export default {registrarContactos ,init,actualizarContacto,actualizarUsuarioImagen,obtenerDatosUsuarioContacto};