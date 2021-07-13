
import * as React from 'react';

import { Header ,Title} from 'native-base';
import IconVector from 'react-native-vector-icons/MaterialIcons';
import {  TouchableOpacity,TextInput,SafeAreaView     } from "react-native";
import {   Content, ListItem, Text, Left, Right,Body ,Button} from 'native-base';
//import { YellowBox } from 'react-native'
import { FlatList } from "react-native";
export default    React.memo((props) => {
  /*YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested', 
  ]);*/
  const [inputBuscador,setInputBuscador] = React.useState(""); 
  const [seleccionVista,setSeleccionVista] = React.useState("BUSCADORVISTA"); 
  const [listadoDataPais,setListadoDataPais] = React.useState(props.dataPaises); 
  const filtrosPaises = React.useMemo(async() => {
    props.dataPaises.filter((value)=>{
        return value.name.toUpperCase().indexOf(inputBuscador.toUpperCase())>-1;
    });
}, [inputBuscador,listadoDataPais]);
const valuesCallback = React.useCallback((data) => {
    setListadoDataPais(props.dataPaises.filter((value)=>{
        return value.name.toUpperCase().indexOf(data.toString().toUpperCase())>-1;
    }));
}, [listadoDataPais, setListadoDataPais]);
const buscador=(value)=>{
    setInputBuscador(value); 
    valuesCallback(value);
}
const atras=()=>{
  setSeleccionVista("BUSCADORVISTA");
  setInputBuscador(""); 
  valuesCallback("");
  
}

React.useEffect(() => {
    (async()=>{
    })();
  }, []);

  return (
    
    <>
      <Header  style={{backgroundColor:"#fff",width:"100%" }}>

        <Left style={{display:(seleccionVista=="BUSCADORINPUT" ? "none" : "flex")}} >
        {
            seleccionVista=="BUSCADORINPUT" ? (<>
            
            
            
            </>) : (
                <TouchableOpacity style={{flexDirection:"row",width:"100%"}}>
                <TouchableOpacity transparent  onPress={
                    ()=>{
                        props.onCambioVista();
                    }
                } >
                    <IconVector style={{color:"#00C1A6"}} name={'arrow-back'} size={25} />
                </TouchableOpacity>
                <TouchableOpacity transparent style={{color:"#00C1A6",width:280}} >
                    <Title style={{color:"#00C1A6",marginLeft:20}}>Seleccionar Pais</Title>
                </TouchableOpacity>
                </TouchableOpacity>
                )

        }         
        </Left>

        <Body style={{flexDirection:"row",width:"100%", margin:0,paddingTop:5,paddingBotton:5,width:"100%" }}>
            {
            seleccionVista=="BUSCADORINPUT" ? (<>
               <Button transparent style={{marginTop:5,display:(seleccionVista=="BUSCADORINPUT" ? "flex": "none"  )}} onPress={atras}  >
            <IconVector style={{color:"#00C1A6"}} name={'arrow-back'} size={25} />
        </Button>
            <TextInput   style={{ borderRadius:"100%",backgroundColor: '#F6F8FA',width:"100%" ,borderRadius: 50 }} placeholder="Buscar Paises" value={inputBuscador}  onChangeText={buscador}/>
        </>):(
            <></>
             )
            }
        </Body>
        <Right  style={{maxWidth:60 }}>
            <Button transparent  onPress={()=>{
                setSeleccionVista("BUSCADORINPUT");
                
            }}>
               <IconVector color="#00C1A6" name="search" size={30} />
            </Button>
        </Right>
      </Header>
      
      <Content >
       
          <SafeAreaView  >
          <FlatList
            nestedScrollEnabled={true} 
            style={{backgroundColor:"#F7F7F7"}}
            vertical
            data={listadoDataPais}
            keyExtractor={(item,index) => (index.toString())}
            renderItem={({ index,item }) => (
                <ListItem key={index} onPress={
                    ()=>{
                      props.SeleccionadoPais(item);
                    }
                    }>
                    <Left>
                        <Text>{item.name}</Text>
                    </Left>
                    <Right>
                        <Text>{item.dial_code}</Text>
                    </Right>
                </ListItem>
              )}

          />
         </SafeAreaView >      

        

        </Content>
      
    </>
    )
  });

  