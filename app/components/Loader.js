import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native'
import Colors from '../constants/Colors'

const Loader = props => {
  const {
    loading,
    ...attributes
  } = props

  return (
    <Modal
      transparent
      animationType={'none'}
      visible={loading}
      onRequestClose={() => { console.log('close modal') }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            size='large'
            color={Colors.blue}
            animating={loading} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 200,
    width: 200,
    borderRadius: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
})

export default Loader
