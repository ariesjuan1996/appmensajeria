import * as React from 'react';
import { View ,TouchableOpacity} from 'react-native';
import { Button, Menu } from 'react-native-paper';
import {Thumbnail, Header, Left,Icon, Right,Title } from 'native-base';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import style from '../../css/MainTabNavigatorMensajeStyle';
export default React.memo((props) => {
  const [visible, setVisible] = React.useState(false);
  const {data}=props;
  const openMenu = () =>{
    setVisible(true);
  };
  const atras=()=>{
    props.onCambioVista("HOME");
  }

  const closeMenu = () => setVisible(false);
  const LeftHeader =React.memo( () =>(
    <Left>
    <View style={[ {
      flexDirection: "row",
    }]}>
       <Button transparent style={style.TouchableOpacity} onPress={atras} > 
         <Icon name='arrow-back'  style={{fontSize: 28, color: '#fff'}} /> 
       </Button>
      <Title style={{top:8}}>{data.nombreCliente} </Title>
      <Thumbnail  style={style.Thumbnail}  source={{ uri: data.imgCliente }} /> 
    </View>
    </Left>
  ));
  const RigthHeader =React.memo( () =>(
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
        <Button transparent  onPress={()=>{
          openMenu();
        }}>
          <IconMaterial name="dots-vertical" size={30} color="#fff" />
        </Button>
        </View>
        }>
      <Menu.Item onPress={() => {}} title="Ver Contacto" />
    </Menu> 
    </View>

    </Right>
  ));
  return (

    <Header   style={{height:60,backgroundColor:"#26514A"}}  >
    <Left>
    <View style={[ {
      flexDirection: "row",
    }]}>
       <TouchableOpacity  style={style.TouchableOpacity} onPress={atras} > 
         <Icon name='arrow-back'  style={{fontSize: 28, color: '#fff'}} /> 
       </TouchableOpacity>
      <Title style={{top:8}}>{data.nombreCliente} </Title>
      <Thumbnail  style={style.Thumbnail}  source={{ uri: data.imgCliente }} /> 
    </View>
    </Left>
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
        <Button transparent  onPress={()=>{
          openMenu();
        }}>
          <IconMaterial name="dots-vertical" size={30} color="#fff" />
        </Button>
        </View>
        }>
      <Menu.Item onPress={() => {}} title="Ver Contacto" />
    </Menu> 
    </View>

    </Right>
      </Header>
  );
});
