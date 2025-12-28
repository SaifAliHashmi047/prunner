import React from 'react';
import { Provider } from 'react-redux';
import { MainNavigator } from './src/services/navigation';
import { store } from './src/services/store';
import "react-native-gesture-handler";

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}

export default App;
