import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View >
        <Text>You have (undefined) Orders.</Text>
        <Button
          title="Add some orders"
          onPress={() =>
            this.props.navigation.navigate('Ordenes')
          }
        />
      </View>
    );
  }
}