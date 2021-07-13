import {StyleSheet} from "react-native";
const styles=StyleSheet.create({
   
    container: {
        flex: 1,
        padding: 35,
        backgroundColor: "#fff",
        width:"100%",
        marginRight:0,marginLeft:0
    },
    input: {
        height: 60,
        margin: 12,
        width:"100%",
        backgroundColor:"#fff"
    },
    rightInput:{
        backgroundColor:"red",
        padding:0,
        margin:0
    },
    mainNav:{backgroundColor:"#FFF",height:60},
    mainNavBuscador:{backgroundColor:"#fff",height:60,padding:0},
    iconSearch:{color:"#BEBEBE",fontSize:24,marginLeft:30,marginTop:0},
    leftHeader:{position: 'absolute',top:0,left:0},
    iconPuntos:{
        fontSize: 28, color: '#000',top:0,right:0,position:"absolute"
    },
    buttonNav:{
        width:60,height:60,alignItems:"center",top:10,borderRadius:100,position: 'absolute', left: 0
    },
    arrowBack:{fontSize: 28, color: '#000',top:0,position:"absolute"}
    
});

export default styles;