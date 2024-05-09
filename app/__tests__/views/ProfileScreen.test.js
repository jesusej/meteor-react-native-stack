import { act, render, screen, userEvent } from "@testing-library/react-native"
import { ProfileScreen } from "../../src/screens/ProfileScreen"
import { AuthContext } from '../../src/contexts/AuthContext'
import * as accountHooks from '../../src/hooks/useAccount'

describe('ProfileScreen', function () {
  const userTemplate = {
    _id: 'some user',
    firstName: 'John',
    lastName: 'Doe',
    emails: [{
      address: 'user@example.com',
    }],
  }

  it('Shows profile', async function () {
    jest.spyOn(accountHooks, 'useAccount').mockImplementation(() => ({
      user: userTemplate,
      updateProfile: jest.fn()
    }))

    render(
      <AuthContext.Provider value={{}}>
        <ProfileScreen />
      </AuthContext.Provider>
    )

    const emailText = screen.getByTestId('profile-email')
    const firstName = screen.getByTestId('profile-firstName')
    const lastName = screen.getByTestId('profile-lastName')

    expect(emailText.props.children).toBe(userTemplate.emails[0].address)
    expect(firstName.props.children).toBe(userTemplate.firstName)
    expect(lastName.props.children).toBe(userTemplate.lastName)
  })

  it('Shows incomplete profile', async function () {
    jest.spyOn(accountHooks, 'useAccount').mockImplementation(() => ({
      user: {
        _id: userTemplate._id,
        emails: userTemplate.emails
      },
      updateProfile: jest.fn()
    }))

    render(
      <AuthContext.Provider value={{}}>
        <ProfileScreen />
      </AuthContext.Provider>
    )

    const emailText = screen.getByTestId('profile-email')
    const firstName = screen.getByTestId('profile-firstName')
    const lastName = screen.getByTestId('profile-lastName')

    expect(emailText.props.children).toBe(userTemplate.emails[0].address)
    expect(firstName.props.children).toBe('Not yet defined')
    expect(lastName.props.children).toBe('Not yet defined')
  })

  it('Let\'s you edit the profile', async function () {
    let userToEdit = userTemplate
    const lastNameEdit = 'Doe Fey'

    const updateProfile = jest.fn()

    jest.spyOn(accountHooks, 'useAccount').mockImplementation(() => ({
      user: userToEdit,
      updateProfile,
    }))

    const user = userEvent.setup()
    jest.useFakeTimers()
    render(
      <AuthContext.Provider value={{}}>
        <ProfileScreen />
      </AuthContext.Provider>
    )

    const lastNameButton = screen.getByTestId('button-lastName')

    await user.press(lastNameButton)

    const lastNameInput = screen.getByPlaceholderText('Last Name')
    const updateButton = screen.getByText('Update')

    await user.type(lastNameInput, lastNameEdit)
    await user.press(updateButton)

    act(() => {
      jest.runAllTimers()
    })

    expect(updateProfile).toBeCalled()
  })

  it('Let\'s you signOut', async function () {
    const signOut = jest.fn()
    jest.spyOn(accountHooks, 'useAccount').mockImplementation(() => ({
      user: userTemplate,
      updateProfile: jest.fn()
    }))

    const user = userEvent.setup()
    jest.useFakeTimers()
    render(
      <AuthContext.Provider value={{ signOut }}>
        <ProfileScreen />
      </AuthContext.Provider>
    )

    const signOutButton = screen.getByText('Sign out')

    await user.press(signOutButton)

    act(() => {
      jest.runAllTimers()
    })

    expect(signOut).toBeCalled()
  })

  it('Let\'s you deleteAccount', async function () {
    const deleteAccount = jest.fn()
    jest.spyOn(accountHooks, 'useAccount').mockImplementation(() => ({
      user: userTemplate,
      updateProfile: jest.fn()
    }))

    const user = userEvent.setup()
    jest.useFakeTimers()
    render(
      <AuthContext.Provider value={{ deleteAccount }}>
        <ProfileScreen />
      </AuthContext.Provider>
    )

    const deleteButton = screen.getByText('Delete account')

    await user.press(deleteButton)

    act(() => {
      jest.runAllTimers()
    })

    expect(deleteAccount).toBeCalled()
  })
})