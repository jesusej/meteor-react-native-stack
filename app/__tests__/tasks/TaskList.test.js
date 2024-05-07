import Meteor from '@meteorrn/core'
import {act, render, screen, userEvent} from '@testing-library/react-native'
import { TaskList } from "../../src/tasks/TaskList"
import * as accountHooks from '../../src/hooks/useAccount'
import { TasksCollection } from '../../src/tasks/TasksCollection'

const originalTasks = [
  {
    _id: 0,
    checked: false,
    text: 'A task',
  },
  {
    _id: 1,
    checked: false,
    text: 'Another task',
  },
  {
    _id: 2,
    checked: true,
    text: 'Checked task',
  }
]

const methods = ['tasks.insert', 'tasks.remove']

describe('TaskList', function () {
  let tasks = []
  let tasksUnchecked = []
  let useAccountMock
  let subscribeMock
  let callMock
  let tasksMock
  let lastMethodCalled

  beforeEach(() => {
    tasks = [...originalTasks]
    tasksUnchecked = tasks.filter((task) => !task.checked)
    lastMethodCalled = ''
    useAccountMock = jest.spyOn(accountHooks, 'useAccount').mockImplementation(() => {
      return { user: { _id: 'some user' }}
    })
    subscribeMock = jest.spyOn(Meteor, 'subscribe').mockImplementation(() => {
      return { ready: () => true }
    })
    callMock = jest.spyOn(Meteor, 'call').mockImplementation((name, {_id, text}) => {
      if (!methods.includes(name)) {
        return
      }
      lastMethodCalled = name

      if (name === 'tasks.insert' && text) {
        const newTask = {
          _id: [tasks.length - 1]._id + 1,
          text,
          checked: false
        }
  
        tasks.push(newTask)
        tasksUnchecked.push(newTask)
        return
      }

      if (name === 'tasks.remove' && _id) {
        tasks = tasks.filter(task => task._id !== _id)
        tasksUnchecked = tasksUnchecked.filter(task => task._id !== _id)
        return
      }

      return
    })
    tasksMock = jest.spyOn(TasksCollection, 'find').mockImplementation((filter) => {
      const checked = (filter.checked)
      return {
        /**
         * Returns tasks or taks checked if filter
         * contains property checked
         */
        fetch: () => checked ? tasksUnchecked : tasks,
        /**
         * Because it's only called in pendingTasksCount
         * it returns the tasks not checked
         */
        count: () => tasksUnchecked.length,
      }
    })
  })
  
  it('shows task list', function () {
    render(
      <TaskList />
    )

    const checkBoxes = screen.getAllByTestId(/checkbox/)
    const texts = screen.getAllByTestId(/taskText/)

    expect(checkBoxes.length).toBe(tasks.length)
    expect(texts.length).toBe(tasks.length)
    checkBoxes.forEach((check, i) => {
      if (tasks[i].checked) {
        expect(check).toBeChecked()
      } else {
        expect(check).not.toBeChecked()
      }
    })
    texts.forEach((text, i) => {
      expect(text.props.children).toBe(tasks[i].text)
    })
  })

  it('shows pending tasks on press \'Hide Completed Tasks\'', async function () {
    const user = userEvent.setup()
    jest.useFakeTimers()
    render(
      <TaskList />
    )

    const hideButton = screen.getByText('Hide Completed Tasks')

    await user.press(hideButton)

    act(() => {
      jest.runAllTimers()
    })

    screen.update(<TaskList />)

    const checkBoxes = screen.getAllByTestId(/checkbox/)
    const texts = screen.getAllByTestId(/taskText/)

    expect(checkBoxes.length).toBe(tasksUnchecked.length)
    expect(texts.length).toBe(tasksUnchecked.length)
    checkBoxes.forEach((check) => {
      expect(check).not.toBeChecked()
    })
    texts.forEach((text, i) => {
      expect(text.props.children).toBe(tasksUnchecked[i].text)
    })
    expect(hideButton.props.children).toBe('Show All')
  })

  it('adds task', async function () {
    const user = userEvent.setup()
    const taskTitle = 'A new task'
    jest.useFakeTimers()
    render(
      <TaskList />
    )

    const formInput = screen.getByPlaceholderText('Type to add new tasks')
    const submitButton = screen.getByText('Add Task')

    await user.type(formInput, taskTitle)
    await user.press(submitButton)

    act(() => {
      jest.runAllTimers()
    })

    screen.update(<TaskList />)

    const checkBoxes = screen.getAllByTestId(/checkbox/)
    const texts = screen.getAllByTestId(/taskText/)

    expect(checkBoxes.length).toBe(originalTasks.length + 1)
    expect(texts.length).toBe(originalTasks.length + 1)
    checkBoxes.forEach((check, i) => {
      if (tasks[i].checked) {
        expect(check).toBeChecked()
      } else {
        expect(check).not.toBeChecked()
      }
    })
    texts.forEach((text, i) => {
      expect(text.props.children).toBe(tasks[i].text)
    })
    expect(texts[texts.length - 1].props.children).toBe(taskTitle)
  })

  it('removes task', async function () {
    const taskToDelete = tasks[Math.floor(Math.random() * tasks.length)]
    
    const user = userEvent.setup()
    jest.useFakeTimers()
    render(
      <TaskList />
    )

    const removeButton = screen.getByTestId(`remove-${taskToDelete._id}`)

    await user.press(removeButton)

    await act(async () => {
      await jest.runAllTimers()
    })

    screen.rerender(<TaskList />)

    tasks.forEach((task, i) => {
        expect(task).not.toEqual(taskToDelete)
    })
    expect(callMock).toBeCalled()
  })
})