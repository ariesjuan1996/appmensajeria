import Database from './database';
const init=async()=>{
    let results = await Database.executeSql("CREATE TABLE IF NOT EXISTS usuario(id INTEGER PRIMARY KEY,nombre TEXT  NULL,imagen TEXT  NULL,telefono TEXT NOT NULL UNIQUE);",[]);
}

const usuarioRegistrado =async() => {
    await init();
    let existeUsuario = await Database.executeSql("select *from usuario;",[]);
    return existeUsuario.rows.length==0 ? false : true;
};
const obtenerDatosUsuario =async() => {
    await init();
    let datos = await Database.executeSql("select *from usuario;",[]);
    let datosUsuario=datos.rows.raw();
    return datosUsuario.length ? datosUsuario[0] : false;
};
const registrarUsuario =async(data) => {
    await init();
    let tempNombre=data.nombre==null || data.nombre=="" ? "null" :  ("'"+data.nombre+"'");
    let imagen=data.imagen==null || data.imagen=="" ? "null" : ("'"+data.imagen+"'" );
    let resposeRegistroUsuario = await Database.executeSql("insert into usuario(nombre,imagen,telefono) values("+tempNombre+","+imagen+",'"+data.numero+"');",[]);
    return resposeRegistroUsuario;
};

export default {init,usuarioRegistrado,registrarUsuario,obtenerDatosUsuario };