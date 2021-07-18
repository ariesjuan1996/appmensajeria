import React from 'react';
import {StyleSheet, View} from 'react-native';
//import {Platform} from 'react-native';
//import { useSelector } from "react-redux";
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconEntypo from 'react-native-vector-icons/Entypo';
import { Image } from 'react-native';
/**
 * UI Component for message item, in message list (FlatList).
 */
export const MensajeComponent = React.memo((props) => {
  const {mensaje,numero,fechaEnvio,origen,idmensajeapi}=props.item.item;

    // Align sent messages to right side of the screen, with a grey'ish background.
    return (
      <View
        style={[props.length==props.item.index  ? styles.messageBubbleFinish : styles.messageBubble ]}>
          <Image style={styles.imageMenssage} source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }} />
         
        </View>
    );
  // Align received messages to left side of the screen, with blue background.

});

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: "96%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#1771E6',
    width:"100%",
    marginBottom:0
  },
  messageBubbleFinish: {
    maxWidth: "96%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#1771E6',
    width:"100%",
    marginBottom:70
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
  imageMenssage:{
    width:200,
    height:200
  }
});