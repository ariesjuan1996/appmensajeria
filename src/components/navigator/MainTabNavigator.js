
import * as React from 'react';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput,TouchableOpacity,Text ,TouchableWithoutFeedback } from "react-native";
import styles from '../../css/MainTabNavigatorStyle';
import {  Header, Left,  Right,  Icon, Title } from 'native-base';
import {StyleSheet} from "react-native";
const styles2=StyleSheet.create({
  arrowback:{fontSize: 28, color: '#000',marginTop:15}
});
export default   React.memo((props) => {
  const [headerVista,setHeaderVista] = React.useState("NAV");
  const [inputBuscadorContacto,setInputBuscadorContacto] = React.useState("");
  const buscarPersona=React.useCallback(()=>{
    setHeaderVista("BUSCADOR");
    props.onCambiarActivaBuscador(true);
  });
  const atras=React.useCallback(()=>{
    setHeaderVista("NAV");
    props.onCambiarActivaBuscador(false);
  });
  const buscador=React.useCallback((val)=>{
    setInputBuscadorContacto(val);
    props.buscarContacto(val);
  });
  React.useEffect(() => {

  },[]);

  return (
      <>
      {headerVista==='NAV' ?  ( 
      <Header  style={styles.mainNav}>
      <Left style={{padding:0,width:10}}>
          <Title style={{color:"#3784FF"}}>Mensajeria</Title>
      </Left>
      <Right>
          <TouchableWithoutFeedback    onPress={buscarPersona}>
            <Icon name="search" style={styles.iconSearch} />
          </TouchableWithoutFeedback >
          <IconMaterial   name="dots-vertical" size={24} color="#fff" />
        
      </Right>
    </Header> )  : (      
    <Header  style={styles.mainNavBuscador}>
      <TouchableWithoutFeedback style={{padding:0,width:40}} onPress={atras}>
          <Icon name='arrow-back'  style={styles2.arrowback}  /> 
      </TouchableWithoutFeedback>
      <Right style={{width:"100%"}}>
          <TouchableOpacity style={{width:"100%"}}  onPress={buscarPersona}>
            <TextInput multiline={true} onChangeText={buscador} style={styles.input} />
          </TouchableOpacity>
        
      </Right>
    </Header> )}
      </>
    
 
      
    )
  });
