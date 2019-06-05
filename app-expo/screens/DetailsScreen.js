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
  Alert,
  ScrollView,
  Slider,
  Switch
} from 'react-native'

import moment from 'moment'
import Picker from 'react-native-modal-datetime-picker'

import { ImagePicker, Permissions } from 'expo'
import { Feather } from '@expo/vector-icons'

import Colors from '../constants/Colors'
import Loader from '../components/Loader'
import StyledText from '../components/StyledText'

import Layout from '../constants/Layout'
import { AsyncStorage } from 'react-native'


// TODO
// 1. Add Pin input
// 2. Save and navigate back
// 3. Reload Spinner

export default class DetailsScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerTitle: navigation.getParam('mode') === 'new' ? 'Add Zone' : 'Edit Zone'
    }
  };
  constructor (props) {
    super(props)
    let zone
    if (this.props.navigation.getParam('mode') === 'new') {
      // Empty zone object
      zone = {
        imageURL: '',
        title: '',
        pin: 0,
        running: false,
        schedule: {
          enabled: false,
          freq: 'daily',
          days: [],
          startTime: moment().format('hh:mm a'),
          duration: 10
        }
      }
    } else {
      // Zone object was passed in
      zone = this.props.navigation.getParam('zone')
    }

    this.state = {
      weekdays: ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'],
      pickerVisible: false,
      loading: false,
      placeholder: 'Zone Name',
      formTitleInvalid: false,
      formDaysInvalid: false,
      formChanged: false,
      image: zone.url ? '' : '',
      WIDTH: Layout.window.width,
      HEIGHT: Layout.window.height,
      title: zone['title'],
      running: zone['status'],
      scheduled: zone.schedule.enabled,
      freq: zone.schedule.freq,
      days: zone.schedule.days ? zone.schedule.days : [],
      pin: zone.pin,
      startTime: zone.schedule.startTime.length > 0 ? zone.schedule.startTime : moment().format('hh:mm a'),
      duration: zone.schedule.duration
    }
  }

  _showDateTimePicker = () => this.setState({ pickerVisible: true });

  _hideDateTimePicker = () => this.setState({ pickerVisible: false });

  _handleDatePicked = (date) => {
    this.setState({startTime: moment.utc(date).local().format('hh:mm a')})
    this._hideDateTimePicker();
  };

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

    if (!result.cancelled) {
      this.setState({ image: result.uri })
    }
  }

  _dayIsChosen (day) {
    return this.state.days.includes(day)
  }

  _toggleDays = (day) => {
    arr = this.state.days
    if (arr.includes(day)) {
      arr.splice(arr.indexOf(day), 1)
    } else {
      arr.push(day)
    }
    this.setState({days: arr})
  }

  _toggleSchedule = (value) => {
    this.setState({scheduled: value})
    console.log(this.state)
  }

  _toggleFreq = () => {
    if (this.state.freq === 'weekly') {
      this.setState({freq: 'daily'})
    } else {
      this.setState({freq: 'weekly'})
    }
  }

  async _saveZone() {
    console.log(this.state)
    // Validate title and image

    if (this.state.title.length === 0) {
      this.setState({formTitleInvalid: true})
      return
    } else {
      this.setState({formTitleInvalid: false})
    }

    if (this.state.freq === 'weekly' && this.state.days.length === 0) {
      this.setState({formDaysInvalid: true})
      return
    } else {
      this.setState({formDaysInvalid: false})
    }

    this.setState({loading: true})
    // await AsyncStorage.setItem('HOST', this.state.url);
    setTimeout(() => { 
      this.setState({loading: false,formChanged: false})
    }, 1000)
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 20,
          flexDirection: 'column'
        }}>
          <Loader loading={this.state.loading} />
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start'
            }}>
            <TouchableOpacity onPress={this._pickImage} style={{marginLeft: 20, marginRight: 20}}>
              {
                this.state.image ?
                <Image source={{ uri: this.state.image }} 
                  style={{
                    borderRadius: 10, 
                    height: 100, 
                    width: 100
                  }} /> :
                <View style={{
                  backgroundColor: 'transparent',
                  borderWidth: 2,
                  borderColor: Colors.grayLight,
                  borderRadius: 10,
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 100,
                  height: 100
                }}>
                  <Feather name='image' size={50} color={Colors.grayLight} />
                </View>  
              }
            </TouchableOpacity>
            <View style={{
              flex: 1,
              flexDirection: 'column', 
              justifyContent: 'flex-start',
              }}>
              <TextInput
                style={[styles.formInput, this.state.formTitleInvalid && {'borderColor': Colors.danger, borderWidth: 1}]}
                onChangeText={(title) => {
                  this.setState({title})
                  this.setState({formChanged: true})
                }}
                value={this.state.title}
                placeholder={this.state.placeholder}
                underlineColorAndroid='transparent'
                />
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 40,
                marginTop: 15,
                marginRight: 20,
              }}>
                <StyledText style={{ paddingLeft: 10, fontSize: 16, marginRight: 20,color: Colors.grayDark}}>Schedule On/Off</StyledText>
                <Switch
                  onTintColor={Colors.greenPrimary}
                  thumbTintColor={Colors.white}
                  onValueChange={this._toggleSchedule}
                  value={this.state.scheduled}
                />
              </View>
            </View>
          </View>
          {
            this.state.scheduled &&
            <View>
              <Picker
                mode={'time'}
                isVisible={this.state.pickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
              />
              <View style={{
                flexDirection: 'column', 
                justifyContent: 'flex-start', 
                alignItems: 'stretch',
                margin: 20,
                borderRadius: 10,
                overflow: 'hidden',
                backgroundColor: Colors.white
                }}>

                <View style={{
                  height: 45,
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  }}>
                  <StyledText>Frequency</StyledText>
                  <TouchableOpacity onPress={this._toggleFreq} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <StyledText style={{fontFamily: 'rubik-bold', color: Colors.greenPrimary}}>{this.state.freq.charAt(0).toUpperCase() + this.state.freq.substr(1)}</StyledText>
                    <Feather name='chevron-right' size={20} color={Colors.grayDark} />
                  </TouchableOpacity>
                </View>

                {this.state.freq === 'weekly' && 
                  <View style={{
                    padding: 10,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    borderWidth: 1,
                    borderColor: 'transparent',
                    borderTopColor: Colors.accentLight,
                    }}>
                    <StyledText style={this.state.formDaysInvalid && {color: Colors.danger}}>Choose Days
                    {
                      this.state.formDaysInvalid && 
                      <View style={{paddingLeft: 5}}>
                        <Feather name='alert-circle' size={12} color={Colors.danger} />
                      </View>

                    }
                    </StyledText>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginTop: 10}}>
                      {
                        this.state.weekdays.map((day, i) => 
                          <TouchableOpacity key={i} onPress={() => this._toggleDays(day)}>
                            <View style={{
                              height: 40,
                              width: 40,
                              borderRadius: 100,
                              backgroundColor: this._dayIsChosen(day) ? Colors.greenPrimary: Colors.accentLight,
                              margin: 3,
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <StyledText style={{color: this._dayIsChosen(day) ? Colors.white: Colors.greyDark}}>{day}</StyledText>
                            </View>
                          </TouchableOpacity>
                        )
                      }
                    </View>
                  </View>
                }

                <View style={{
                  height: 45,
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'transparent',
                  borderTopColor: Colors.accentLight,
                  }}>
                  <StyledText>Start Time</StyledText>
                  <TouchableOpacity onPress={this._showDateTimePicker} style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <StyledText style={{fontFamily: 'rubik-bold', color: Colors.greenPrimary}}>{this.state.startTime}</StyledText>
                    <Feather name='chevron-right' size={20} color={Colors.grayDark} />
                  </TouchableOpacity>
                </View>

                <View style={{
                  padding: 10,
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderColor: 'transparent',
                  borderTopColor: Colors.accentLight,
                  }}>
                  <StyledText>Watering Duration</StyledText>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
                    <Slider
                      style={{
                        flex: 2
                      }}
                      minimumValue={1}
                      maximumValue={30}
                      step={1}
                      value={this.state.duration}
                      onValueChange={(value) => this.setState({duration: value})}
                      minimumTrackTintColor={Colors.greenPrimary}
                      maximumTrackTintColor={Colors.accentLight} />
                    <StyledText style={{color: Colors.greenPrimary, marginLeft:20, fontFamily: 'rubik-bold'}}>{this.state.duration} min.</StyledText>
                  </View>
                </View>
              </View>
            </View>
          }
          <View style={{padding: 20}}>
            <Button
              onPress={() => this._saveZone()}
              title='Save'
              color={Colors.greenPrimary}
            />
          </View>
      </ScrollView>
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
    margin: 20,
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
    height: 45,
    fontSize: 18,
    borderColor: 'transparent',
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 20,
    borderRadius: 10
  }
})
