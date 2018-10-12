import React from 'react'
import {
  View,
  StyleSheet,
  Platform,
  TextInput, 
  ActivityIndicator,
  TouchableOpacity,
  Button,
  Image, 
  Dimensions, 
  Alert
} from 'react-native'

import { ImagePicker, Permissions } from 'expo'
import { Feather } from '@expo/vector-icons'

import Colors from '../constants/Colors'
import Loader from '../components/Loader'
import StyledText from '../components/StyledText'

import Layout from '../constants/Layout'
import { AsyncStorage } from 'react-native'
import axios from 'axios'

export default class EditScreen extends React.Component {
  static navigationOptions = {
    title: 'Edit Zone',
  };
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      loading: false,
      placeholder: 'Zone Name',
      formChanged: false,
      image: null,
      WIDTH: Layout.window.width - 44,
      HEIGHT: Layout.window.height
    }
  }

  _requestPermission = async (type) => {
    const { status } = await Permissions.askAsync(type)
    if (status !== 'granted') {
      Alert.alert('Access Required',
        'Access to your Photo Library is required for this feature', [
        { text: 'OK', onPress: () => console.log('cancelled')}
      ], {
        cancellable: false
      })
    }
  }

  _takeImage = async () => {

    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    if (status !== 'granted') {
      Alert.alert('Access Required',
        'Access to your Camera is required for this feature', [
        { text: 'OK', onPress: () => console.log('cancelled')}
      ], {
        cancellable: false
      })
      return
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3,3],
      quality: 0.5
    })

    console.log(result)

    if (!result.cancelled) {
      this.setState({ image: result.uri })
    }

  }

  _pickImage = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status !== 'granted') {
      Alert.alert('Access Required',
        'Access to your Photo Library is required for this feature', [
        { text: 'OK', onPress: () => console.log('cancelled')}
      ], {
        cancellable: false
      })
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3,3],
      quality: 0.5
    })

    console.log(result)

    if (!result.cancelled) {
      this.setState({ image: result.uri })
    }
  }

  _getInvalidFormStyle () {
    style = {}
    if (!this.state.formValid) {
      style['borderColor'] = Colors.red
    }
    return style
  }

  _validateTitle (text) {
    this.setState({
      formValid: (text.length !== 0)
    })
  }

  async _updateZone(url) {
    if (this.state.formValid) {
      console.log('updating URL')
      console.log(this.state.url)
      this.setState({loading: true})
      await AsyncStorage.setItem('HOST', this.state.url);
      setTimeout(() => { 
        this.setState({loading: false,formChanged: false})
      }, 1000)
    } else {
      console.log('form was invalid')
    }
  }

  render() {
    console.log(this._getInvalidFormStyle())
    return (
      <View style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingBottom: 20,
        paddingTop: 20
      }}>
        <Loader loading={this.state.loading} />
        <View style={{flexDirection: 'row', height: 50,alignItems: 'center', justifyContent: 'center'}}>
          <TextInput
            textAlign={'center'}
            style={[styles.formInput, this._getInvalidFormStyle()]}
            onChangeText={(title) => {
              this._validateTitle(title)
              this.setState({title})
              this.setState({formChanged: true})
            }}
            value={this.state.title}
            placeholder={this.state.placeholder}
            underlineColorAndroid='transparent'
            />
        </View>
        <View style={{margin: 20, alignItems: 'stretch'}}>
          {
            this.state.image ?
            <Image source={{ uri: this.state.image }} 
              style={{
                borderRadius: 10, 
                height: this.state.WIDTH, 
                width: this.state.WIDTH 
              }} /> :
            <View style={{
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderColor: Colors.grayLight,
              borderRadius: 10,
              borderStyle: 'dashed',
              justifyContent: 'center',
              alignItems: 'center',
              width: this.state.WIDTH,
              height: this.state.WIDTH
            }}>
              <Feather name='image' size={50} color={Colors.grayLight} />
            </View>  
          }
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20
        }}>
          <TouchableOpacity style={{flex: 1}} onPress={this._pickImage}>
            <View style={[styles.button, {marginRight: 10}]}>
              <Feather name='grid' size={30} color={Colors.grayLight} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1}} onPress={this._takeImage}>
            <View style={[styles.button, {marginLeft: 10}]}>
              <Feather name='camera' size={30} color={Colors.grayLight} />
            </View>
          </TouchableOpacity>  
        </View>
        <TouchableOpacity 
          style={{
            margin: 20,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.greenPrimary,
            borderRadius: 10,
          }}
          onPress={() => console.log('saving zone')}>
          <StyledText style={{fontWeight: 'bold', fontSize: 20, color: Colors.white}}>SAVE</StyledText>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({    
  inputWrapper: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'flex-start',
  },
  button: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      }
    })
  },
  formInput: {
    flex: 2,
    height: 60,
    fontSize: 20,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6
      },
      android: {
        elevation: 2
      }
    }), 
    backgroundColor: '#fff',
    padding: 10,
    margin: 20,
    borderRadius: 10
  }
})
