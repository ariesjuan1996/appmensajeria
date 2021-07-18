import React,{useState} from 'react';
import {StyleSheet, View,TouchableOpacity,Modal} from 'react-native';/*
//import { Header} from 'native-base';*/
/**
 * UI Component for message item, in message list (FlatList).
 */

import { Dimensions,screen } from 'react-native';
import { Image,ImageBackground } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
const window1 = Dimensions.get("window");
const screen1 = Dimensions.get("screen");

import ImageViewer from 'react-native-image-zoom-viewer-fix';
export const ImagenPreviaMensaje = React.memo((props) => {
  const images = [{
    url: 'data:image/jpeg;base64,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'
    }, {
        url: 'data:image/png;base64,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'
    }, {
        url: 'http://v1.qzone.cc/avatar/201407/07/00/24/53b9782c444ca987.jpg!200x200.jpg'
    }];

  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");
  const [dimensions, setDimensions] = useState({ window, screen });
  const [vertical, setVertical] = useState(true);
  const onChange = ({ window, screen }) => {
      console.log("window.width",window);
    if(window.width>window.height){
        console.log("horizontal");
        setVertical(false);
    }else{
        console.log("veritical");
        setVertical(true);
    }
    setDimensions({ window, screen });
  };
  
  React.useEffect(() => {
    
    Dimensions.addEventListener("change", onChange);
    return () => {
        
      Dimensions.removeEventListener("change", onChange);
    };
  });
  React.useEffect(() => {
    console.log("dimensions");
    if(dimensions.window.width>dimensions.window.height){
        console.log("horizontal");
        setVertical(false);
    }else{
        console.log("vertical");
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
              <TouchableOpacity circle style={{borderRadius:50,marginLeft:0}}    >
                <Icon name='arrow-back' style={{color:"#fff",marginLeft:0,marginTop:15,top:0,width:60,height:50}}/>
              </TouchableOpacity>
            </Left>
            <Body style={[ {
            flexDirection: "row",
            marginLeft:vertical ?  -95 : -220
            }]}>
              <Text style={{marginLeft:0,marginTop:5,color:"#fff",width:Dimensions.get('window').width}}>Header</Text>
            </Body>

        </Header>
                <ImageViewer imageUrls={images}/>
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