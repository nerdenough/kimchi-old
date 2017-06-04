/* eslint-env mocha */
import AWS from 'aws-sdk-mock'
import sinon from 'sinon'
import { expect } from 'chai'
import { generateResponse, handleMessage } from '../../src/handlers/messageReceived'
import { intents } from '../../src/lex/intents'

describe('Message Received', () => {
  describe('#generateResponse', () => {
    let intentSpy = sinon.spy()
    const message = {
      currentIntent: {
        slots: {}
      }
    }

    before(() => {
      sinon.stub(intents, 'find').returns({
        getResponse: intentSpy
      })

      generateResponse(message)
    })

    it('calls getResponse() on the intent', () => expect(intentSpy).to.have.been.calledWith(message.currentIntent.slots))
  })

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
