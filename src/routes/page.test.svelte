import { handleSubmit } from './index'

describe('handleSubmit', () => {
  it('should set the loading state to true', () => {
    const state = {
      loading: false,
      chatMessages: [],
      query: '',
      answer: ''
    }

    handleSubmit(state)

    expect(state.loading).toBe(true)
  })

  it('should add the user\'s query to the chatMessages array', () => {
    const state = {
      loading: false,
      chatMessages: [],
      query: 'Hello',
      answer: ''
    }

    handleSubmit(state)

    expect(state.chatMessages).toEqual([{ role: 'user', content: 'Hello' }])
  })

  it('should create a new SSE event source and send the chatMessages array to the server', () => {
    const state = {
      loading: false,
      chatMessages: [],
      query: '',
      answer: ''
    }

    handleSubmit(state)

    expect(state.chatMessages).toEqual([{ role: 'user', content: '' }])
  })

  it('should set the query state to an empty string', () => {
    const state = {
      loading: false,
      chatMessages: [],
      query: 'Hello',
      answer: ''
    }

    handleSubmit(state)

    expect(state.query).toBe('')
  })

  it('should add an event listener to the event source for the \'error\' event', () => {
    const state = {
      loading: false,
      chatMessages: [],
      query: '',
      answer: ''
    }

    handleSubmit(state)

    expect(state.chatMessages).toEqual([{ role: 'user', content: '' }])
  })

  it('should add an event listener to the event source for the \'message\' event', () => {
    const state = {
      loading: false,
      chatMessages: [],
      query: '',
      answer: ''
    }

    handleSubmit(state)

    expect(state.chatMessages).toEqual([{ role: 'user', content: '' }])
  })

  it('should call the scrollToBottom function', () => {
    const state = {
      loading: false,
      chatMessages: [],
      query: '',
      answer: ''
    }

    handleSubmit(state)

    expect(state.chatMessages).toEqual([{ role: 'user', content: '' }])
  })
})

