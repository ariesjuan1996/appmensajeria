import {StyleSheet} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
const styles=StyleSheet.create({
    container:{
        padding:10
    },
    mensajeBox:{
        borderRadius:5,
        padding:10,
        zIndex:0
    },
    name:{
        color:Colors.light.tint,
        fontWeight:"bold",
        marginBottom:5,
        zIndex:0
    },
    message:{
        marginVertical:5,
        zIndex:0
    },
    time:{
        alignSelf:"flex-end",
        color:'grey',
        zIndex:0
    }
});

export default styles;