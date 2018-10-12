import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { WebBrowser } from 'expo'
import { Feather } from '@expo/vector-icons'
import Swiper from 'react-native-swiper'

import Zone from '../components/Zone'
import CircleButtonIcon from '../components/CircleButtonIcon'
import { MonoText } from '../components/StyledText'

import Colors from '../constants/Colors'

const zones = [
  {pin: 11, meta: 'zone 1-4', title: 'Back Tree', status: 0},
  {pin: 9, meta: 'zone 2-6', title: 'Back Garden', status: 1},
  {pin: 10, meta: 'zone 3-3', title: 'Vegetable Garden', status: 0},
  // {pin: 24, meta: 'zone 4-5', title: ' (broken)', status: 0},
  {pin: 23, meta: 'zone 5-2', title: 'Drip Irrigation', status: 0},
  // {pin: 4, meta: 'zone 6-1', title: ' (overflow)', status: 0},
  {pin: 14, meta: 'zone 9', title: 'Front Right Lawn', status: 0},
  {pin: 18, meta: 'zone 10 ', title: 'Front Left Lawn', status: 0},
  {pin: 15, meta: 'zone 11 ', title: 'Front Kyaaris', status: 0},
  {pin: 3, meta: 'zone 12 ', title: 'Front Kyaarislasd', status: 0}
]

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props)
    this.state = {
      zones: zones,
      currentZone: zones[0]
    }
  }
  _updateSelectedZone(index) {
    this.setState({
      currentZone: this.state.zones[index]
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.welcomeImage}
          />
        </View>

        <Swiper 
          style={styles.wrapper} 
          showsButtons
          loop={false}
          showsPagination={false}
          onIndexChanged={(index) => this._updateSelectedZone(index)}>
          {
            this.state.zones.map((item, i) => <Zone
              key={i}
              zone={item}
            />)
          }
        </Swiper>

        <View style={styles.controller}>
          <CircleButtonIcon 
            color={this.state.currentZone.status === 0 ? Colors.grayLight : Colors.greenPrimary}
            icon={'power'} 
            onPress={()=>console.log('droplet')} />
          <CircleButtonIcon color={this.state.currentZone.scheduled === 0 ? Colors.grayLight : Colors.greenPrimary} icon='clock' onPress={()=>console.log('schedule')} />
          <CircleButtonIcon icon='edit' onPress={()=>this.props.navigation.navigate('Edit')} />
          <CircleButtonIcon icon='plus' onPress={()=>this.props.navigation.navigate('Edit')} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    justifyContent: 'flex-start',
    alignContent: 'center'
  },
  contentContainer: {
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginLeft: -10,
  },
  wrapper: {
  },
  controller: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
