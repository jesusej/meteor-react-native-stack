import { View, Text } from 'react-native'
import { defaultStyles } from '../styles/defaultStyles'

export const HomeScreen = () => {
  return (
    <View style={defaultStyles.container}>
      <Text>Welcome home!</Text>
    </View>
  )
}
