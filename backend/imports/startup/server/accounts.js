import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor'
import {
  registerNewUser,
  updateUserProfile,
  deleteAccount
} from '../../accounts/methods'

const defaultFieldSelector = {
  _id: 1,
  username: 1,
  emails: 1,
  firstName: 1,
  lastName: 1,
}

Accounts.config({
  ...Meteor.settings.accounts.config,
  defaultFieldSelector,
})
Meteor.methods({
  registerNewUser,
  updateUserProfile,
  deleteAccount
})
