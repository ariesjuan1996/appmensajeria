import React,{useState} from 'react';
import {StyleSheet, View,TouchableOpacity,Modal} from 'react-native';

import { useSelector } from "react-redux";
import { Dimensions } from 'react-native';
import {  Header,  Thumbnail, Text,  Icon, Left, Body } from 'native-base';
import ImageViewer from 'react-native-image-zoom-viewer-fix';
export const ImagenPreviaMensaje = React.memo((props) => {
  const {contactoSeleccionado,imagenSeleccionada}=props;
  const images = [
  ];

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
  React.useEffect(() => {
    
    Dimensions.addEventListener("change", onChange);
    return () => {
        
      Dimensions.removeEventListener("change", onChange);
    };
  });
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
         <Header   style={{height:60,backgroundColor:"#000",opacity: 9999999999}}  >
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
          <ImageViewer index={1} imageUrls={[
          {
          url: imagenSeleccionada
          }]}/>
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