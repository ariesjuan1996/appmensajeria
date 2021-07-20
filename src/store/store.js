import { createStore } from "redux";
import reducer from "./reducers/index";
import RNFetchBlob from 'react-native-fetch-blob';
import nameApp from '../../app.json';
const { fs } = RNFetchBlob;
const initialState = {
  directorioPefil:fs.dirs.DCIMDir+"/"+nameApp.name+"/perfiles/",
  directorioImagenesMensajes:fs.dirs.DCIMDir+"/"+nameApp.name+"/mensajes/",
  loaderData:true,
  loaderHome:false,
  dataUsuarioTelefono:{},
  listadoContactosTotal:[],
  listadoUsuarioVista:[]
};

 const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;