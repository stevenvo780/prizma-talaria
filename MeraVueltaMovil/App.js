import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthScreen } from './src/screens';
import { OrdersScreen } from './src/orders';
import { DeliverOrderScreen } from './src/deliverOrder';
import { useEffect, useState } from 'react';
import firebase from './src/firebase';
import {
  requestPermissions,
  validateTask,
} from './locationTracking';
import { RequestPermissionsView } from './LockPermissions';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {
  const [grantedFull, setGrantedFull] = useState(false);

  const requestPermissionsButton = async () => {
    const response = await requestPermissions();
    if (response) {
      setGrantedFull(true);
    }
  }

  const [isSelected, setSelection] = useState(false);

  useEffect(() => {
    retrieveData();
  }, []);


  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('@checkbox_state');
      if (value !== null) {
        setSelection(JSON.parse(value));
      }
    } catch (e) {
      console.error(e);
    }
  };

  validateTask();
  if (!grantedFull && !isSelected) {
    return (
      <RequestPermissionsView
        requestPermissionsButton={requestPermissionsButton}
      />
    )
  }

  return (
    <>
      <StatusBar backgroundColor="#f4f3ef" barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen
            name="Inicio"
            component={AuthScreen}
          />
          <Stack.Screen
            name="Ordenes"
            component={OrdersScreen}
          />
          <Stack.Screen
            name="Entregar orden"
            component={DeliverOrderScreen}
            options={{ unmountOnBlur: true }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
