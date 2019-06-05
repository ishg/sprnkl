import React from 'react'
import {
  View,
  StyleSheet,
  Button,
  Platform,
  Text,
  TextInput, 
  ActivityIndicator
} from 'react-native'
import Colors from '../constants/Colors'
import Loader from '../components/Loader'
import { AsyncStorage } from "react-native"
import axios from 'axios'

const urlRegex = RegExp('^(http|https):\/\/(([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])\.)*([a-z0-9]|[a-z0-9][a-z0-9\-]*[a-z0-9])(:[0-9]+)?$')

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };
  constructor (props) {
    super(props)
    this.state = {
      url: '',
      loading: false,
      formChanged: false,
      formValid: true,
      placeholder: 'http://127.0.0.1:8080',
    }
  }
  async componentDidMount() {
    try {
      const value = await AsyncStorage.getItem('HOST');
      if (value !== null) {
        // We have data!!
        this.setState({
          url: value,
          loading: false
        })
      } 
     } catch (error) {
       // Error retrieving data
       console.log('Could not get anything')
     }
  }

  _getInvalidFormStyle () {
    style = {}
    if (!this.state.formValid) {
      style['borderColor'] = Colors.red
    }
    return style
  }

  _validateURL (text) {
    if (urlRegex.test(text)) {
      this.setState({formValid: true})
    } else {
      this.setState({formValid: false})
    }
  }

  async _updateURL(url) {
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
    return (
      <View style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingBottom: 20,
        borderWidth: 1,
        borderColor: 'transparent',
        borderBottomColor: Colors.grayLight,
      }}>
        <Loader loading={this.state.loading} />
        <View style={{height: 50, justifyContent: 'center', paddingLeft: 20}}>
          <Text style={{fontWeight: 'bold'}}>Update your Raspberry Pi's IP address:</Text>
        </View>
        <View style={{flexDirection: 'row', height: 50,alignItems: 'center', justifyContent: 'center', paddingLeft: 20, paddingRight: 20}}>
          <TextInput
            autoCorrect={false}
            autoCapitalize={'none'}
            style={[styles.formInput, this._getInvalidFormStyle()]}
            onChangeText={(url) => {
              this._validateURL(url)
              this.setState({url})
              this.setState({formChanged: true})
            }}
            value={this.state.url}
            placeholder={this.state.placeholder}
            underlineColorAndroid='transparent'
            />
          
          <View style={{}}>
            <Button
              disabled={
                this.state.formChanged ? !this.state.formValid : true
              }
              onPress={() => this._updateURL()}
              title='Update'
              color={Colors.blue}
            />
          </View>
        </View>
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
  formInput: {
    fontFamily: 'space-mono',
    flex: 2,
    height: 50,
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
    borderWidth: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 10,
    borderRadius: 10
  }
})
