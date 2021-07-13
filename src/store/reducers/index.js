const reducer = (state, action,payload) => {
 
    switch (action.type) {
      
      case "ACTUALIZARLOADER":
        
        return {
          ...state,
          loaderData:action.loaderData
        };
        case "ACTUALIZARLOADERHOME":
        
          return {
            ...state,
            loaderHome:action.loaderHome
          };
        case "ACTUALIZARDATAUSUARIOTELEFONO":
         
          return {
            ...state,
            dataUsuarioTelefono:action.dataUsuarioTelefono
        };
        case "ACTUALIZARDATALISTADOCONTACTOS":
         
          return {
            ...state,
            listadoContactosTotal:action.listadoContactosTotal
        };
        case "ACTUALIZARDATALISTADOUSUARIOVISTA":
         
          return {
            ...state,
            listadoUsuarioVista:action.listadoUsuarioVista
        };
      default:
        return state;
    }
  };
  
  export default reducer;