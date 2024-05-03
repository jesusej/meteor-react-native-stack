import { Accounts } from 'meteor/accounts-base'
import { check, Match } from 'meteor/check'
import { Meteor } from 'meteor/meteor'
import { NotSignedInError } from '../errors/NotSignedInError'
import { PermissionDeniedError } from '../errors/PermissionDeniedError'

export const registerNewUser = async function (options) {
  check(options, Match.ObjectIncluding({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    loginImmediately: Match.Maybe(Boolean)
  }))

  const { email, password, firstName, lastName, loginImmediately } = options

  if (Accounts.findUserByEmail(email)) {
    throw new PermissionDeniedError('accounts.userExists', {email})
  }

  const userId = await Accounts.createUserAsync({ email, password })

  await Meteor.users.updateAsync(userId, { $set: { firstName, lastName } })

  Accounts.sendVerificationEmail(userId, email)

  if (loginImmediately) {
    return Accounts._loginUser(this, userId)
  }

  return { id: userId, token: undefined, tokenExpires: undefined }
}

export const updateUserProfile = async function ({ firstName, lastName }) {
  check(firstName, Match.Maybe(String))
  check(lastName, Match.Maybe(String))

  const { userId } = this

  if (!userId) {
    throw new NotSignedInError({ userId })
  }

  const updateDoc = { $set: {} }

  if (firstName) {
    updateDoc.$set.firstName = firstName
  }

  if (lastName) {
    updateDoc.$set.lastName = lastName
  }

  return !!(await Meteor.users.updateAsync(userId, updateDoc))
}

export const deleteAccount = async function () {
  const { userId } = this

  if (!userId) {
    throw new NotSignedInError({ userId })
  }

  return !!(await Meteor.users.removeAsync(userId))
}