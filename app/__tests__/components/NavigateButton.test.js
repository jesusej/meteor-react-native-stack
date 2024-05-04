import React from "react"
import {render, screen} from '@testing-library/react-native'
import { NavigateButton } from '../../src/components/NavigateButton'
import { NavigationContainer } from "@react-navigation/native"

describe('NavigateButton', function () {
  it('Shows title', function () {
    const title = 'Some title'
    render(
      <NavigationContainer>
        <NavigateButton title={title} />
      </NavigationContainer>
    )

    const navigateButton = !!screen.getByText(title)

    expect(navigateButton).toBe(true)
  })
})