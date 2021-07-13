
import * as React from 'react';
import { TextInput,TouchableOpacity  } from "react-native";
import { Header,Button,Title,Body,Text } from 'native-base';

import  PaisesSeleccion from './PaisesSeleccion';
import IconVector from 'react-native-vector-icons/MaterialIcons';
import dataPaises  from '../../data/dataPaisesJson.json';
import  InforPerfil from './InforPerfil';
export default    React.memo((props) => {
  const [seleccionVista,setSeleccionVista] = React.useState("VERIFICACION");
  const [paisSeleccionado,setPaisSeleccionado] = React.useState(null); 
  const [numero,setNumero] = React.useState(null); 
  const verificarRegistradoUsuario=async()=>{
    await props.verificarRegistradoUsuario();
  }
  const registrarCuenta=async ()=>{
    try {
      await setSeleccionVista("INFOPERFIL");
    } catch (error) {
    }
  }

  const onCambioVista=()=>{
    setSeleccionVista("VERIFICACION");
  }
  const SeleccionadoPais=(data)=>{
    setPaisSeleccionado(data);
    setSeleccionVista("VERIFICACION");
  }
  React.useEffect(() => {
    (async()=>{
      
      let tempSeleccionado= dataPaises.filter((value)=>{
        return value.name=="Peru";
      });
      setPaisSeleccionado(tempSeleccionado[0]);
    })();
  }, []);

  return (
    <>
    {
       seleccionVista=="VERIFICACION"? (<>
       <Header  style={{backgroundColor:"#26514A" }}>
        <Button  transparent style={{width:"100%"}} >
          <Title style={{textAlign:"center"}}>Verificación cuenta</Title>
        </Button>
      </Header>
      <Body style={{marginTop:26,width:300}} >
        <TouchableOpacity 
          onPress={()=>{
            setSeleccionVista("PAISSELECCION");
          }}
          style={{flexDirection:"row",paddingBottom:10,borderBottomWidth:1,borderBottomColor:"#00C1A6",marginBottom:10}}
        >
          <Text style={{width:"100%"}}>{paisSeleccionado!=null ? paisSeleccionado.name : null}</Text>
          <IconVector style={{color:"#00C1A6"}} name={'arrow-drop-down'} size={25} />

        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection:"row",width:"100%",width:320,padding:0,borderBottomWidth:1,borderBottomColor:"#00C1A6"}}>
          <TextInput
          value={paisSeleccionado!=null ? paisSeleccionado.dial_code : null}
          placeholder="código"
          keyboardType="numeric"
          editable={true}
          />    
          <TextInput

            onChangeText={setNumero}
            value={numero}
            placeholder="Numero telefonico"
            keyboardType="numeric"
          />        
        
        </TouchableOpacity>

        <Body style={{flex:1,marginTop:20,flexDirection:'row',alignItems:'center',justifyContent:'center'}} >
          <Button small primary onPress={registrarCuenta}>
            <Text>Registrar Cuenta</Text>
          </Button>
        </Body>
        
      </Body>
       </>) :(
       
      
        seleccionVista=="PAISSELECCION" ? (<>
          <PaisesSeleccion dataPaises={dataPaises}  onCambioVista={onCambioVista} SeleccionadoPais={SeleccionadoPais}  />
          
         </>) : (<>
          <InforPerfil numero={paisSeleccionado!=null ? (paisSeleccionado.dial_code.replace("+","")+""+numero) : "" } verificarRegistradoUsuario={verificarRegistradoUsuario} />
         </>)
      
       )
    }
      
      
      
      </>
     
    )
  }
);
  