
import * as React from 'react';
import { Header } from 'native-base';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import {  TouchableOpacity,TextInput ,Image ,View   } from "react-native";
import {    Text,Body ,Button} from 'native-base';
import {requestApi} from '../../api/index';
import  * as ImagePicker  from 'react-native-image-picker';
import  modelUsuario from '../../db/usuario';
import   servicesMensajes from '../../../src/services/servicesMensajes';
import RNFetchBlob from 'react-native-fetch-blob';
import { useSelector } from "react-redux";
export default    React.memo((props) => {
  const {numero}=props;
  const [photo,setPhoto] = React.useState(null); 
  const [limitNombreMax] = React.useState(25); 
  const [limitNombre,setLimitNombre] = React.useState(25); 
  const [nombreUsuario,setNombreUsuario] = React.useState(""); 
  const directorioPefil = useSelector((state) => state.directorioPefil);
  React.useEffect(() => {
  }, []);
  const handleChoosePhoto=()=>{
    ImagePicker.launchImageLibrary({
      mediaType:"photo",
      maxWidth:100,
      includeBase64:true,
      saveToPhotos:true,
      quality: 1.0,
      skipBackup: true
    },(response)=>{
      if(response.didCancel===true){
        setPhoto(null);
        return false;
      }
      setPhoto("data:image/jpeg;base64,"+response.base64);
    });
  }
  const changeTextNombre=(val)=>{
    setNombreUsuario(val.substring(0,limitNombreMax));
    setLimitNombre(limitNombreMax-nombreUsuario.length);
  }
  const guardarContacto=async()=>{
    try {
      if(nombreUsuario.length>0){
        let response=await requestApi(
          "usuarios/registrarUsuario",
          {
            numero:numero,
            usuario:nombreUsuario,
            imagen:photo
          },
          "POST"
        );
        if(response.estado){
          await guardarInformacionUsuario(numero);
          props.verificarRegistradoUsuario();
          alert("registrarrr");
        }

        
      }

    } catch (error) {
      alert(JSON.stringify(error));
    }
  }


  const obtenerDatosUsuarioApi=async(numero)=>{
    let dataUser=await servicesMensajes.obtenerDatosUsuario(numero);
    return dataUser ;
  }
 
  const guardarInformacionUsuario=async(numeroContacto)=>{
    let datos =await obtenerDatosUsuarioApi(numeroContacto);
    let dataImagen=null;
    if(datos.estado){
      let responseImagen=await descargarImagen(numeroContacto,datos.data.imagen);
      dataImagen=responseImagen.imagen;
      await modelUsuario.registrarUsuario({
        numero:numero,
        nombre:nombreUsuario,
        imagen:dataImagen
      });
    }

    return dataImagen;
  }
  const descargarImagen = async (numero,url) => {
    try {
      let extension=url.split(".")[url.split(".").length-1];
      let response=await RNFetchBlob
      .config({
          path : directorioPefil+numero+'.'+extension
      })
      .fetch('GET', url);
      const saveImage=await RNFetchBlob.fs.scanFile([ { path : response.path(), mime : 'image/'+extension } ]);
      return {estado:true,imagen: numero+'.'+extension};      
    } catch (error) {
        return {estado:false,imagen:null};
      
    }



  };
  return (
    
    <>
      <Header  style={{backgroundColor:"#fff",width:"100%" }}>
      <Body >
           <Text>Infomación Pérfil</Text>
        </Body>
      </Header>
      
      <View style={{marginTop:40,marginLeft:10,marginRight:10 }}>
      <Text>Proporcione su nombre y una foto de perfil opcional</Text>
      <View style={{flexDirection:"row" }}>

        <TouchableOpacity  style={{ width: 65, height: 65,backgroundColor:"#DEDEDE",borderRadius:60,alignItems: 'center', justifyContent: 'center' }} onPress={handleChoosePhoto}>
        
                  
          {photo==null ? 
          <IconAntDesign  style={{ color:"#fff",justifyContent: 'center',alignItems: 'center'}}  name="camera" size={30} /> :
          <>
            <Image
            source={{
              uri: photo,
            }}
            style={{
              width: 65, height: 65,backgroundColor:"#DEDEDE",borderRadius:60,alignItems: 'center', justifyContent: 'center'
            }}
          />
          </>
        }
        </TouchableOpacity >
        <TextInput 
        style={{backgroundColor: '#F6F8FA',marginLeft:20,width:"75%" ,borderBottomWidth:2,borderBottomColor:"#26C9AD" }} 
        value={nombreUsuario}
        placeholder="Nombre usuario" 
        onChangeText={changeTextNombre}
        />
        <Text style={{marginTop:35,right:20}}>{limitNombre}</Text>
      </View>

      </View>
      <View  style={{
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: 36,
          flexDirection:'row',
          alignItems:'center',
          position:"absolute",
          bottom:10,justifyContent: 'center',
          width:"100%"}}>
          <Button style={{ justifyContent: 'center'}} onPress={guardarContacto}><Text>siguiente</Text></Button>

        </View>    
      
    </>
    )
  });

  