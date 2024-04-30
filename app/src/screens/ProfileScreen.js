import { defaultColors, defaultStyles } from '../styles/defaultStyles'
import { Button, Text, View } from 'react-native'
import { useState } from 'react'
import { ErrorMessage } from '../components/ErrorMessage'

export const ProfileScreen = () => {
  const [error, setError] = useState(null)
  const handleSignOut = () => console.log('sign out')
  const handleDelete = () => console.log('delete account')


  return (
    <View style={defaultStyles.container}>
      <View style={{ ...defaultStyles.dangerBorder, padding: 10, marginTop: 10, alignSelf: 'stretch' }}>
        <Text style={defaultStyles.bold}>Danger Zone</Text>
        <Button title='Sign out' color={defaultColors.danger} onPress={handleSignOut} />
        <Button title='Delete account' color={defaultColors.danger} onPress={handleDelete} />
        <ErrorMessage error={error} />
      </View>
    </View>
  )
}