import { renderHook, act } from '@testing-library/react-native'
import { useAuth } from '../../src/hooks/useAuth'
import Meteor from '@meteorrn/core'

jest.spyOn(Meteor, 'getAuthToken').mockImplementation(() => {
  return 'some token'
})

jest.spyOn(Meteor, 'loginWithPassword').mockImplementation(async (_a, _b, fn) => await fn())

describe('useAuth', function () {
  it('returns initialState and API on call', function () {
    const {result: { current: hookResult } } = renderHook(useAuth)

    expect(hookResult.state).toEqual({isLoading: true, isSignout: false, userToken: null})
  })
})