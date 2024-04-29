import { Accounts } from 'meteor/accounts-base'
import { check, Match } from 'meteor/check'
import { Meteor } from 'meteor/meteor'

export const registerNewUser = function (options) {
  check(options, Match.ObjectIncluding({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    loginImmediately: Match.Maybe(Boolean)
  }))

  const { email, password, firstName, lastName, loginImmediately } = options

  if (Accounts.findUserByEmail(email)) {
    throw new Meteor.Error('permissionDenied', 'userExists', {email})
  }

  const userId = Accounts.createUser({ email, password })

  Meteor.users.update(userId, { $set: { firstName, lastName } })

  Accounts.sendVerificationEmail(userId, email)

  if (loginImmediately) {
    return Accounts._loginUser(this, userId)
  }

  return { id: userId, token: undefined, tokenExpires: undefined }
}

export const updateUserProfile = function ({ firstName, lastName }) {
  check(firstName, Match.Maybe(String))
  check(lastName, Match.Maybe(String))

  const { userId } = this

  if (!userId) {
    throw new Meteor.Error('permissionDenied', 'notAuthenticated', { userId })
  }

  const updateDoc = { $set: {} }

  if (firstName) {
    updateDoc.$set.firstName = firstName
  }

  if (lastName) {
    updateDoc.$set.lastName = lastName
  }

  return !!Meteor.users.update(userId, updateDoc)
}

export const deleteAccount = function () {
  const { userId } = this

  if (!userId) {
    throw new Meteor.Error('permissionDenied', 'notAuthenticated', { userId })
  }

  return !!Meteor.users.remove(userId)
}