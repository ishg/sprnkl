import React from 'react'
import { createSwitchNavigator, createStackNavigator } from 'react-navigation'

import MainTabNavigator from './MainTabNavigator'

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import LoginScreen from '../screens/LoginScreen'

const AuthStack = createStackNavigator({ Login: LoginScreen })

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Main: MainTabNavigator,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
)
