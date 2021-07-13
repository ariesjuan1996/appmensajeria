import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import store from "./src/store/store";
import { Provider as StoreProvider } from 'react-redux'
import React from 'react';



  const AppMensajeria = React.memo(() => (
    <StoreProvider store={store}>
      <App/>
    </StoreProvider>
  ));
  
AppRegistry.registerComponent(appName, () => AppMensajeria);
