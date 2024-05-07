import {render, screen, userEvent, act} from '@testing-library/react-native'
import { Task } from "../../src/tasks/Task"

describe('Task', function () {
  it('displays an unchecked task', function () {
    const task = {
      _id: 'some task',
      checked: false,
      text: 'A task',
    }

    render(
      <Task task={task} onCheckboxClick={jest.fn} onDeleteClick={jest.fn} />
    )

    const taskText = screen.getByTestId(`taskText-${task._id}`)

    expect(taskText.props.children).toBe(task.text)
  })
  
  it('checks task onPress', async function () {
    const task = {
      _id: 'some task',
      checked: false,
      text: 'A task',
    }

    const onCheckboxClick = jest.fn(({ checked }) => {
      task.checked = checked
    })

    const user = userEvent.setup()
    jest.useFakeTimers()
    render(<Task task={task} onCheckboxClick={onCheckboxClick} onDeleteClick={jest.fn} />)

    const checkBox = screen.getByTestId(`checkbox-${task._id}`)
    
    await user.press(checkBox)

    act(() => {
      jest.runAllTimers()
    })
    
    expect(task.checked).toBe(true)
    expect(onCheckboxClick).toBeCalled()

    screen.rerender(<Task task={task} onCheckboxClick={onCheckboxClick} onDeleteClick={jest.fn} />)

    expect(checkBox).toBeChecked()
  })

  it('removes task onPress', async function () {
    const task = {
      _id: 'some task',
      checked: false,
      text: 'A task',
    }

    const onDeleteClick = jest.fn()

    const user =  userEvent.setup()
    jest.useFakeTimers()
    render(<Task task={task} onCheckboxClick={jest.fn} onDeleteClick={onDeleteClick} />)

    const button = screen.getByText('X')
    
    await user.press(button)

    act(() => {
      jest.runAllTimers()
    })
    
    expect(onDeleteClick).toBeCalled()
  })
})