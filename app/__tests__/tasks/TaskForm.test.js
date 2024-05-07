import { render, screen, userEvent, act } from "@testing-library/react-native"
import { TaskForm } from "../../src/tasks/TaskForm"
import Meteor from "@meteorrn/core"

describe('TaskForm', function () {
  it('sends a task', async function () {
    const textToSend = 'A task'
    
    let textSent
    const meteorCall = jest.spyOn(Meteor, 'call').mockImplementation((_name, {text}) => textSent = text)
    
    const user = userEvent.setup()
    jest.useFakeTimers()
    render(
      <TaskForm />
    )

    const textInput = screen.getByPlaceholderText('Type to add new tasks')
    const button = screen.getByText('Add Task')

    await user.type(textInput, textToSend)
    await user.press(button)

    act(() => {
      jest.runAllTimers()
    })

    expect(meteorCall).toBeCalled()
    expect(textSent).toBe(textToSend)

    meteorCall.mockReset()
  })
})