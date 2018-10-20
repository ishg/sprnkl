import React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ScrollView
} from 'react-native'
import { WebBrowser } from 'expo'
import { Feather } from '@expo/vector-icons'
import Swiper from 'react-native-swiper'
import StyledText from '../components/StyledText'
import Loader from '../components/Loader'

import Zone from '../components/Zone'
import CircleButtonIcon from '../components/CircleButtonIcon'
import { MonoText } from '../components/StyledText'

import Colors from '../constants/Colors'
import firebase from 'firebase'

const ZONES = [
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
      loading: true,
      dataLoaded: false,
      zones: [],
      currentZone: {}
    }
  }

  async componentDidMount() {

    let user = firebase.auth().currentUser;
     // time to remove 'bar'!
     // this is the correct way to change an array
     // list.splice(1, 1);
     // ref.set(list);

    if (user) {
      await firebase.database().ref('users/' + user.uid).on('value', (snapshot) => {
        let zones = snapshot.val().zones
        if (zones) {
          this.setState({
            dataLoaded: true,
            zones: zones,
            currentZone: zones[0] 
          })
          this.props.navigation.setParams({
            headerRight: (<TouchableOpacity style={{marginRight: 20}} onPress={()=>navigation.navigate('Add')}>
            <Feather name='plus' size={30} color={Colors.greenPrimary} />
          </TouchableOpacity>)
          })
          this.setState({loading: false})
        } else {
          this.setState({
            dataLoaded: true,
            zones: [],
            currentZone: {},
            loading: false,
          })
        }
      })
    } else {
      console.log('No user is signed in.')
    }
    //this.setState({dataLoaded: true, loading: false, zones: ZONES, currentZone: ZONES[0]})
  }

  render() {
    if (this.state.dataLoaded) {
      return (
        <View style={styles.container}>
          <Loader loading={this.state.loading} />
          {
            this.state.zones.length > 0 ?
            <ScrollView>
              {
                this.state.zones.map((item, i) => <Zone key={i} zone={item} navigation={this.props.navigation} /> )
              }
            </ScrollView>
            :
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
      )
    } else {
      return null
    }
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignContent: 'center',
    backgroundColor: Colors.yellow
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  wrapper: {
    backgroundColor: 'red'
  },
  controller: {
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
