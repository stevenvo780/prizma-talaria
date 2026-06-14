import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env"
export const fetchData = async (url, method, body) => {
  let user = await AsyncStorage.getItem('user');
  user = JSON.parse(user);
  let token = await AsyncStorage.getItem('token');
  token = JSON.parse(token);
  let options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
  };
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    options.body = JSON.stringify(body);
  }
  try {
    let response = await fetch(API_URL + "/" + url, options);
    let data = await response.json();
    if (data.error) {
      return { message: data.message ? data.message : "Error al traer datos" };
    }
    if (data) {
      return data;
    } else {
      return null
    }
  } catch (error) {
    console.error("error al traer datos", error);
    return { message: error.message ? error.message : "Error al traer datos" };
  }
};

