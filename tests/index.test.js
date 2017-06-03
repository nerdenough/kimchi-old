/* eslint-env mocha */
import Discord from 'discord.js'
import sinon from 'sinon'
import { expect } from 'chai'
import { initialise } from '../src/index'

describe('Index', () => {
  describe('#initialise', () => {
    let clientOnStub
    let clientLoginStub

    before(() => {
      clientOnStub = sinon.stub(Discord.Client.prototype, 'on').returns(true)
      clientLoginStub = sinon.stub(Discord.Client.prototype, 'login').returns(true)
      initialise()
    })

    after(() => {
      clientOnStub.restore()
      clientLoginStub.restore()
    })

    it('attempts to sign into discord', () => expect(clientLoginStub).to.have.been.called)
    it('sets the ready callback', () => expect(clientOnStub).to.have.been.calledWith('ready'))
    it('sets the message callback', () => expect(clientOnStub).to.have.been.calledWith('message'))
  })
})
