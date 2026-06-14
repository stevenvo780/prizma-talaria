import React, { useState } from 'react';
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchData } from "../api/api"

const AuthScreen = (props) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [isError, setIsError] = useState(false);
	const [message, setMessage] = useState('');
	const [isLogin, setIsLogin] = useState(true);
	(async function () {
		let user = await AsyncStorage.getItem('user');
		if (user) {
			props.navigation.navigate('Ordenes');
		}
	})();
	const onSubmitHandler = async () => {
		if (!email || !password) {
			setIsError(true);
			setMessage('Por favor ingrese todos los campos');
			return;
		}
		const payload = {
			email: email.trim(),
			password,
		};
		setIsError(false);
		setMessage("Cargando ...");
		const data = await fetchData(`auth`, 'POST', payload);
		if (data == null) {
			setIsError(true);
			setMessage("Error al iniciar sesión");
			return;
		} else {
			if (data.message) {
				setIsError(true);
				setMessage(data.message);
				return null;
			}
			if (data.token) {
				if (data.user.confirmEmail == false || data.user.confirmEmail == null) {
					setIsError(true);
					setMessage("Por favor confirma tu correo");
					const supported = await Linking.canOpenURL("https://app.meravuelta.com/");
					if (supported) {
						await Linking.openURL("https://app.meravuelta.com/");
						return;
					} else {
						Alert.alert(`No se puede abrir el enlace: ${url}`);
					}
				}
				if (data.user.role !== 'domiciliary') {
					setIsError(true);
					setMessage("Esta app es solo para repartidores");
					return null;
				}
				try {
					await AsyncStorage.setItem(
						'user',
						JSON.stringify(data.user)
					);
					await AsyncStorage.setItem(
						'token',
						JSON.stringify(data.token)
					);
					props.navigation.navigate('Ordenes');
				} catch (error) {
					console.error("error al guardar" + error);
				}
				setIsError(false);
				setIsLogin(!isLogin);
				setMessage('');
			} else {
				setIsError(true);
				setMessage('Error en los datos');
			}
		}
	};

	return (
		<KeyboardAvoidingView behavior="height" keyboardVerticalOffset={140} style={{ flex: 1 }}>
			<ImageBackground style={styles.image}>
				<Logo />
				<View style={styles.card}>
					<View style={styles.headingContent}>
						<Text style={styles.heading}>Mera Vuelta</Text>
					</View>
					<View style={styles.form}>
						<View style={styles.inputs}>
							<TextInput style={styles.input} placeholder="Correo" autoCapitalize="none" onChangeText={setEmail}></TextInput>
							<TextInput secureTextEntry={true} style={styles.input} placeholder="Contraseña" onChangeText={setPassword}></TextInput>
							<Text style={[styles.message, { color: isError ? 'red' : 'green' }]}>{message}</Text>
							<TouchableOpacity style={styles.buttonLogin} onPress={onSubmitHandler}>
								<Text style={styles.buttonAltText}>iniciar sesión</Text>
							</TouchableOpacity>
							<OpenURLButton color="#095169" url="https://app.meravuelta.com/register">Registrarse</OpenURLButton>
							<View style={styles.recovery}>
								<OpenURLButton color="#66615B" url="https://app.meravuelta.com/recoverPassword/null">Recuperar contraseña</OpenURLButton>
							</View>
						</View>
					</View>
				</View>
			</ImageBackground>
		</KeyboardAvoidingView>
	);
};

const OpenURLButton = ({ url, children, color }) => {
	const handlePress = async () => {
		const supported = await Linking.canOpenURL(url);
		if (supported) {
			await Linking.openURL(url);
		} else {
			Alert.alert(`No se puede abrir el enlace: ${url}`);
		}
	};
	return (
		<TouchableOpacity style={[styles.buttonAltRegister, {
			borderColor: color,
			backgroundColor: color,
		}]} onPress={handlePress}>
			<Text style={[styles.buttonAltText]} >{children}</Text>
		</TouchableOpacity>
	);
};

const Logo = () => {
	const handlePress = () => {
		Linking.openURL('https://app.meravuelta.com/');
	};

	return (
		<TouchableOpacity onPress={handlePress}>
			<Image
				source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/domicilios-fc429.appspot.com/o/assets%2FDise%C3%B1o%20nuevo%20logo%201080.png?alt=media&token=81605ee7-c7d6-4b25-9857-0b0b19509ffb' }}
				style={{ width: 150, height: 150, alignSelf: 'center', marginTop: '5%' }}
			/>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	recovery: {
		paddingTop: 50,
		textAlign: 'center',
		width: '60%',
		fontSize: 12,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	legend: {
		fontSize: 12,
		color: 'grey',
		marginTop: 10,
		textAlign: 'center',
		padding: '5%',
	},
	image: {
		flex: 1,
		width: '100%',
		alignItems: 'center',
		backgroundColor: '#F4F3EF',
	},
	card: {
		flex: 1,
		width: '99%',
		marginTop: '5%',
		borderRadius: 20,
		maxHeight: 380,
		paddingBottom: '30%',
	},
	headingContent: {
		width: '100%',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: '5%',
		marginBottom: '30%',
	},
	heading: {
		fontSize: 40,
		color: 'black',
	},
	form: {
		flex: 1,
		justifyContent: 'space-between',
		paddingBottom: '5%',
	},
	inputs: {
		width: '100%',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: '8%',
	},
	input: {
		width: '90%',
		borderColor: '#D9D9D9',
		borderWidth: 1,
		borderRadius: 5,
		marginTop: 10,
		padding: 10,
		fontSize: 16,
		minHeight: 40,
	},
	buttonLogin: {
		width: '80%',
		borderWidth: 1,
		height: 40,
		borderRadius: 15,
		borderColor: '#0a827f',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 5,
		backgroundColor: '#0a827f',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 3,
	},
	buttonAltRegister: {
		width: '80%',
		borderWidth: 1,
		height: 40,
		borderRadius: 15,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 5,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 3,
	},
	buttonAltText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '400',
	},
	message: {
		fontSize: 16,
		height: 20,
		margin: '1%',
	},
});

export default AuthScreen;