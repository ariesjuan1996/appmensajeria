import {StyleSheet} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
const styles=StyleSheet.create({
    inputContainerFixedContainer:{
        position:"absolute",
        bottom:20,
        left:0,
        right:0,
        height:'100%',
        flex: 1
    },  
    btn:{
        height:'100%',
        justifyContent:"center"
    },
    inputContainer:{
        width:"100%",
        backgroundColor:"transparent",
        flexDirection: "row"
    },  
    input:{
        width:"80%",
        backgroundColor:"#fff",
        borderColor:"#676768",
        textAlignVertical: "top",
        minHeight: 20,
        maxHeight: 60,
        height: "auto"
    },
   
    inputTextContainer:{
        width:"100%",
        backgroundColor:"transparent",
        flexDirection: "row",
        marginRight:120
    },
    container:{
        padding:10,
    },
    mensajeBox:{
        borderRadius:5,
        padding:10,
    },
    name:{
        color:Colors.light.tint,
        fontWeight:"bold",
        marginBottom:5,
    },
    message:{
        marginVertical:5
    },
    time:{
        alignSelf:"flex-end",
        color:'grey'
    },
    


    btnCircle:{
        borderRadius:100,
        width:60,
        height:60,
        marginLeft:"auto",
        marginRight:5,
    
      },
      btnIcon:{
        fontSize:40,
        color:"#fff",
        marginLeft:"auto",
        marginRight:"auto",
        
      },
      containerMain: {
        alignItems: 'center',
        width: '100%',
        
      },
      bottomView: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 12
      },
      textStyle: {
        color: '#fff',
        fontSize: 18,
      },
});

export default styles;