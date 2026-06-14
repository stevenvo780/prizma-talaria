import React, { useState, memo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WEB_URL } from "@env";
import openMap from 'react-native-open-maps';
import { Linking } from "react-native";
import styles from "./styles";
import { fetchData } from "../api/api";
import BackgroundService from 'react-native-background-actions';
import ButtonStandard from '../components/ButtonStandard/ButtonStandard';

const options = {
	taskName: 'Guardado datos',
	taskTitle: 'Guardado ordenes en mera vuelta',
	taskDesc: 'Actualizando datos...',
	taskIcon: {
		name: 'ic_launcher',
		type: 'mipmap',
	},
};

export const RenderItem = memo(({
	order,
	ordersState,
	setStateOrders,
	retrieveData,
	navigation,
	handleSelectOrder,
	handleUnSelectedOrder,
	ordersSelected,
	pushNotification
}) => {
	const [loading, setLoading] = useState(false);
	const [checked, setChecked] = useState(false);

	const toggleCheckBox = () => {
		if (ordersState === 'EsperaSalida' || ordersState === 'Aceptada') {
			if (!checked === false) {
				handleUnSelectedOrder(order);
			} else {
				handleSelectOrder(order);
			}
			setChecked(!checked);
		}
	};

	const isSelectable = ordersState === 'EsperaSalida' || ordersState === 'Aceptada';

	useEffect(() => {
		if (ordersSelected.length === 0) {
			setChecked(false);
		} else {
			const orderSelected = ordersSelected.find((orderSelected) => orderSelected.id === order.id);
			if (orderSelected) {
				setChecked(true);
			} else {
				setChecked(false);
			}
		}
	}, [ordersSelected]);


	return (
		<>
			<TouchableOpacity
				style={styles.itemContainer}
				activeOpacity={1}
				onLongPress={toggleCheckBox}
			>
				<View>
					<ValuesTarget order={order} isSelectable={isSelectable} />
					{checked === false && (
						<ButtonsItem
							order={order}
							ordersState={ordersState}
							setStateOrders={setStateOrders}
							retrieveData={retrieveData}
							navigation={navigation}
							loading={loading}
							setLoading={setLoading}
							handleViewMap={handleViewMap}
							pushNotification={pushNotification}
						/>
					)}
					{isSelectable && (
						<CheckBox
							containerStyle={styles.checkBox}
							checked={checked}
							onPress={toggleCheckBox}
							uncheckedColor='#5b5b5b'
							checkedColor={isSelectable ? undefined : '#ccc'}
						/>
					)}
				</View>
			</TouchableOpacity>
		</>
	);
});

export const ButtonsItem = memo(({
	order,
	ordersState,
	setStateOrders,
	retrieveData,
	navigation,
	loading,
	setLoading,
	pushNotification
}) => {
	return (
		<>
			{ordersState === "Salida" && (
				<ExitItem
					order={order}
					setStateOrders={setStateOrders}
					navigation={navigation}
					loading={loading}
					setLoading={setLoading}
					pushNotification={pushNotification}
				/>
			)}
			{ordersState === "EsperaSalida" && (
				<WaitItem
					retrieveData={retrieveData}
					setStateOrders={setStateOrders}
					orders={[order]}
					loading={loading}
					setLoading={setLoading}
					pushNotification={pushNotification}
				/>
			)}
			{ordersState === "Entregada" && (
				<FinishedItem
					order={order}
					loading={loading}
					setLoading={setLoading}
				/>
			)}
			{ordersState === "Aceptada" && (
				<AgreeItem
					setStateOrders={setStateOrders}
					orders={[order]}
					loading={loading}
					setLoading={setLoading}
					pushNotification={pushNotification}
				/>
			)}
		</>
	);
});

