import React from 'react'
import {
  Image,
  StyleSheet,
  View,
  Button,
  TextInput,
  Platform,
  TouchableOpacity
} from 'react-native'
import Loader from '../components/Loader'
import StyledText from '../components/StyledText'
import Colors from '../constants/Colors'
import firebase from 'firebase'

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null  
  }
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      email: '',
      password: '',
    }
  }

  _signInAsync = async () => {
    const vm = this
    this.state.loading = true
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((user) => {
      setTimeout(() => { 
        vm.props.navigation.navigate('Main')  
      }, 2000)
    }, (err) => {
      console.log(err)
    })
  }

  // Add validation for email and password

  render() {
    return (
      <View style={styles.container}>
        <Loader loading={this.state.loading} />

        <View style={styles.card}>

          <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
            <StyledText style={{fontFamily: 'nunito-bold', fontSize: 40, color: Colors.greenPrimary}}>
              sprnkl
            </StyledText>
            <Image
              source={require('../assets/images/logo.png')}
              style={{
                width: 85,
                height: 85,
                resizeMode: 'contain',
              }}
            />
          </View>

          <StyledText style={{marginTop: 40, marginBottom: 10, fontSize: 24, color: Colors.accentDark}}>
            Welcome,
          </StyledText>
          <StyledText style={{marginBottom: 40, fontSize: 24, color: Colors.accentDark}}>
            sign in to get started
          </StyledText>
          
          <View style={{height: 50, marginBottom: 20}}>
            <TextInput
              autoCorrect={false}
              autoCapitalize={'none'}
              style={styles.formInput}
              onChangeText={(email) => {
                this.setState({email})
              }}
              value={this.state.email}
              placeholder={'Email'}
              underlineColorAndroid='transparent'
            />
          </View>
          <View style={{height: 50, marginBottom: 20}}>
            <TextInput
              autoCorrect={false}
              autoCapitalize={'none'}
              secureTextEntry
              style={styles.formInput}
              onChangeText={(password) => {
                this.setState({password})
              }}
              value={this.state.password}
              placeholder={'Password'}
              underlineColorAndroid='transparent'
            />
          </View>
          <TouchableOpacity onPress={this._signInAsync}>
            <View style={{backgroundColor: Colors.greenPrimary, justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: 50}}>
              <StyledText style={{color: Colors.white, fontSize: 18, fontFamily: 'nunito-bold'}}>Sign in</StyledText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: 40,
    backgroundColor: Colors.yellow
  },
  card: {
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
    backgroundColor: Colors.white, 
    borderRadius: 10,
    padding: 20
  },
  formInput: {
    fontFamily: 'nunito',
    fontSize: 18,
    flex: 2,
    height: 50,
    borderColor: 'transparent',
    borderWidth: 1,
    backgroundColor: Colors.accentLight,
    color: Colors.accentDark,
    padding: 10,
    borderRadius: 10
  }
})
