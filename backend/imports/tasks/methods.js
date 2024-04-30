import { Meteor } from 'meteor/meteor'
import { TasksCollection } from './TasksCollection'

export const getMyTasks = function () {
  const userId = this.userId
  checkUser(userId)
  return TasksCollection.find({ userId })
}

export const insertTask = function ({ text }) {
  const userId = this.userId
  checkUser(userId)
  const checked = false
  const createdAt = new Date()
  return TasksCollection.insert({ text, userId, checked, createdAt })
}

export const checkTask = function ({ _id, checked }) {
  const userId = this.userId
  checkUser(userId)
  return TasksCollection.update({ _id, userId }, { $set: { checked } })
}

export const removeTask = function ({ _id }) {
  const userid = this.userId
  checkUser(userId)
  return TasksCollection.remove ({ _id, userId })
}

const checkUser = userId => {
  if (!userId) {
    throw new Meteor.Error('permissionDenied', 'notSignedIn', { userId })
  }
}