import { useEffect, useState } from 'react'
import Meteor from '@meteorrn/core'
import * as SecureStore from 'expo-secure-store'
import config from '../../config.json'

Meteor.isVerbose = true

Meteor.connect(config.backend.url, {
  AsyncStorage: {
    getItem: SecureStore.getItemAsync,
    setItem: SecureStore.setItemAsync,
    removeItem: SecureStore.deleteItemAsync,
  }
})

export const useConnection = () => {
  const [connected, setConnected] = useState(null)
  const [connectionError, setConnectionError] = useState(null)

  useEffect(() => {
    const onError = (e) => setConnectionError(e)
    Meteor.ddp.on('error', onError)

    const onConnected = () => connected !== true && setConnected(true)
    Meteor.ddp.on('connected', onConnected)
    
    const onDisconnected = () => {
      Meteor.ddp.autoConnect = true
      if (connected !== false) {
        setConnected(false)
      }
      Meteor.reconnect()
    }

    Meteor.ddp.on('disconnected', onDisconnected)

    return () => {
      Meteor.ddp.off('error', onError)
      Meteor.ddp.off('connected', onConnected)
      Meteor.ddp.off('disconnected', onDisconnected)
    }
  }, [])
  
  return { connected, connectionError }
}