
import { StyleSheet } from 'react-native';


const styles = StyleSheet.create({
	card: {
		flex: 1,
		backgroundColor: '#f4f3ef',
		width: '100%',
	},
	heading: {
		fontSize: 18,
		fontWeight: 'bold',
		margin: '2%',
		marginTop: "3%",
		color: 'black',
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	goBackButton: {
		fontSize: 30,
		marginLeft: 10,
		backgroundColor: '#f4f3ef',
	},
	form: {
		flex: 1,
		justifyContent: 'space-between',
	},
	eightyWidthStyle: {
		marginTop: 20,
		width: '30%',
		height: 50,
	},
	inputs: {
		width: '100%',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		width: '80%',
		paddingVertical: 10,
		fontSize: 16,
		height: "100%",
		bottom: 0,
	},
	button: {
		width: '80%',
		backgroundColor: 'black',
		height: 40,
		borderRadius: 50,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 5,
	},
	buttonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '400'
	},
	buttonAlt: {
		width: '80%',
		borderWidth: 2,
		height: 40,
		borderRadius: 50,
		borderColor: '#0a827f',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: "10%",
	},
	buttonAltText: {
		color: 'black',
		fontSize: 16,
		fontWeight: '400',
	},
	message: {
		fontSize: 20,
		fontWeight: 'bold',
		height: 40,
		marginTop: '3%',
	},
	uploadImage: {
		position: 'relative',
		width: '70%',
		height: 300,
		borderRadius: 10,
		marginHorizontal: '15%',
		marginTop: '10%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	emptyImage: {
		position: 'relative',
		width: '70%',
		height: 300,
		backgroundColor: 'grey',
		borderRadius: 10,
		marginHorizontal: '15%',
		marginTop: '10%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 10,
	},
	smallButton: {
		borderColor: '#095169',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 5,
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 10,
		backgroundColor: 'transparent',
	},
	inputContainer: {
		marginTop: 20,
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: '#D9D9D9',
		borderWidth: 1,
		borderRadius: 5,
		paddingLeft: 5,
		paddingRight: 5,
	},
	clearIcon: {
		marginLeft: -30,
	},
});



export default styles;