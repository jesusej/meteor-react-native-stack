import { TasksCollection } from './TasksCollection'
import { NotSignedInError } from '../errors/NotSignedInError'

export const getMyTasks = function () {
  const userId = this.userId
  checkUser(userId)
  return TasksCollection.find({ userId })
}

export const insertTask = async function ({ text }) {
  const userId = this.userId
  checkUser(userId)
  const checked = false
  const createdAt = new Date()
  return TasksCollection.insertAsync({ text, userId, checked, createdAt })
}

export const checkTask = async function ({ _id, checked }) {
  const userId = this.userId
  checkUser(userId)
  return TasksCollection.updateAsync({ _id, userId }, { $set: { checked } })
}

export const removeTask = async function ({ _id }) {
  const userId = this.userId
  checkUser(userId)
  return TasksCollection.removeAsync ({ _id, userId })
}

const checkUser = userId => {
  if (!userId) {
    throw new NotSignedInError({ userId })
  }
}