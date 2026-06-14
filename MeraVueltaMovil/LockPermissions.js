import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ImageBackground, StyleSheet, Linking } from 'react-native';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RequestPermissionsView = ({ requestPermissionsButton }) => {
  const [isSelected, setSelection] = useState(false);

  useEffect(() => {
    retrieveData();
  }, []);

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@checkbox_state', JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  };

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

  const handleCheckbox = () => {
    setSelection(!isSelected);
    storeData(!isSelected);
  };

  return (
    <ImageBackground style={styles.image}>
      <View style={styles.card}>
        <Text style={styles.heading}>Mera vuelta recoge/transmite/sincroniza/almacena la ubicación en tiempo real y usa la cámara para habilitar el seguimiento de las entregas mientras se tengan entregas asignadas</Text>
        <View style={styles.form}>
          <View style={styles.inputs}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                checked={isSelected}
                onPress={handleCheckbox}
                style={styles.checkbox}
              />
              <Text style={styles.label}>Acepto las políticas de seguridad</Text>
            </View>
            <Text style={styles.policyText}>Aquí están nuestras <Text style={styles.urlText} onPress={() => Linking.openURL('https://app.meravuelta.com/politics')}>políticas de seguridad</Text></Text>
            <TouchableOpacity style={styles.buttonAlt} onPress={requestPermissionsButton} disabled={!isSelected}>
              <Text style={styles.buttonAltText}>Dar permisos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    alignItems: 'center',
  },
  inputs: {
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: 'center',
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
    fontSize: 16,
  },
  policyText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  urlText: {
    color: 'blue',
    textDecorationLine: 'underline'
  },
  buttonAlt: {
    backgroundColor: '#0a827f',
    padding: 10,
    borderRadius: 5,
  },
  buttonAltText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  }
});
