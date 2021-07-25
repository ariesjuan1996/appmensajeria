import React from 'react';
import {StyleSheet, Text, View,Image,TouchableOpacity} from 'react-native';
import {Platform} from 'react-native';
import { useSelector } from "react-redux";
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconEntypo from 'react-native-vector-icons/Entypo';
/**
 * UI Component for message item, in message list (FlatList).
 */
export const MensajeComponent = React.memo((props) => {
  const {mensaje,numero,fechaEnvio,origen,idmensajeapi,tipomensaje}=props.item.item;
  const directorioImagenesMensajes = useSelector((state) => state.directorioImagenesMensajes);
  const path=directorioImagenesMensajes+ mensaje;
  const zoomImage=async()=>{
    props.seleccionarImagen(path);
  }
  if (props.numero==origen ? true : false) {
    // Align sent messages to right side of the screen, with a grey'ish background.
    return (
      <View
        style={[styles.messageBubble]}
        >
         
        {
          tipomensaje=="imagen" ?
          <TouchableOpacity onPress={zoomImage}>
          <Image style={styles.imageMenssage} 
           
          source={{uri :(Platform.OS === 'android' ? 'file://' + path  : '' + path) } }/></TouchableOpacity> :

          <Text style={styles.myMessageText}>{mensaje}</Text>
          
          

        }
        
        <Text style={styles.myFechaText}>{fechaEnvio}</Text>
        {idmensajeapi!=null ? 
          props.length==props.item.index ? 
            <IconFontAwesome5  style={{ color:"#000",alignSelf: 'flex-end',fontSize:18,marginLeft:0}}  name="check-double" size={30} />
            :null 
        : 
            <IconEntypo  style={{ color:"#000",alignSelf: 'flex-end',fontSize:18,marginLeft:0}}  name="clock" size={30} /> }
      </View>
    );
  }else{
    return (
      <View style={styles.messageBubbleDestino}>
          {
          tipomensaje=="imagen" ?
          <TouchableOpacity onPress={zoomImage}>
          <Image style={styles.imageMenssage} source={ {uri :(Platform.OS === 'android' ? 'file://' + path  : '' + path) }}/></TouchableOpacity> :
          
          <Text style={styles.myMessageText}>{mensaje}</Text>
          
          

        }
        <Text style={styles.myMessageText}>{fechaEnvio}</Text>
        {props.length==props.item.index ? 
            <IconFontAwesome5  style={{ color:"#000",alignSelf: 'flex-end',fontSize:18,marginLeft:0}}  name="check-double" size={30} /> 
        : 
        null}
      </View>
    );
  }
  // Align received messages to left side of the screen, with blue background.

});

const styles = StyleSheet.create({
  imageMenssage:{
    width:200,
    height:200,
    marginTop:10
  },
  messageBubble: {
    maxWidth: "96%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#1771E6',
    width:"100%"
  },
  messageBubbleDestino: {
    maxWidth: "96%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#FFF',
    position:"relative",
    left:0,
    width:"100%"
  },
  myMessageBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3784FF',
  },
  messageText: {
    fontSize: 15,
  },
  messageOtro: {
    fontSize: 15,
    color: 'white'

  },
  myMessageText: {
    color: 'white',
    fontSize: 15,
  },
  myFechaText: {
    color: 'white',
    fontSize: 12,
  },
});