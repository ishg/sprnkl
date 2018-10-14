import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  AsyncStorage
} from 'react-native'
import { WebBrowser } from 'expo'
import { Feather } from '@expo/vector-icons'
import Swiper from 'react-native-swiper'
import StyledText from '../components/StyledText'

import Zone from '../components/Zone'
import CircleButtonIcon from '../components/CircleButtonIcon'
import { MonoText } from '../components/StyledText'

import Colors from '../constants/Colors'

const zones = [
  {url: '', schedule: {enabled: true, freq: 'daily', days: [], 'startTime': '', duration: 10}, pin: 11, meta: 'zone 1-4', title: 'Back Tree', status: 0},
  {url: '', schedule: {enabled: false, freq: 'weekly', days: [], 'startTime': '', duration: 10}, pin: 9, meta: 'zone 2-6', title: 'Back Garden', status: 1},
  {url: '', schedule: {enabled: true, freq: 'daily', days: [], 'startTime': '', duration: 10}, pin: 10, meta: 'zone 3-3', title: 'Vegetable Garden', status: 0},
  {url: '', schedule: {enabled: true, freq: 'daily', days: [], 'startTime': '', duration: 10}, pin: 23, meta: 'zone 5-2', title: 'Drip Irrigation', status: 0},
  {url: '', schedule: {enabled: true, freq: 'daily', days: [], 'startTime': '', duration: 10}, pin: 14, meta: 'zone 9', title: 'Front Right Lawn', status: 0},
  {url: '', schedule: {enabled: true, freq: 'daily', days: [], 'startTime': '', duration: 10}, pin: 18, meta: 'zone 10 ', title: 'Front Left Lawn', status: 0},
  {url: '', schedule: {enabled: true, freq: 'daily', days: [], 'startTime': '', duration: 10}, pin: 15, meta: 'zone 11 ', title: 'Front Kyaaris', status: 0},
  {url: '', schedule: {enabled: true, freq: 'daily', days: [], 'startTime': '', duration: 10}, pin: 3, meta: 'zone 12 ', title: 'Front Kyaarislasd', status: 0}
]

export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {
        height: 80,
        borderBottomWidth: 0,
        shadowColor: 'transparent'
      },
      headerTitle: (
        <Image
          source={require('../assets/images/logo.png')}
          style={{width: 100,
            height: 80,
            resizeMode: 'contain',
            marginLeft: -10,
          }}
        />),
      headerRight: null,  
    }
  };
  constructor(props) {
    super(props)
    this.state = {
      zones: [],
      currentZone: {}
    }
  }

  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem('ZONES');
      if (value !== null) {
        // We have data!!
        valueJSON = JSON.parse(value)
        zones = valueJSON.zones
        console.log(zones)
        this.setState({
          zones: zones,
          currentZone: zones[0] 
        })
        this.props.navigation.setParams({
          headerRight: (<TouchableOpacity style={{marginRight: 20}} onPress={()=>navigation.navigate('Add')}>
          <Feather name='plus' size={30} color={Colors.greenPrimary} />
        </TouchableOpacity>)
        })
      } else {
        console.log('No data found')
        this.setState({
          zones: [],
          currentZone: {}
        })
      }
    } catch (error) {
      console.log('Error retrieving data')
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
        {
          this.state.zones.length > 0 ?
          <View>
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
              <CircleButtonIcon color={this.state.currentZone.schedule.enabled ? Colors.greenPrimary : Colors.grayLight} icon='clock' onPress={()=>console.log('schedule')} />
              <CircleButtonIcon icon='edit' onPress={()=>this.props.navigation.navigate('Details', {
                  mode: 'edit',
                  zone: this.state.currentZone
                })} />
            </View>
          </View> :
          <View style={{padding: 40, flex: 1, alignItems: 'center'}}>
            <StyledText style={{fontFamily: 'rubik-bold', fontSize: 30, color: Colors.accentDark, textAlign: 'center'}}>
              Welcome to Sprnkl!
            </StyledText>
            <StyledText style={{marginTop: 40, marginBottom: 40, fontSize: 24, color: Colors.accentDark, textAlign: 'center'}}>
              Let's get started by adding your first Sprnkl zone.
            </StyledText>
            <CircleButtonIcon size={40} icon='plus' color={Colors.greenPrimary} onPress={()=>this.props.navigation.navigate('Details', {mode: 'new'})} />
          </View>
        }
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
    justifyContent: 'center',
    flexDirection: 'row',
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
