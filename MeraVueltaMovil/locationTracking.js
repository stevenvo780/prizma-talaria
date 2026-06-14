import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { fetchData } from "./src/api/api";
import DeviceInfo from "react-native-device-info";
import * as TaskManager from "expo-task-manager"
import { PermissionsAndroid, Linking, Alert } from 'react-native';

export const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error)
    return
  }
  if (data) {
    const { locations } = data
    const location = locations[0]
    if (location) {
      //console.info("Captura de Ubicacion en segundo plano", location.coords)
      validateTaskRemoveTask();
      sendLocation(location.coords);
    }
  }
})

export const validateTaskRemoveTask = async () => {
  const validate = await fetchData(
    `order/domiciliary/validate/tracing`,
    'GET'
  );
  if (!validate) {
    TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
      .then(async (isRegistered) => {
        if (isRegistered) {
          await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME)
            .then(() => console.info(`Tarea "${LOCATION_TASK_NAME}" detenida exitosamente.`))
            .catch((error) => console.error(`Error al detener tarea "${LOCATION_TASK_NAME}": ${error.message}`));
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

export const sendLocation = async (position) => {
  let user = await AsyncStorage.getItem('user');
  user = JSON.parse(user);
  await AsyncStorage.setItem('location', JSON.stringify(position));
  const validate = await fetchData(
    `order/domiciliary/validate/tracing`,
    'GET'
  );
  if (validate == true && position !== null && position.accuracy < 50) {
    let payload = {
      position: JSON.stringify(position),
      user: user.id,
    };
    const data = await fetchData(
      `positionUser`,
      'PATCH',
      payload
    );
    if (data?.message) {
      console.error("Error al enviar ubicacion", data.message)
    } else {
      //console.info("Enviada Ubicacion en segundo plano", data)
    }
  }
}

// Start location tracking in background
export const startBackgroundUpdate = async () => {
  // Don't track position if permission is not granted
  let { granted } = await Location.getBackgroundPermissionsAsync()
  if (!granted) {
    console.error("Fallo el seguimiento en segundo plano");
    return
  } else {
    console.info("Siguiendo en segundo plano");
  }

  // Make sure the task is defined otherwise do not start tracking
  const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME)
  if (!isTaskDefined) {
    console.error("Task is not defined");
    return
  }

  // // Don't track if it is already running in background
  // const hasStarted = await Location.hasStartedLocationUpdatesAsync(
  //   LOCATION_TASK_NAME
  // )

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    // For better logs, we set the accuracy to the most sensitive option
    accuracy: Location.Accuracy.BestForNavigation,
    // Make sure to enable this notification if you want to consistently track in the background
    showsBackgroundLocationIndicator: true,
    enableHighAccuracy: true,
    distanceInterval: 0,
    activityType: Location.LocationActivityType.AutomotiveNavigation,
    timeInterval: 20000,
    timeout: 40000,
    pausesUpdatesAutomatically: false,
    maximumAge: 1000,
    foregroundService: {
      notificationTitle: "Mera vuelta tracking",
      notificationBody: "Siguiendo un pedido",
      notificationColor: "#3a5f6f",
    },
  });
}

export const validateLocation = async () => {
  let value = await AsyncStorage.getItem('@checkbox_state');
  if(!value || value == "false"){
    return false;
  }
  let location = null;
  try {
    location = await Location.getCurrentPositionAsync({});
  } catch (error) {
    console.error("Location ERROR", JSON.stringify(location));
  }
  if (!location) {
    Alert.alert(
      'Error',
      'No se pudo obtener la ubicación, por favor revisa que tengas activado el GPS y que la aplicación tenga permisos para acceder a tu ubicación.',
      [
        {
          text: 'Cancelar',
          onPress: () => console.info('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Ir a configuración',
          onPress: () => Linking.openSettings(),
        },
      ],
      { cancelable: false }
    );
    return false
  } else {
    return true;
  }

}

export const validateTask = async () => {
  const validateLocationActive = await validateLocation();
  if (!validateLocationActive) {
    return;
  }
  const validate = await fetchData(
    `order/domiciliary/validate/tracing`,
    'GET'
  );
  if (validate == true) {
    TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
      .then(async (isRegistered) => {
        if (!isRegistered) {
          startBackgroundUpdate();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

export const requestPermissions = async () => {
  try {
    const androidVersion = DeviceInfo.getSystemVersion();
    const locationPermissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ];
    if (androidVersion >= 10) {
      locationPermissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
    }
    const cameraAndStoragePermissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ];

    const locationGranted = await PermissionsAndroid.requestMultiple(
      locationPermissions,
      {
        title: 'Permisos de ubicación',
        message: 'Necesitamos acceder a tu ubicación para hacer los seguimientos de los pedidos.',
        buttonNeutral: 'Pregúntame más tarde',
        buttonNegative: 'Cancelar',
        buttonPositive: 'Aceptar',
      },
    );

    const cameraAndStorageGranted = await PermissionsAndroid.requestMultiple(
      cameraAndStoragePermissions,
      {
        title: 'Permisos de cámara y almacenamiento',
        message: 'Necesitamos acceder a tu cámara y almacenamiento para tomar fotos y guardarlas.',
        buttonNeutral: 'Pregúntame más tarde',
        buttonNegative: 'Cancelar',
        buttonPositive: 'Aceptar',
      },
    );
    const allPermissionsGranted = [
      ...Object.values(locationGranted),
      ...Object.values(cameraAndStorageGranted),
    ].every((permission) => permission === PermissionsAndroid.RESULTS.GRANTED);
    if (!allPermissionsGranted) {
      Alert.alert(
        'Permisos requeridos',
        'Es necesario otorgar permisos para utilizar esta función.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Abrir configuración',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    } else {
      // Los permisos han sido concedidos.
      validateTask();
      return true;
    }
  } catch (err) {
    console.warn(err);
  }
};