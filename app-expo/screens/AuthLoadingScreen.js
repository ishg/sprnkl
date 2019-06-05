import React from 'react'
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'

import firebase from '../database'

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const vm = this
    firebase.auth().onAuthStateChanged(function(user) {
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      vm.props.navigation.navigate(user ? 'Main' : 'Auth')
    }, function(error) {
      console.log(error)
    })
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={{flex: 1}}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    )
  }
}