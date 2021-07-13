import {StyleSheet} from "react-native";
const styles=StyleSheet.create({

    header: {
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomColor: '#BEBEBE',
        borderBottomWidth: 1,
      },
      headerTitle: {fontSize: 20, fontWeight: 'bold'},
      safeArea: {
        flex: 1,
        marginBottom:80
      },
      sendMessageButton: {
        width: '100%',
        padding: 20,
       
        alignItems: 'center',
        marginBottom:130,
        backgroundColor:"red"
      },
      sendButtonTitle: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
      }
    
});

export default styles;