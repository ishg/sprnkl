import React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native'

import Colors from '../constants/Colors'

export default class Zone extends React.Component {
  render () {
    return (
      <View style={styles.slide}>
        <Image
          source={require('../assets/images/plant.jpg')}
          style={styles.zoneImage}
        />
        <Text style={styles.zoneTitle}>{this.props.zone.title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  zoneTitle: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: 'bold'
  },
  zoneImage: {
    flex: 1,
    resizeMode: 'contain',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20
  }
})
