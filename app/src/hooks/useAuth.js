import { useReducer, useEffect, useMemo } from "react"
import Meteor from "@meteorrn/core"

const initalState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      }
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
      }
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        userToken: null,
      }
  }
}

const Data = Meteor.getData()

export const useAuth = () => {
  const [state, dispatch] = useReducer(reducer, initalState, undefined)

  useEffect(() => {
    const handleOnLogin = () => dispatch({ type: 'RESTORE_TOKEN', token: Meteor.getAuthToken() })
    Data.on('onLogin', handleOnLogin)
    return () => Data.off('onLogin', handleOnLogin)
  }, [])

  const authContext = useMemo(() => ({
    signIn: ({ email, password, onError }) => {
      Meteor.loginWithPassword(email, password, async (err) => {
        if (err) {
          if (err.message === 'Match failed [400]') {
            err.message = 'Login failed, please check your credentials and retry.'
          }
          return onError(err)
        }
        const token = Meteor.getAuthToken()
        const type = 'SIGN_IN'
        console.log('token', token)
        dispatch({ type, token })
      })
    },
    signOut: ({ onError }) => {
      Meteor.logout(err => {
        if (err) {
          return onError(err)
        }
        dispatch({ type: 'SIGN_OUT' })
      })
    },
    signUp: ({ email, password, firstName, lastName, onError }) => {
      const signupArgs = { email, password, firstName, lastName, loginImmediately: true }

      Meteor.call('registerNewUser', signupArgs, (err, credentials) => {
        if (err) {
          return onError(err)
        }

        Meteor._handleLoginCallback(err, credentials)

        const token = Meteor.getAuthToken()
        const type = 'SIGN_IN'
        dispatch({ type, token })
      })
    },
    deleteAccount: ({ onError }) => {
      Meteor.call('deleteAccount', (err) => {
        if (err) {
          return onError(err)
        }

        Meteor.handleLogout()
        dispatch({ type: 'SIGN_OUT' })
      })
    }
  }), [])

  return { state, authContext }
}