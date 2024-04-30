import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useConnection } from './src/hooks/useConnection';
import { ErrorMessage } from './src/components/ErrorMessage';

export default function App() {
  const { connected, connectionError } = useConnection()

  if(!connected) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text>Connecting to our servers...</Text>
      </View>
    )
  }

  if (connectionError) {
    return (<ErrorMessage error={connectionError} />)
  }

  return (
    <View style={styles.container}>
      <Text>We are connected</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
