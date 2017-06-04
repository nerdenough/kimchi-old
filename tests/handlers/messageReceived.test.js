/* eslint-env mocha */
import AWS from 'aws-sdk-mock'
import sinon from 'sinon'
import { expect } from 'chai'
import { handleMessage } from '../../src/handlers/messageReceived'

describe('Message Received', () => {
  describe('#handleMessage', () => {
    describe('when the message author is the bot', () => {
      let lexRuntimeSpy = sinon.spy()
      let messageReplySpy = sinon.spy()

      before(() => {
        AWS.mock('LexRuntime', 'postText', lexRuntimeSpy)
        handleMessage({
          author: { id: 1 },
          reply: messageReplySpy
        }, { user: { id: 1 } })
      })

      after(() => {
        AWS.restore('LexRuntime', 'postText')
      })

      it('does not post the message to lex', () => expect(lexRuntimeSpy).to.not.have.been.called)
      it('does not send a reply to the user', () => expect(messageReplySpy).to.not.have.been.called)
    })

    describe('when the bot is not mentioned', () => {
      let lexRuntimeSpy = sinon.spy()
      let messageReplySpy = sinon.spy()

      before(() => {
        AWS.mock('LexRuntime', 'postText', Promise.resolve({ message: 'Hello!' }))
        handleMessage({
          author: { id: 1 },
          reply: messageReplySpy,
          cleanContent: 'foobar',
          isMentioned: () => false
        }, { user: { id: 2 } })
      })

      after(() => {
        AWS.restore('LexRuntime', 'postText')
      })

      it('does not post the message to lex', () => expect(lexRuntimeSpy).to.not.have.been.called)
      it('does not send a reply to the user', () => expect(messageReplySpy).to.not.have.been.called)
    })

    describe('when the message author is not the bot', () => {
      let messageReplySpy = sinon.spy()

      before(() => {
        AWS.mock('LexRuntime', 'postText', Promise.resolve({ message: 'Hello!' }))
        handleMessage({
          author: { id: 1 },
          reply: messageReplySpy,
          cleanContent: 'foobar',
          isMentioned: () => true
        }, { user: { id: 2 } })
      })

      after(() => {
        AWS.restore('LexRuntime', 'postText')
      })

      it('sends the reply from lex to the user', () => expect(messageReplySpy).to.have.been.calledWith('Hello!'))
    })
  })
})
