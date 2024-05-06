import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js'
import 'react-native-gesture-handler/jestSetup'
import { WebSocket } from 'mock-socket'

global.WebSocket = WebSocket

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo)

jest.mock('expo-secure-store', () => {
  return {
      getItemAsync: jest.fn(),
      setItemAsync: jest.fn(),
      deleteItemAsync: jest.fn()
  }
})