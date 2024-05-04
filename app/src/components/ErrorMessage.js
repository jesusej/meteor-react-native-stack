import { Text, View } from 'react-native'
import { defaultStyles } from '../styles/defaultStyles'

export const ErrorMessage = ({ error, message }) => {
  if (!error && !message) { return null }

  return (
    <View style={defaultStyles.container}>
      <Text style={defaultStyles.danger} testID='errorMessageText'>{message || error.message}</Text>
    </View>
  )
}