export const ValuesTarget = React.memo(({ order, isSelectable }) => {
	return (
		<>
			<View style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				top: -10,
				elevation: 4,
			}}>
				<TouchableOpacity
					onPress={() =>
						Alert.alert(
							'Confirmar',
							'¿Desea contactar al cliente?',
							[
								{
									text: 'Cancelar',
									onPress: () => console.info('Cancel Pressed'),
									style: 'cancel',
								},
								{ text: 'Entregar', onPress: Linking.openURL(`https://wa.me/+${order.prefix}${order.clientPhone}`).catch((err) => console.error('An error occurred', err)) },
							],
							{ cancelable: false },
						)
					}
					style={[styles.title, {
						elevation: 4,
						width: "50%",
					}]}>
					<Text>
						<Feather name="phone" size={20} color="#095169" />{' '}
						{order.name.length > 13
							? `${order.name.slice(0, 13)}...`
							: order.name}
					</Text>
				</TouchableOpacity>
				<Text style={[styles.titleCard, { left: (order.name.length > 13 || order.purchaseNumber.length > 8) ? -20 : 10 }]}># {order.purchaseNumber}</Text>
				{isSelectable && (
					<Text></Text>
				)}
			</View>
			<View style={{ borderBottomColor: '#a8a8a8', borderBottomWidth: 1, left: -20, width: "113%", marginBottom: 5 }} />
			<View>
				<Text style={styles.description}>N° Entrega: {order.deliveryNumber}</Text>
				<Text style={styles.description}>Ubicacion: {order.department} - {order.city} </Text>
				<Text style={styles.description}>Origen: {order.pickupAddress}</Text>
				<Text style={styles.description}>Destino: {order.deliveryAddress}</Text>
				<Text style={styles.description}>Barrio: {order.neighborhood}</Text>
				<Text style={styles.description}>Detalle: {order.residentialGroupName} - {order.houseNumberOrApartment}</Text>
			</View>
		</>
	)
});

export const WaitItem = React.memo(({ loading, orders, setLoading, setStateOrders, retrieveData, pushNotification }) => {
	const handleAlert = async (confirm) => {
		await AsyncStorage.setItem('dataResponseOrders', JSON.stringify(confirm, orders, setLoading, setStateOrders, retrieveData, pushNotification));
		await BackgroundService.start(responseOrders(confirm, orders, setLoading, setStateOrders, retrieveData, pushNotification), options);
	};

	return (
		<View style={[styles.fixToText, { justifyContent: 'flex-end' }]}>
			{loading ? (
				<Text numberOfLines={5}>Cargando ...</Text>
			) : (
				<>
					<View style={{ marginLeft: 50 }}>
						<ButtonStandard onPress={() =>
							Alert.alert(
								'Confirmar',
								'¿Estás seguro de que deseas rechazar esta orden?',
								[
									{
										text: 'Cancelar',
										onPress: () => console.info('Cancel Pressed'),
										style: 'cancel',
									},
									{ text: 'Aceptar', onPress: () => handleAlert(false) },
								],
								{ cancelable: false },
							)
						}>
							<View>
								<Feather name="x-circle" size={40} color="#095169" />
								<Text style={[styles.buttonText]}>Rechazar</Text>
							</View>
						</ButtonStandard>
					</View>
					<View style={{ marginLeft: 20 }}>
						<ButtonStandard onPress={() =>
							Alert.alert(
								'Confirmar',
								'¿Estás seguro de que deseas aceptar esta orden?',
								[
									{
										text: 'Cancelar',
										onPress: () => console.info('Cancel Pressed'),
										style: 'cancel',
									},
									{ text: 'Aceptar', onPress: () => handleAlert(true) },
								],
								{ cancelable: false },
							)
						}>
							<View>
								<Feather name="check-circle" size={40} color="#095169" />
								<Text style={[styles.buttonText]}>Aceptar</Text>
							</View>
						</ButtonStandard>
					</View>
				</>
			)}
		</View >
	);
});

