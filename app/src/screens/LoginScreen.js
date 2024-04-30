import { View, Text, TextInput, Button } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { defaultColors, defaultStyles } from '../styles/defaultStyles'
import { ErrorMessage } from '../components/ErrorMessage'

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { signIn } = useContext(AuthContext)

  // handlers
  const onError = err => setError(err)
  const onSignIn = () => signIn({ email, password, onError })
  const onSignUp = () => navigation.navigate('SignUp')

  // render login form
  return (
    <View style={defaultStyles.container}>
      <TextInput
        placeholder='Your Email'
        placeholderTextColor={defaultColors.placeholder}
        style={defaultStyles.text}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder='Password'
        placeholderTextColor={defaultColors.placeholder}
        style={defaultStyles.text}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <ErrorMessage error={error} />
      <Button title='Sign in' color={defaultColors.primary} onPress={onSignIn} />
      <View style={defaultStyles.panel}>
        <Text>or</Text>
      </View>
      <Button title='Sign up' onPress={onSignUp} color={defaultColors.placeholder} />
    </View>
  )
}
