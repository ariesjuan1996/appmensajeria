
import * as React from 'react';
import {Platform,View} from 'react-native';
import {  ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import IconEntypo from 'react-native-vector-icons/Entypo';
import {MomentContext,momentGlobal} from '../../../src/context/momentConfig';
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
              {
                data.tipomensaje=="imagen" ?
                <View >
                
                <IconEntypo  style={{ color:"#000",fontSize:18,alignItems:"flex-end"}}  name="image" size={30} /> 
                <Text>Imagen</Text></View> :
                <Text>{data.mensaje}</Text>
              }
              <Text note>{data.ultimoMensaje}</Text>
            </Body>
            <Right>
            <Text note>{momentGlobal(data.fechaEnvio).format('HH:mm:ss a')}</Text>
            {
              data.numeromensajesnoleidos!=null  && data.numeromensajesnoleidos>0 ? 
              <Text circle style={{backgroundColor:"#58B963",color:"#fff",width:28,marginTop:10,fontSize:18,height:28,borderRadius:28,textAlign:"center"}}>{data.numeromensajesnoleidos}</Text>
              : null
            }
            </Right>
          </ListItem>
      
      </>
        )
  };

  export default React.memo(ItemContacto);