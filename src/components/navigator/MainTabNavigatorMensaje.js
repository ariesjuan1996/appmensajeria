import * as React from 'react';
import { View ,TouchableOpacity,TouchableWithoutFeedback} from 'react-native';
import { Button, Menu } from 'react-native-paper';
import {Thumbnail, Header, Left,Icon, Right,Title } from 'native-base';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import style from '../../css/MainTabNavigatorMensajeStyle';
import { Container, Body /*, Header, Left, Right, Button, Icon, Title */} from 'native-base';


export default React.memo((props) => {
  const [visible, setVisible] = React.useState(false);
  const {data}=props;
  const openMenu = () =>{
    setVisible(true);
  };
  const atras=React.useCallback(()=>{
    props.onCambioVista("HOME");
  },[]);

  const closeMenu = () => setVisible(false);
  return (

    <Header   style={{height:60,backgroundColor:"#26514A"}}  >
      <Left>
        <TouchableOpacity circle style={{borderRadius:50,marginLeft:0}}    onPress={atras}>
          <Icon name='arrow-back' style={{color:"#fff",marginLeft:0,marginTop:15,top:0,width:60,height:50}}/>
        </TouchableOpacity>
      </Left>
      <Body style={[ {
      flexDirection: "row",
      marginLeft:-10
      }]}>
        <Thumbnail  style={style.Thumbnail}  source={{ uri: data.imgCliente }} /> 
        <Title style={{marginLeft:10,marginTop:5}}>Header</Title>
      </Body>
    <Right>
    <View >
    <Menu
      style={{ width:280}}
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <View style={[ {
          flexDirection: "row"
        }]}>
        <TouchableWithoutFeedback transparent  onPress={()=>{
          openMenu();
        }}>
          <IconMaterial name="dots-vertical" size={30} color="#000" />
        </TouchableWithoutFeedback>
        </View>
        }>
      <Menu.Item onPress={() => {}} title="Ver Contacto" />
    </Menu> 
    </View>

    </Right>
  </Header>
  );
});
