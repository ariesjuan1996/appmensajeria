import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Platform} from 'react-native';
import { useSelector } from "react-redux";
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconEntypo from 'react-native-vector-icons/Entypo';
/**
 * UI Component for message item, in message list (FlatList).
 */
export const MensajeComponent = React.memo((props) => {
  const {mensaje,numero,fechaEnvio,origen,idmensajeapi}=props.item.item;

  if (props.numero==origen ? true : false) {
    // Align sent messages to right side of the screen, with a grey'ish background.
    return (
      <View
        style={[styles.messageBubble]}>
        <Text style={styles.myMessageText}>{mensaje}</Text>
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
        <Text style={styles.messageText}>{mensaje}</Text>
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