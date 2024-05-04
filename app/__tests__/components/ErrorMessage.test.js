import React from "react"
import {render, screen} from '@testing-library/react-native'
import { ErrorMessage } from '../../src/components/ErrorMessage'

describe('ErrorMessage', function () {
  it('displays a given error as message', async function () {
    const error = new Error('this is an error')
    render(
      <ErrorMessage error={error} />
    )

    const errorMessage = screen.getByTestId('errorMessageText')

    expect(errorMessage.props.children).toBe(error.message)
  })

  it('doesn\'t display given error if undefined', function () {
    render(
      <ErrorMessage />
    )

    const errorMessage = screen.queryByTestId('errorMessageText')
    
    expect(errorMessage).toBe(null)
  })
})