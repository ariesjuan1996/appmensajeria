import React,{useState} from 'react';
import {StyleSheet, View,TouchableOpacity,Modal} from 'react-native';
import * as RNFS from 'react-native-fs';
import { useSelector } from "react-redux";
import { Dimensions } from 'react-native';
import {  Header,  Thumbnail, Text,  Icon, Left, Body } from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer-fix';
import RNFetchBlob from 'react-native-fetch-blob';
export const ImagenPreviaMensaje = React.memo((props) => {
  const {contactoSeleccionado,imagenSeleccionada,listaImagenes,indexImagen}=props;

  const directorioPefil = useSelector((state) => state.directorioPefil);
  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");
  const [dimensions, setDimensions] = useState({ window, screen });

  const [vertical, setVertical] = useState(true);
  const onChange = ({ window, screen }) => {
    if(window.width>window.height){
        setVertical(false);
    }else{
        setVertical(true);
    }
    setDimensions({ window, screen });
  };
  const atras=()=>{
    props.atras();
  }
  const images = [{
    // Simplest usage.
    url: 'data:image/jpeg;base64,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',
 
}]

  React.useEffect(() => {
    if(dimensions.window.width>dimensions.window.height){
        setVertical(false);
    }else{
        setVertical(true);
    }
  },[]);

    return (
    <>
  
        <View
        style={styles.container}
        >
    
         <Modal visible={true} transparent={true}>
         <Header   style={{height:60,backgroundColor:"#000",opacity: 999}}  >
            <Left>
              <TouchableOpacity onPress={atras} circle style={{borderRadius:50,marginLeft:0}}    >
                <Icon name='arrow-back' style={{color:"#fff",marginLeft:0,marginTop:15,top:0,width:60,height:50}}/>
              </TouchableOpacity>
            </Left>
            <Body style={[ {
            flexDirection: "row",
            marginLeft:vertical ?  -95 : -220
            }]}>
                        
              {
                contactoSeleccionado.imagenContacto==null ?
                <Thumbnail style={{width:45,height:45}} circle source={require('../../assets/usuariodefault.jpg' )} circle />
                :
              <Thumbnail circle source={{uri: Platform.OS === 'android' ? 'file://' + directorioPefil+contactoSeleccionado.imagenContacto  : '' + directorioPefil+contactoSeleccionado.imagenContacto}} circle />
              }
              <Text style={{marginLeft:15,marginTop:8,color:"#fff",width:Dimensions.get('window').width}}>{contactoSeleccionado.nombre}</Text>
            </Body>

        </Header>
          <ImageViewer enableSwipeDown={true} enablePreload={true} transparent={true} index={indexImagen} imageUrls={listaImagenes ? listaImagenes : [] }/>
        </Modal>
        </View >
    </>
         
    );
  // Align received messages to left side of the screen, with blue background.

});

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:"#000",
      width:null
    },
    image: {
      height:250,
      width:Dimensions.get('window').width ,
      backgroundColor:"red",
      alignItems: 'center',
      justifyContent:'center',
      zIndex: 0.2
    },
    imageOtraHorientacion: {
        height:Dimensions.get('window').height,
        width:220,
        backgroundColor:"red",
        alignItems: 'center',
        justifyContent:'center',
        opacity: 0.9
      },
    paragraph: {
      textAlign: 'center',
    },
  });