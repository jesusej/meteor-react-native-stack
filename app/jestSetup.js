jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

// include this line for mocking react-native-gesture-handler
import 'react-native-gesture-handler/jestSetup'