export const AgreeItem = React.memo(({ orders, multiSelect = false, loading, setLoading, setStateOrders, pushNotification }) => {
	const handleAlert = async () => {
		await BackgroundService.start(exitOrders(orders, setLoading, setStateOrders, pushNotification), options);
	};

	return (
		<>
			{loading ? (
				<View style={[styles.fixToText, { justifyContent: 'flex-end' }]}>
					<Text numberOfLines={5}>Cargando ...</Text>
				</View>
			) : (
				<>
					<View style={[styles.fixToText, { justifyContent: multiSelect ? 'flex-end' : 'space-between' }]}>
						{multiSelect === false && (
							<>
								<ButtonStandard onPress={() => handleViewMap(orders[0])}>
									<View>
										<MaterialCommunityIcons name="crosshairs-gps" style={{ left: 10 }} size={40} color="#095169" />
										<Text style={[styles.buttonText]}>Coordenadas</Text>
									</View>
								</ButtonStandard>
							</>
						)}
						{multiSelect === false && (
							<>
								<ButtonStandard onPress={() => handleViewMapDirection(orders[0])}>
									<View>
										<Entypo name="location-pin" size={40} color="#095169" />
										<Text style={[styles.buttonText]}>Direccion</Text>
									</View>
								</ButtonStandard>
							</>
						)}
						<ButtonStandard onPress={() =>
							Alert.alert(
								'Confirmar',
								'¿Estás seguro de que deseas entregar esta orden?',
								[
									{
										text: 'Cancelar',
										onPress: () => console.info('Cancel Pressed'),
										style: 'cancel',
									},
									{ text: 'Entregar', onPress: handleAlert },
								],
								{ cancelable: false },
							)
						}>
							<View>
								<Feather name="package" size={40} color="#095169" />
								<Text style={[styles.buttonText]}>Entregar</Text>
							</View>
						</ButtonStandard>
					</View >
				</>
			)
			}
		</>
	);
});


export const FinishedItem = React.memo(({ order }) => {
	const handleViewOrder = () => {
		Linking.openURL(`${WEB_URL}/takeOrder/${order.deliveryNumber}`);
	};

	return (
		<View style={[styles.fixToText, { justifyContent: 'center' }]}>
			<ButtonStandard onPress={() => handleViewOrder()}>
				<View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
					<AntDesign name="eyeo" size={40} color="#095169" />
					<Text style={{ top: 10 }}> Ver orden</Text>
				</View>
			</ButtonStandard>
		</View>
	);
});

export const ExitItem = React.memo(({ order, navigation, setStateOrders }) => {
	return (
		<>
			<View style={[styles.fixToText]}>
				<ButtonStandard onPress={() => { handleViewMap(order) }}>
					<View>
						<MaterialCommunityIcons name="crosshairs-gps" style={{ left: 10 }} size={40} color="#095169" />
						<Text style={[styles.buttonText]}>Coordenadas</Text>
					</View>
				</ButtonStandard>
				<ButtonStandard onPress={() => { handleViewMapDirection(order) }}>
					<View>
						<Entypo name="location-pin" size={40} color="#095169" />
						<Text style={[styles.buttonText]}>Direccion</Text>
					</View>
				</ButtonStandard>
				<ButtonStandard onPress={() => handleFinalize(order, navigation, setStateOrders)}>
					<View>
						<MaterialCommunityIcons name="note-check-outline" size={40} color="#095169" />
						<Text style={[styles.buttonText]}>Finalizar</Text>
					</View>
				</ButtonStandard>
			</View>
		</>
	);
});

