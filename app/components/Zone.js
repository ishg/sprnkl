import React from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import StyledText from '../components/StyledText'
import { Feather } from '@expo/vector-icons'

import Colors from '../constants/Colors'

export default class Zone extends React.Component {
  constructor (props) {
    super(props)
    console.log(this.props)
  }

  render () {
    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity style={{flex: 1}} onPress={() => this.props.navigation.navigate('Details', {mode: 'edit', zone: this.props.zone})}>
          <View style={styles.card}>
            <Image
              source={require('../assets/images/plant-1.jpg')}
              style={{width: 100, height: 100}}
            />
            <View style={styles.cardDetails}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <StyledText style={{fontFamily: 'nunito-bold', fontSize: 20, color: Colors.accentDark, paddingLeft: 10, paddingTop: 10}}>{this.props.zone.title}</StyledText>
              </View>
              <View style={{flexDirection: 'row', paddingLeft: 10, paddingRight: 10}}>
                <Feather name='clock' size={18} color={Colors.greenPrimary} />
                <StyledText style={{fontFamily: 'nunito', paddingLeft: 5, color: Colors.accentDark}}>
                    10 min @ 11:35pm
                  </StyledText>
              </View>
              <View style={{flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingBottom: 10}}>
                <Feather name='calendar' size={18} color={Colors.greenPrimary} />
                <StyledText style={{fontFamily: 'nunito', paddingLeft: 5, color: Colors.accentDark}}>M T W Th F Sa</StyledText>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{width: 60, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={{borderRadius: 100, padding: 10, backgroundColor: this.props.zone.status === 1 ? Colors.greenPrimary : Colors.accentLight}} onPress={() => {}}>

            <Feather name='power' size={20} color={this.props.zone.status === 1 ? Colors.white : Colors.accentDark} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10,
    flexDirection: 'row'
  },
  card: {
    overflow: 'hidden',
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: Colors.white
  },
  cardDetails: {
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
})
