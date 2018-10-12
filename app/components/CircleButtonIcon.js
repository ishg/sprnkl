import React from 'react'
import PropTypes from 'prop-types'
import { Feather } from '@expo/vector-icons'
import { View,
  Platform,
  TouchableOpacity,
  StyleSheet
} from 'react-native'

import { Icon } from 'react-native-elements'

import Colors from '../constants/Colors'

class CircleButtonIcon extends React.Component {
  _renderAndroid (icon, size, color, onPress) {
    return (
      <Icon
        raised
        name={icon}
        type='feather'
        color={color}
        size={size + 10}
        onPress={() => onPress()} />
    )
  }

  // <TouchableHighlight
  //       onPress={() => onPress()}>
  //       <View style={styles.circleIconButton}>
  //         <Feather name={icon} size={size} color={Colors.tabIconDefault} />
  //       </View>
  //     </TouchableHighlight>

  _convertHEX (hex) {
    hex = hex.replace('#', '')
    let r = parseInt(hex.substring(0, 2), 16)
    let g = parseInt(hex.substring(2, 4), 16)
    let b = parseInt(hex.substring(4, 6), 16)

    return 'rgba(' + r + ',' + g + ',' + b + ',0.05)'
  }

  _renderIOS (icon, size, color, onPress) {
    return (
      <TouchableOpacity onPress={() => onPress()}>
        <View style={[styles.circleIconButton, {
          height: size + 40,
          width: size + 40
        }]}>
          <Feather name={icon} size={size} color={color} />
        </View>
      </TouchableOpacity>
    )
  }

  render () {
    const {icon, size, color, onPress} = this.props
    return (
      Platform.OS === 'ios' ? this._renderIOS(icon, size, color, onPress) : this._renderAndroid(icon, size, color, onPress)
    )
  }
}

CircleButtonIcon.defaultProps = {
  size: 20,
  color: Colors.tabIconDefault
}

CircleButtonIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  size: PropTypes.number,
  color: PropTypes.string
}

const styles = StyleSheet.create({
  circleIconButton: {
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 6
      },
      android: {
        elevation: 5
      }
    }),
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default CircleButtonIcon
