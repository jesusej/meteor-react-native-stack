import { act, render, screen, userEvent } from "@testing-library/react-native"
import { LoginScreen } from "../../src/screens/LoginScreen"
import { AuthContext } from '../../src/contexts/AuthContext'

describe('LoginScreen', function () {
  it('sends a login', async function () {
    const formToSend = {
      email: 'Some email',
      password: 'A password'
    }

    let result
    const signIn = jest.fn((props) => {
      result = props
    })
    const navigate = jest.fn()

    const user = userEvent.setup()
    jest.useFakeTimers()
    render(
      <AuthContext.Provider value={{ signIn }}>
        <LoginScreen navigation={{ navigate }}/>
      </AuthContext.Provider>
    )

    const emailInput = screen.getByPlaceholderText('Your Email')
    const passwdInput = screen.getByPlaceholderText('Password')
    const submit = screen.getByText('Sign in')

    await user.type(emailInput, formToSend.email)
    await user.type(passwdInput, formToSend.password)
    await user.press(submit)

    act(() => {
      jest.runAllTimers()
    })

    expect(signIn).toBeCalled()
    expect(result).toMatchObject(formToSend)
  })

  it('directs to SignUp', async function () {
    const signIn = jest.fn()
    const navigate = jest.fn()

    const user = userEvent.setup()
    jest.useFakeTimers()
    render(
      <AuthContext.Provider value={{ signIn }}>
        <LoginScreen navigation={{ navigate }}/>
      </AuthContext.Provider>
    )
    const signUpButton = screen.getByText('Sign up')

    await user.press(signUpButton)

    act(() => {
      jest.runAllTimers()
    })

    expect(navigate).toBeCalled()
  })
})