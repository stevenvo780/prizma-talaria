import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
	View,
	Text,
	TouchableOpacity,
	TextInput,
	Image,
	Platform,
	Button,
	PermissionsAndroid,
	Linking,
	Keyboard
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from "./styles";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { fetchData } from "../api/api";
import { validateLocation } from '../../locationTracking';
import RNRestart from 'react-native-restart';


const DeliverOrderScreen = (props) => {
	const [isError, setIsError] = useState(false);
	const [note, setNote] = useState('Entregado');
	const [message, setMessage] = useState('');
	const [order, setOrder] = useState(null);
	const [imgSource, setImgSource] = useState(null);
	const storage = getStorage();
	const navigation = useNavigation();

	const goBack = () => {
		navigation.goBack();
	};

	const onSubmitHandler = async () => {
		if (!imgSource) {
			setMessage("Hace falta tomar una foto");
			setIsError(true);
			return;
		}
		if (note === '') {
			setMessage("Hace falta una nota");
			setIsError(true);
			return;
		}

		setMessage('Guardando...');
		setIsError(false);

		try {
			const uploadUri = Platform.OS === "ios" ? imgSource.uri.replace("file://", "") : imgSource.uri;
			const storageRef = ref(storage, `images/${imgSource.name}`);
			const response = await fetch(uploadUri);
			const blob = await response.blob();

			const snapshot = await uploadBytesResumable(storageRef, blob);
			const downloadURL = await getDownloadURL(snapshot.ref);

			const validateLocationResponse = await validateLocation();
			if (!validateLocationResponse) {
				setMessage("Falta ubicación activa la ubicación en el dispositivo");
				setIsError(true);
				return;
			}

			const location = await AsyncStorage.getItem('location');

			const payload = {
				dealerNote: note,
				pickupPicture: downloadURL,
				pickupLocation: location,
				pickupTime: new Date(),
				orderState: "Entregada",
			};
			const data = await fetchData(`order/${order.deliveryNumber}`, 'PATCH', payload);

			if (!data || data.message) {
				setMessage(data.message);
				setIsError(true);
			} else {
				setMessage("Guardado con éxito");
				setIsError(false);
				props.navigation.navigate('Ordenes', { ordenFinalizada: true });
			}
		} catch (error) {
			console.error(`Failed to upload file and get link - ${error}`);
			alert(`Ocurrió un error al subir la imagen`);
		}
	};

	const restartApp = () => {
		RNRestart.Restart();
	};

	const takePhoto = React.useCallback(async () => {
		try {
			const permissions = [
				PermissionsAndroid.PERMISSIONS.CAMERA,
				PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
			];

			const checkPermissions = async () => {
				const result = await Promise.all(permissions.map(permission => PermissionsAndroid.check(permission)));
				return result.every(value => value);
			};

			const requestPermissions = async () => {
				const granted = await PermissionsAndroid.requestMultiple(permissions, {
					title: 'Permisos de cámara',
					message: 'Necesitamos acceder a tu ubicación para hacer los seguimientos de los pedidos.',
					buttonNeutral: 'Pregúntame más tarde',
					buttonNegative: 'Cancelar',
					buttonPositive: 'Aceptar',
				});

				return Object.values(granted).every(value => value === PermissionsAndroid.RESULTS.GRANTED);
			};

			const hasPermissions = await checkPermissions();
			if (!hasPermissions) {
				const granted = await requestPermissions();
				if (!granted) {
					Linking.openSettings();
					return;
				}
			}

			let result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				quality: 0.4,
			});
			if (result?.assets?.length > 0) {
				setImgSource({
					uri: result.assets[0].uri,
					name: result.assets[0].uri.split("/").pop()
				});
			}
		} catch (error) {
			restartApp();
			console.error('Error while launching camera:', error);
		}
	}, []);
	const [showImage, setShowImage] = useState(true);
	const handleKeyboardShow = React.useCallback(() => {
		setShowImage(false);
	});

	const handleKeyboardHide = React.useCallback(() => {
		setShowImage(true);
	});
	const handleButtonPress = (text) => {
		setNote(text);
	};

	React.useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", handleKeyboardShow);
		const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", handleKeyboardHide);
		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);
	const getOrder = async () => {
		const orderData = JSON.parse(await AsyncStorage.getItem('orderSelected'));
		setOrder(orderData);
	}
	React.useEffect(() => {
		if (order !== null) {
			takePhoto();
		}
	}, [order]);
	React.useEffect(() => {
		getOrder();
	}, []);
	return (
		<View style={styles.card}>
			<View style={styles.header}>
				<TouchableOpacity onPress={goBack}>
					<Text style={styles.goBackButton}>←</Text>
				</TouchableOpacity>
				<Text style={styles.heading}>Constancia de entrega</Text>
				<Text style={styles.heading}>#{order?.purchaseNumber}</Text>
			</View>
			{showImage && (
				<>
					{imgSource !== null ? (
						<Image style={styles.uploadImage} source={{ uri: imgSource.uri }} />
					) : (
						<TouchableOpacity style={styles.emptyImage} onPress={takePhoto}>
							<AntDesign name="camera" size={48} color="white" />
						</TouchableOpacity>
					)}
				</>
			)}
			<View style={styles.form}>
				<View style={styles.inputs}>
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.smallButton} onPress={() => handleButtonPress('Entregado')}>
							<Text style={styles.smallButtonText}>Entregado</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.smallButton} onPress={() => handleButtonPress('En portería')}>
							<Text style={styles.smallButtonText}>En portería</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.smallButton} onPress={() => handleButtonPress('No entregado')}>
							<Text style={styles.smallButtonText}>No entregado</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input}
							placeholder="Nota"
							value={note}
							multiline={true}
							autoCapitalize="none"
							onChangeText={setNote}
						/>
						{note.length > 0 && (
							<TouchableOpacity onPress={() => setNote('')} style={styles.clearIcon}>
								<Ionicons name="close-circle" size={24} color="#8f8f8f" />
							</TouchableOpacity>
						)}
					</View>
					<TouchableOpacity style={styles.buttonAlt} onPress={onSubmitHandler}>
						<Text style={styles.buttonAltText}>Guardar</Text>
					</TouchableOpacity>
					<Text style={[styles.message, { color: isError ? '#f44336' : '#0a827f' }]}>{message}</Text>
				</View>
			</View>
		</View>
	);
};

export default DeliverOrderScreen;