export const exitOrders = async (orders, setLoading, setStateOrders, pushNotification) => {
	setLoading(true);
	const ordersUpdate = [];
	for (let i = 0; i < orders.length; i++) {
		const order = orders[i];
		let payload;
		payload = {
			id: order.id,
			purchaseNumber: order.purchaseNumber,
			deliveryNumber: order.deliveryNumber,
			orderState: "Salida",
			company: order.company.toString(),
		};
		ordersUpdate.push(payload);
	}
	await fetchData(`order/domiciliary/massive`, "PATCH", { orders: ordersUpdate });
	await BackgroundService.updateNotification({ taskDesc: 'Actualizando ordenes' });
	await BackgroundService.stop();
	setStateOrders("Salida");
	pushNotification("Actualizado correctamente", "#0a827f");
	setLoading(false);
};

export const handleFinalize = async (order, navigation, setStateOrders) => {
	await AsyncStorage.setItem("orderSelected", JSON.stringify(order));
	setStateOrders("Finalizada");
	navigation.navigate("Entregar orden");
};

export const responseOrders = async (status, orders, setLoading, setStateOrders, retrieveData, pushNotification) => {
	setLoading(true);
	const ordersUpdate = [];
	for (let i = 0; i < orders.length; i++) {
		const order = orders[i];
		let payload;
		if (status) {
			payload = {
				id: order.id,
				purchaseNumber: order.purchaseNumber,
				deliveryNumber: order.deliveryNumber,
				orderState: "Aceptada",
				company: order.company.toString(),
			};
		} else {
			payload = {
				id: order.id,
				purchaseNumber: order.purchaseNumber,
				deliveryNumber: order.deliveryNumber,
				orderState: "EsperaDespacho",
				domiciliary: "0",
				company: order.company.toString(),
			};
		}
		ordersUpdate.push(payload);
	}
	await fetchData(`order/domiciliary/massive`, "PATCH", { orders: ordersUpdate });
	await BackgroundService.updateNotification({ taskDesc: 'Actualizando ordenes' });
	if (status) {
		setStateOrders("Aceptada")
	} else {
		retrieveData();
	};
	await BackgroundService.stop();
	pushNotification("Actualizado correctamente", "#0a827f");
	setLoading(false);
};

export const handleViewMap = (order) => {
	const geolocationDelivery = order.geolocationDelivery
		? JSON.parse(order.geolocationDelivery)
		: null;
	const query = geolocationDelivery
		? `${geolocationDelivery.latitude}, ${geolocationDelivery.longitude}`
		: order.deliveryAddress;
	openMap({ latitud: 6.253762, longitud: -75.574973, query, zoom: 15 });
};

export const handleViewMapDirection = (order) => {
	const query = `${order.neighborhood} ${order.deliveryAddress} ${order.department} ${order.city}`;
	openMap({ latitud: 6.253762, longitud: -75.574973, query, zoom: 15 });
};

export const FloatingMessage = ({ message, backgroundColor, onDismiss, index }) => {
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const translateY = useRef(new Animated.Value(50)).current;
	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 500,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: 0,
				duration: 500,
				useNativeDriver: true,
			}),
		]).start(() => {
			setTimeout(() => {
				Animated.parallel([
					Animated.timing(fadeAnim, {
						toValue: 0,
						duration: 500,
						useNativeDriver: true,
					}),
					Animated.timing(translateY, {
						toValue: 50,
						duration: 500,
						useNativeDriver: true,
					}),
				]).start(onDismiss);
			}, 3000);
		});
	}, []);

	return (
		<Animated.View
			style={[
				stylesFloating.messageContainer,
				{
					backgroundColor,
					opacity: fadeAnim,
					transform: [{ translateY }],
					bottom: 20 + index * 60,
				},
			]}
		>
			<Text style={stylesFloating.messageText}>{message}</Text>
		</Animated.View>
	);
};

const stylesFloating = StyleSheet.create({
	messageContainer: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 5,
		marginHorizontal: 20,
		marginBottom: 20,
		alignSelf: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		position: 'absolute',
		bottom: 0,
		zIndex: 999,
		width: '80%',
	},
	messageText: {
		color: '#fff',
		fontSize: 16,
	},
});
