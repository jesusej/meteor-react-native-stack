import Meteor from '@meteorrn/core'
import { renderHook } from "@testing-library/react-native"
import { useAccount } from "../../src/hooks/useAccount"

const mockFn = jest.spyOn(Meteor, 'user')
  .mockImplementation(
    () => ({ _id: 'some id', profile: null })
  )

describe('useAccount', function () {
  it('returns user and api', async function () {
    const {result: { current: hookResult}} = renderHook(useAccount)
    
    expect(hookResult.user).toEqual({ _id: 'some id', profile: null })
  })
  
  it('returns null if user is not saved', function () {
    mockFn.mockRestore()
    const {result: { current: hookResult } } = renderHook(useAccount)

    expect(hookResult.user).toBe(null)
  })
})