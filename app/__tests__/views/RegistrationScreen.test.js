import { act, render, screen, userEvent } from "@testing-library/react-native"
import { RegistrationScreen } from "../../src/screens/RegistrationScreen"
import { AuthContext } from '../../src/contexts/AuthContext'

describe('RegistrationScreen', function () {
  it('sends a signUp', async function () {
    const formToSend = {
      email: 'Some email',
      password: 'A password',
      firstName: 'First Name',
      lastName: 'Last Name',
    }

    let result
    const signUp = jest.fn((props) => {
      result = props
    })

    const user = userEvent.setup()
    jest.useFakeTimers()
    render(
      <AuthContext.Provider value={{ signUp }} >
        <RegistrationScreen />
      </AuthContext.Provider>
    )

    const emailInput = screen.getByPlaceholderText('Your Email')
    const passwdInput = screen.getByPlaceholderText('Your password')
    const firstNameInput = screen.getByPlaceholderText('Your first name (optional)')
    const lastNameInput = screen.getByPlaceholderText('Your last name (optional)')
    const submit = screen.getByText('Create new account')

    await user.type(emailInput, formToSend.email)
    await user.type(passwdInput, formToSend.password)
    await user.type(firstNameInput, formToSend.firstName)
    await user.type(lastNameInput, formToSend.lastName)
    await user.press(submit)

    act(() => {
      jest.runAllTimers()
    })

    expect(signUp).toBeCalled()
    expect(result).toMatchObject(formToSend)
  })
})