
import * as React from 'react';
import {useEffect} from 'react';
import {FlatList,Text,ScrollView} from 'react-native';
import {    ListItem  } from 'native-base';
import styleBuscador from '../../css/AppStyle';
export default    React.memo((props) => {
  const {listDataContacto} = props; 
  useEffect(() => {
    (async()=>{
    })();
  }, []);
  return (
   
       <FlatList 
         scrollEnabled={false}
         initialNumToRender={listDataContacto.length}
         style={{ flex: 0 ,width:"100%"}}
         contentContainerStyle={{
          flex: 1,
          flexDirection: 'column',
          height: '50%',
          width: '100%'
      }}    
         keyExtractor={item => (item.id)}    
         data={listDataContacto}
         renderItem={({ index,item }) => (
         <ListItem key={index} onPress={()=>{
          props.seleccionarContacto(item);
         }} >
           <Text>{item.nombre}</Text>
         </ListItem >
       )}
       />
    
    
    )
  });

  