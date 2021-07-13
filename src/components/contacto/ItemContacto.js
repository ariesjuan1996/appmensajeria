
import * as React from 'react';
import {Platform} from 'react-native';
import {  ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import { useSelector } from "react-redux";
const ItemContacto= (props)=> {
      const {data}=props;
      const directorioPefil = useSelector((state) => state.directorioPefil);
      React.useEffect(()=>{
      },[]);
      return (
      <>
        <ListItem avatar    onPress={() => {
            props.seleccionarContacto(data);

        }}>
           
            <Left>
            {
              data.imagenContacto==null ?
              <Thumbnail circle source={require('../../assets/usuariodefault.jpg' )} circle />
              :
            <Thumbnail circle source={{uri: Platform.OS === 'android' ? 'file://' + directorioPefil+data.imagenContacto  : '' + directorioPefil+data.imagenContacto}} circle />
            }
            </Left>
            <Body>
              <Text>{data.nombre}</Text>
              <Text>{data.mensaje}</Text>
              <Text note>{data.ultimoMensaje}</Text>
            </Body>
            <Right>
            <Text note>{data.horaUltimoMensaje}</Text>
            </Right>
          </ListItem>
      
      </>
        )
  };

  export default React.memo(ItemContacto);