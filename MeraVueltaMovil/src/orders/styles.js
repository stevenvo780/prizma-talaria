
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 15,
		backgroundColor: '#f4f3ef',
	},
	usernameText: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	tabText: {
		fontSize: 18,
		color: 'gray'
	},
	containerButtons: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f4f3ef',
	},
	row: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	pickupButtons: {
		padding: 5,
		paddingTop: 10,
		width: "100%",
		height: 50,
	},
	boxButtons: {
		padding: 5,
		width: "50%",
		height: 50,
	},
	container: {
		flex: 1,
		marginTop: 0,
	},
	fixToText: {
		paddingTop: 5,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	item: {
		backgroundColor: '#f7f7f7',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		borderRadius: 10,
	},
	title: {
		fontSize: 14,
	},
	titleCard: {
		fontSize: 18,
		fontWeight: 'bold',
		alignItems: 'center',
		textAlign: 'center',
	},
	description: {
		fontSize: 12,
		color: '#4c4c4c',
	},
	button: {
		position: 'relative',
		width: 100,
	},
	itemContainer: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 3,
		flex: 1,
		backgroundColor: '#f7f7f7',
		padding: 20,
		paddingBottom: 5,
		marginVertical: 8,
		marginHorizontal: 16,
		borderRadius: 10,
	},
	item: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	checkBox: {
		position: 'absolute',
		top: -25,
		right: -20,
	},
	buttonText: {
		fontSize: 10,
		color: '#095169',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	loadingText: {
		fontSize: 20,
		color: '#095169',
	},
	circle: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#0a827f',
	},
	usernameText: {
		fontSize: 20,
		color: '#fff',
	},
	menu: {
		position: 'absolute',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#eee',
		borderRadius: 5,
		padding: 10,
		marginTop: 5,
		right: 10,
		top: 70,
		zIndex: 999,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 3,
		justifyContent: 'flex-end',
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
		paddingVertical: 5,
		marginVertical: 5,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 15,
	},
});


export default styles;