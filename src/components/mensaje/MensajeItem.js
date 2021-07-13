
import * as React from 'react';
import { Text } from 'native-base';
import styles from './styleMensajeItem';

import {momentGlobal} from '../../context/momentConfig';
import {View} from 'react-native';
  export default   React.memo((props)=> {

    const {mensaje,nombreContacto,numero}=props;
    return (
      <>
      <View style={styles.container}>
        <View style={styles.mensajeBox,{
        backgroundColor:mensaje.origen==numero ? '#DCF8C5':'white',
        marginLeft:mensaje.origen==numero ? 50:0,
        marginRight:mensaje.origen==numero  ? 0:50,
      }}>
        <Text style={styles.name}>{mensaje.origen==numero ? ("yo") : nombreContacto }</Text>
          <Text style={styles.message}>{mensaje.mensaje}</Text>
          <Text style={styles.time}>{momentGlobal(mensaje.fechaEnvio).format('HH:mm:ss a')}</Text>

        </View>  
      </View>
      
      
      </>
      )
  });
