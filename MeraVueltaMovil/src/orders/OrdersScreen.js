import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, TouchableHighlight, Linking, TextInput, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from "react-native-dropdown-picker";
import styles from "./styles";
import { RenderItem, AgreeItem, WaitItem, FloatingMessage } from "./Components";
import { fetchData } from "../api/api";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { validateTask } from '../../locationTracking';

const OrdersScreen = (props) => {
	const [orders, setOrders] = useState([]);
	const [ordersState, setStateOrders] = useState('EsperaSalida');
	const [ordersSelected, setStateOrdersSelected] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingPagination, setLoadingPagination] = useState(false);
	const [skip, setSkip] = useState(0);
	const [take, setTake] = useState(20);
	const [takeText, setTakeText] = useState('20');
	const [page, setPage] = useState(1);
	const [orderQuery, setOrderQuery] = useState(false);
	const [user, setUser] = useState(null);
	const [searchWord, setSearchWord] = useState("");
	const [allSelected, setAllSelected] = useState(false);
	const handleSelectOrder = (order) => {
		if (ordersState === 'EsperaSalida' || ordersState === 'Aceptada') {
			if (ordersSelected.includes(order)) {
				setStateOrdersSelected(ordersSelected.filter((item) => item !== order));
			} else {
				setStateOrdersSelected([...ordersSelected, order]);
			}
		}
	};

	const handleUnSelectedOrder = (order) => {
		setStateOrdersSelected(ordersSelected.filter((item) => item !== order));
	};

	const handleDeleteOrders = async () => {
		setStateOrdersSelected([]);
	};
	const handleSelectAllOrders = () => {
		if (!allSelected) {
			setStateOrdersSelected(orders);
			setAllSelected(true);
		} else {
			setStateOrdersSelected([]);
			setAllSelected(false);
		}
	};

	useEffect(() => {
		if (ordersSelected.length !== orders.length) {
			setAllSelected(false);
		}
	}, [ordersSelected]);

	const handlePagination = async (type) => {
		setLoading(true);
		let newSkip = skip;
		let newTake = take;

		if (type === 'next') {
			newSkip += 20;
		} else if (type === 'previous' && skip > 0) {
			newSkip -= 20;
		} else {
			setLoading(false);
			return;
		}
		const data = await fetchData(
			`order/user/domiciliary?take=${newTake}&skip=${newSkip}&orderQuery=${orderQuery}&state=${ordersState}`,
			'GET'
		);
		if (data.length > 0) {
			setOrders(data);
			setSkip(newSkip);
			if (page > 0) {
				setPage((prevPage) => (type === 'next' ? prevPage + 1 : prevPage - 1));
			}
		}
		setLoading(false);
	};

	const searchOrder = async (text) => {
		setLoading(true);
		if (text.length > 0) {
			const data = await fetchData(
				`order/search/domiciliary?orderQuery=${orderQuery}&domiciliaryId=${user.id}&word=${text}&state=${ordersState}`,
				'GET',
			);
			if (data.length > 0) {
				setOrders(data);
			}
		}
		setLoading(false);
	};

	const [openCompany, setOpenCompany] = useState(false);
	const [valueCompany, setValueCompany] = useState('0');
	const [company, setCompany] = useState([]);

	const loadCompany = async () => {
		setLoading(true);
		const data = await fetchData(
			`domiciliaryCompany/byDomiciliary`,
			'GET',
		);
		if (data.length > 0) {
			const dataConvertLabel = data.map((item) => {
				return {
					label: item.company.companyName,
					value: item.company.id,
				};
			});
			setCompany(dataConvertLabel);
			setValueCompany(dataConvertLabel[0].value);
		}
		setLoading(false);
	};

	React.useEffect(() => {
		loadInitData();
	}, []);

	const loadInitData = async () => {
		await loadCompany();
		await retrieveData();
	}

	React.useEffect(() => {
		retrieveData(ordersState);
	}, [take]);

	const retrieveData = async (state) => {
		setLoading(true);
		const data = await fetchData(
			`order/user/domiciliary?take=${take}&skip=${0}&orderQuery=${orderQuery}&state=${state ? state : ordersState}&company=${valueCompany}`,
			'GET'
		);
		if (data.length > 0) {
			setOrders(data);
		} else {
			setOrders([]);
		}
		setSkip(0);
		setPage(1);
		validateTask();
		setLoading(false);
	};

	const loadMoreOrders = async () => {
		setLoadingPagination(true);
		const newSkip = parseInt(skip) > 0 ? parseInt(skip) + parseInt(take) : parseInt(take) + parseInt(take)
		const data = await fetchData(
			`order/user/domiciliary?take=${take}&skip=${newSkip}&orderQuery=${orderQuery}&state=${ordersState}&company=${valueCompany}`,
			'GET'
		);
		if (data.length > 0) {
			setOrders([...orders, ...data]);
			setSkip(newSkip);
			setPage(page + 1);
		}
		setLoadingPagination(false);
	};

	useEffect(() => {
		const callUser = async () => {
			let user = await AsyncStorage.getItem('user');
			user = JSON.parse(user);
			if (user !== null) {
				setUser(user);
			}
		}
		callUser();
	}, []);

	async function logout() {
		await AsyncStorage.removeItem(
			'user'
		);
		props.navigation.navigate('Inicio');
	}

	const handleChangeOrderQuery = () => {
		setOrderQuery(!orderQuery);
	}
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('EsperaSalida');
	const [items, setItems] = useState([
		{ label: "En espera", value: "EsperaSalida" },
		{ label: "En ruta", value: "Aceptada" },
		{ label: "En curso", value: "Salida" },
		{ label: "Finalizadas", value: "Entregada" },
	]);
	useEffect(() => {
		if (value) {
			setStateOrders(value);
		}
	}, [value]);
	useEffect(() => {
		if (ordersState) {
			setValue(ordersState)
		}
	}, [ordersState]);
	useEffect(() => {
		if (valueCompany > 0) {
			retrieveData();
			handleDeleteOrders();
		}
	}, [ordersState, orderQuery]);
	const openURL = (url) => {
		Linking.openURL(url).catch((err) => console.error('An error occurred', err));
	};
	const spinValue = useRef(new Animated.Value(0)).current;

	const loadingAnimation = Animated.loop(
		Animated.timing(spinValue, {
			toValue: 1,
			duration: 2000,
			useNativeDriver: true,
		}),
	);

	useEffect(() => {
		if (loading) {
			loadingAnimation.start();
		} else {
			loadingAnimation.reset();
		}
	}, [loading, loadingAnimation]);

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg'],
	});
	const [menuVisible, setMenuVisible] = useState(false);

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};
	const [notifications, setNotifications] = useState([]);

	const pushNotification = (message, backgroundColor) => {
		const id = Date.now(); // Utiliza la hora actual como ID único
		setNotifications((prevNotifications) => [
			...prevNotifications,
			{ id, message, backgroundColor },
		]);
	};
	if (props.route?.params?.ordenFinalizada) {
		props.route.params.ordenFinalizada = false;
		setStateOrders('Salida');
		pushNotification("Actualizado correctamente", "#0a827f");
	}

	const removeNotification = (id) => {
		setNotifications((prevNotifications) =>
			prevNotifications.filter((notification) => notification.id !== id),
		);
	};
	return (
		<SafeAreaView style={styles.container}>
			{notifications.map((notification, i) => (
				<FloatingMessage
					index={i}
					key={notification.id}
					message={notification.message}
					backgroundColor={notification.backgroundColor}
					onDismiss={() => removeNotification(notification.id)}
				/>
			))}
			{menuVisible && (
				<View style={styles.menu}>
					<Text style={{ fontWeight: 'bold' }} >{(user?.name + " " + user?.lastName).slice(0, 35)}</Text>
					<View style={{ borderBottomColor: '#a8a8a8', borderBottomWidth: 1, left: 2, width: "98%", marginTop: 10 }} />
					<TouchableOpacity style={[styles.menuItem, { marginTop: 10 }]} onPress={() => openURL('https://app.meravuelta.com')}>
						<FontAwesome5 name="cog" size={25} color="#999" style={{ marginRight: 10 }} />
						<Text>Configuraciones</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.menuItem} onPress={logout}>
						<FontAwesome5 name="sign-out-alt" size={25} color="#f44336" style={{ marginRight: 10 }} />
						<Text>Cerrar sesión </Text>
					</TouchableOpacity>
				</View>
			)}
			<View style={styles.headerContainer}>
				<View style={[styles.row, { justifyContent: 'space-between', marginBottom: -10 }]}>
					<View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
						<TextInput
							placeholder="Buscar"
							onSubmitEditing={(event) => {
								let text = event.nativeEvent.text;
								searchOrder(text);
							}}
							onChangeText={(text) => setSearchWord(text)}
							style={{
								backgroundColor: '#fff',
								paddingHorizontal: 10,
								height: 40,
								borderRadius: 5,
								flexGrow: 1,
							}}
						/>
						<TouchableOpacity
							onPress={() => searchOrder(searchWord)}
							style={{ padding: 10 }}
						>
							<FontAwesome5 name="search" size={20} color="#095169" />
						</TouchableOpacity>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', width: '20%', left: 20 }}>
						<TouchableHighlight
							onPress={toggleMenu}
							style={styles.circle}
							underlayColor="#ddd"
						>
							<Text style={styles.usernameText}>{user?.name[0].toUpperCase()}{user?.lastName[0].toUpperCase()}</Text>
						</TouchableHighlight>
					</View>
				</View>
			</View>
			<View style={[styles.containerButtons, { padding: 0, flex: 1, position: 'relative', top: 0 }]}>
				<View style={[styles.row, { padding: 10, marginBottom: -40, justifyContent: 'space-between' }]}>
					<View style={{ width: '45%', paddingRight: 10, zIndex: openCompany ? 100 : 0 }}>
						<DropDownPicker
							defaultValue={ordersState}
							containerStyle={{ height: 50, numberOfLines: 1 }}
							style={{ backgroundColor: '#fafafa', borderColor: '#808080', borderWidth: 1 }}
							labelStyle={{ fontSize: 13 }}
							labelProps={{
								numberOfLines: 1
							}}
							itemStyle={{
								justifyContent: 'flex-start',
							}}
							placeholder="Empresa"
							dropDownStyle={{ backgroundColor: '#fafafa', borderColor: '#808080', borderWidth: 1 }}
							open={openCompany}
							value={valueCompany}
							items={company}
							setOpen={setOpenCompany}
							setValue={setValueCompany}
							setItems={setCompany}
						/>
					</View>
					<View style={{ width: '37%', paddingRight: 10, zIndex: 100, height: 1 }}>
						<DropDownPicker
							defaultValue={value}
							containerStyle={{ height: 40 }}
							style={{ backgroundColor: '#fafafa', borderColor: '#808080', borderWidth: 1, zIndex: 100 }}
							itemStyle={{
								justifyContent: 'flex-start',
								height: 1
							}}
							placeholder="Espera"
							dropDownStyle={{ backgroundColor: '#fafafa', borderColor: '#808080', borderWidth: 1, zIndex: 100 }}
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
						/>
					</View>
					<View style={{ width: '15%', paddingBottom: 70, flexDirection: 'row', alignItems: 'center', zIndex: 100 }}>
						<TextInput
							placeholder={`#`}
							value={takeText}
							onSubmitEditing={(event) => {
								let text = event.nativeEvent.text;
								let num = Number(text);
								if (num > 2000) {
									num = 2000;
								}
								setTake(num);
							}}
							onChange={(event) => {
								let text = event.nativeEvent.text;
								let num = Number(text);
								if (num > 2000) {
									text = '2000';
								}
								setTakeText(text);
							}}
							keyboardType='number-pad'
							defaultValue={takeText}
							maxLength={4} // Añade esta línea para limitar la entrada a 4 dígitos (hasta 9999)
							style={{
								backgroundColor: '#fff',
								paddingHorizontal: 10,
								height: 40,
								borderRadius: 5,
								flexGrow: 1,
							}}
						/>

						<Text style={[styles.buttonText, { position: "absolute", marginLeft: 10, top: 40 }]}>Cantidad</Text>
					</View>
				</View>
				<View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 5, position: 'relative', top: -20 }]}>
					<View style={[styles.row, { flex: 1 }]}>
						<TouchableOpacity onPress={() => { retrieveData(); }} style={{ paddingHorizontal: 5, marginRight: 10 }}>
							<FontAwesome5 name="sync" size={26} color="#095169" />
						</TouchableOpacity>
						<TouchableOpacity onPress={handleChangeOrderQuery} style={{ paddingHorizontal: 5 }}>
							<FontAwesome5 name={orderQuery ? "sort-up" : "sort-down"} size={26} color="#095169" />
						</TouchableOpacity>
					</View>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<Text numberOfLines={1}>Pagina: {page}</Text>
					</View>
					<View style={[styles.row, { flex: 1, justifyContent: 'flex-end', zIndex: 100 }]}>
						<TouchableOpacity onPress={(e) => { e.preventDefault(); handlePagination("previous") }} style={{ paddingHorizontal: 5 }}>
							<AntDesign name="left" size={26} color="#444444" />
						</TouchableOpacity>
						<TouchableOpacity onPress={(e) => { e.preventDefault(); handlePagination("next") }} style={{ paddingHorizontal: 5 }}>
							<AntDesign name="right" size={26} color="#444444" />
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ flex: 1, width: "96%", justifyContent: 'center', alignItems: 'center' }}>
					{(loading === true) && (
						<>
							<Animated.View style={{ transform: [{ rotate: spin }] }}>
								<FontAwesome5 name="spinner" size={40} color="#0a827f" />
							</Animated.View>
						</>
					)}
					{(loading === false) && (
						<>
							{(orders.length === 0) && (
								<Text numberOfLines={5}>No hay ordenes</Text>
							)}
							{(orders.length !== 0) && (
								<>
									{ordersSelected.length > 0 && (
										<View style={{ width: "96%" }}>
											<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#c9c9c9', borderRadius: 5, marginBottom: 10 }}>
												<Text >Ordenes seleccionadas: {ordersSelected.length}</Text>
												<View style={{ flexDirection: 'row', alignItems: 'center' }}>
													<TouchableOpacity onPress={() => handleDeleteOrders()} style={{ backgroundColor: '#f44336', padding: 5, borderRadius: 5, marginRight: 5 }}>
														<FontAwesome5 name="trash" size={20} color="#fff" />
													</TouchableOpacity>
													<TouchableOpacity onPress={handleSelectAllOrders} style={{ backgroundColor: '#095169', padding: 5, borderRadius: 5 }}>
														{allSelected ? (
															<FontAwesome5 name="check-square" size={20} color="#fff" />
														) : (
															<FontAwesome5 name="square" size={20} color="#fff" />
														)}
													</TouchableOpacity>
												</View>
											</View>
											{ordersState === "EsperaSalida" && (
												<WaitItem
													retrieveData={retrieveData}
													setStateOrders={setStateOrders}
													orders={ordersSelected}
													loading={loading}
													setLoading={setLoading}
													pushNotification={pushNotification}
												/>
											)}
											{ordersState === "Aceptada" && (
												<AgreeItem
													setStateOrders={setStateOrders}
													orders={ordersSelected}
													multiSelect={true}
													loading={loading}
													setLoading={setLoading}
													pushNotification={pushNotification}
												/>
											)}
										</View>
									)}
									<FlatList
										style={{ width: '96%' }}
										data={orders}
										initialNumToRender={4}
										maxToRenderPerBatch={3}
										windowSize={3}
										renderItem={({ item, index }) => (
											<RenderItem
												key={index}
												order={item}
												ordersState={ordersState}
												setStateOrders={setStateOrders}
												retrieveData={retrieveData}
												navigation={props.navigation}
												handleSelectOrder={handleSelectOrder}
												handleUnSelectedOrder={handleUnSelectedOrder}
												ordersSelected={ordersSelected}
												pushNotification={pushNotification}
											/>
										)}
										keyExtractor={(item, index) => index.toString()}
										onEndReached={loadMoreOrders}
										onEndReachedThreshold={0.5}
									/>
									{loadingPagination === true && (
										<>
											<Text style={[styles.loadingText]} >Cargando...</Text>
										</>
									)}
								</>
							)}
						</>
					)}
				</View>

			</View>
		</SafeAreaView >
	);
};


export default OrdersScreen;