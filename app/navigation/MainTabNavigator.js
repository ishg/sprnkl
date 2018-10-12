import React from 'react'
import { Platform } from 'react-native'
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'
import HomeScreen from '../screens/HomeScreen'
import SettingsScreen from '../screens/SettingsScreen'
import EditScreen from '../screens/EditScreen'

import Colors from '../constants/Colors'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Edit: EditScreen
}, {
  initalRouteName: 'Edit',
  mode: 'modal'
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarOptions: {
    activeTintColor: Colors.black,
    inactiveTintColor: Colors.grayLight
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'home'}
    />
  )
}

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen
})

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarOptions: {
    activeTintColor: Colors.black,
    inactiveTintColor: Colors.grayLight
  },
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={'settings'}
    />
  )
}

export default createBottomTabNavigator({
  HomeStack,
  SettingsStack
})
