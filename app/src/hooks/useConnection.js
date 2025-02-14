import { useEffect, useState } from 'react'
import Meteor, { useTracker } from '@meteorrn/core'
import * as SecureStore from 'expo-secure-store'
import config from '../../config.json'

// get detailed info about internals
Meteor.isVerbose = false

// connect with Meteor and use a secure store
// to persist our received login token, so it's encrypted
// and only readable for this very app
// read more at: https://docs.expo.dev/versions/latest/sdk/securestore/
Meteor.connect(config.backend.url, {
  AsyncStorage: {
    getItem: SecureStore.getItemAsync,
    setItem: SecureStore.setItemAsync,
    removeItem: SecureStore.deleteItemAsync,
  },
  autoConnect: true,
  autoReconnect: true,
  reconnectInterval: 500,
})

/**
 * Hook that handle auto-reconnect and updates state accordingly.
 * @return {{connected: boolean|null, connectionError: Error|null}}
 */
export const useConnection = () => {
  const [connected, setConnected] = useState(null)
  const [connectionError, setConnectionError] = useState(null)
  const status = useTracker(() => Meteor.status())

  if (status.connected && !connected) {
    console.info('set connected', status)
    setConnected(true)
  }

  if (connected && !status.connected) {
    console.info('set disconnected', status)
    setConnected(false)
  }

  // we additionally listen to any connection errors
  useEffect(() => {
    const onError = (e) => setConnectionError(e)
    Meteor.ddp.on('error', onError)

    return () => {
      Meteor.ddp.off('error', onError)
    }
  }, [])
  
  return { connected, connectionError }
}