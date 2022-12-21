import {assert, fixture, html} from '@open-wc/testing'
import '../src/music-sampler-element'

describe('music-sampler', function () {
  describe('element creation', function () {
    it('creates from document.createElement', function () {
      const el = document.createElement('music-sampler')
      assert.equal('MUSIC-SAMPLER', el.nodeName)
    })

    it('creates from constructor', function () {
      const el = new window.MusicSamplerElement()
      assert.equal('MUSIC-SAMPLER', el.nodeName)
    })
  })

  describe('after tree insertion', function () {
    beforeEach(async function () {
      await fixture(html` <music-sampler></music-sampler>`)
    })

    it('initiates', function () {
      const ce = document.querySelector('music-sampler')
      assert.equal(ce?.textContent, ':wave:')
    })
  })
})
