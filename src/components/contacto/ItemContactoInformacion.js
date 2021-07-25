
import * as React from 'react';
import {Platform,View,TouchableOpacity} from 'react-native';
import {  ListItem, Left, Body, Right,Header, Thumbnail,Icon, Text } from 'native-base';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {momentGlobal} from '../../../src/context/momentConfig';
import { useSelector } from "react-redux";
import { ImageBackground} from "react-native";
import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';

const anchoCaja=Dimensions.get("window").width-80;
const ItemContactoInformacion= (props)=> {
      const {itemContactoInformacion,contactoSeleccionado}=props;
      const directorioPefil = useSelector((state) => state.directorioPefil);
      const atrasContacto=()=>{
        props.atrasContacto();
      }
      React.useEffect(()=>{
      },[]);
      return (
      <View  style={(itemContactoInformacion  ? {opacity:1,height:"100%"} : {opacity:0,height:"0%"}) }>
        <Header   style={{height:250,margin:0,marginLeft:-10,width:"110%",backgroundColor:"#fff"}}  >
        <ImageBackground style={{width:null,marginTop:0,margin:0,padding:0,width:"100%"}} source={ contactoSeleccionado.imagenContacto==null ? require('../../assets/usuariodefault.jpg' ) :{uri: (Platform.OS === 'android' ? 'file://' + directorioPefil+contactoSeleccionado.imagenContacto  : '' + directorioPefil+contactoSeleccionado.imagenContacto) }} resizeMode="cover" >
              <TouchableOpacity circle style={{borderRadius:50,marginLeft:0}} onPress={atrasContacto}>
                <Icon name='arrow-back' style={{color:"#000",marginLeft:0,marginTop:15,top:0,width:60,height:50}}/>
              </TouchableOpacity>

        </ImageBackground>

        
        </Header>
        <Body style={{marginRight:0,height:0,marginTop:0,backgroundColor:"#fff",color:"#000",width:"110%"}}>
                <Text style={{width:"100%",marginLeft:40,color:"#000",fontSize:28,bottom:0}}>{contactoSeleccionado.nombre}</Text>
                <Text style={{width:"100%",marginLeft:40,color:"#000",fontSize:28,bottom:0}}>{contactoSeleccionado.numero}</Text>
        </Body>        
      </View>
        )
  };

  const styles = StyleSheet.create({
    header: {
      alignItems: 'center',
      borderBottomColor: '#BEBEBE',
      flexDirection:"row",
      backgroundColor:"#fff"
    },
    headerTitle: {fontSize: 20, fontWeight: 'bold',marginTop:10,marginLeft:10},
    safeArea: {
      flex: 1,
    },
    sendMessageButton: {
      alignItems: 'center',
      position: 'absolute',                                          
      height:"auto",
      bottom:0,
      width:anchoCaja,
      borderRadius:10,
      backgroundColor:"#fff",
      borderWidth: 1,
      bottom:10,
      borderColor: "#fff",
      left:10
    },
    sendMessageButton2: {
      alignItems: 'center',
      position: 'absolute',                                          
      height:55,
      margin:0,
      backgroundColor: '#007D75',
      bottom:0,
      width:55,
      right:0,
      borderRadius:55,
      bottom:10
    },
    sendButtonTitle: {
      color: 'white',
      fontSize: 15,
      fontWeight: 'bold',
      textAlign:"center" ,
      lineHeight:60
    },
  });
  
  export default React.memo(ItemContactoInformacion);