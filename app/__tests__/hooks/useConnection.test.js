import { renderHook } from '@testing-library/react-native'
import { useConnection } from '../../src/hooks/useConnection'
import Meteor from '@meteorrn/core'

jest.spyOn(Meteor, 'connect')
  .mockImplementation(
    jest.fn()
  )

describe('useConnection', function () {
  it('returns connections', function () {
    const {result: {current: hookResult}} = renderHook(useConnection)

    expect(hookResult).toEqual({connected: null, connectionError: null})
  })
})