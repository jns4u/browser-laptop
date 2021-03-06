/* global describe, it, before */
const basicAuthState = require('../../../../../app/common/state/basicAuthState')
const tabState = require('../../../../../app/common/state/tabState')
const Immutable = require('immutable')
const assert = require('assert')

const defaultAppState = Immutable.fromJS({
  tabs: []
})

const defaultTab = Immutable.fromJS({
  tabId: 1,
  loginRequiredDetail: {
    request: { url: 'someurl' },
    authInfo: { authInfoProp: 'value' }
  }
})

describe('basicAuthState', function () {
  describe('setLoginResponseDetail', function () {
    describe('`tabId` exists in appState with loginRequiredDetail', function () {
      before(function () {
        this.appState = defaultAppState.set('tabs', Immutable.fromJS([defaultTab]))
        this.appState = basicAuthState.setLoginResponseDetail(this.appState, 1, {
          username: 'username',
          password: 'password'
        })
      })

      it('removes the login detail', function () {
        let tab = tabState.getByTabId(this.appState, 1)
        assert(tab)
        assert.equal(undefined, tab.get('loginRequiredDetail'))
      })
    })

    describe('`tabId` exists in appState with no loginRequiredDetail', function () {
      before(function () {
        this.appState = defaultAppState.set('tabs', Immutable.fromJS([{ tabId: 1 }]))
        this.appState = basicAuthState.setLoginResponseDetail(this.appState, 1, {
          username: 'username',
          password: 'password'
        })
      })

      it('returns the unmodified appState', function () {
        let tab = tabState.getByTabId(this.appState, 1)
        assert(tab)
        assert.equal(undefined, tab.get('loginRequiredDetail'))
      })
    })

    describe('`tabId` does not exist in appState', function () {
      before(function () {
        this.appState = basicAuthState.setLoginResponseDetail(defaultAppState, 1, {
          username: 'username',
          password: 'password'
        })
      })

      it('returns the unmodified appState', function () {
        let tab = tabState.getByTabId(this.appState, 1)
        assert.equal(null, tab)
      })
    })
  })

  describe('setLoginRequiredDetail', function () {
    it('error for missing required fields')

    describe('with null detail', function () {
      before(function () {
        this.appState = defaultAppState.set('tabs', Immutable.fromJS([defaultTab]))
        this.appState = basicAuthState.setLoginRequiredDetail(this.appState, 1, null)
      })

      it('removes the login detail', function () {
        let tab = tabState.getByTabId(this.appState, 1)
        assert(tab)
        assert.equal(undefined, tab.get('loginRequiredDetail'))
      })
    })

    describe('with empty detail', function () {
      before(function () {
        this.appState = defaultAppState.set('tabs', Immutable.fromJS([defaultTab]))
        this.appState = basicAuthState.setLoginRequiredDetail(this.appState, 1, {})
      })

      it('removes the login detail', function () {
        let tab = tabState.getByTabId(this.appState, 1)
        assert(tab)
        assert.equal(undefined, tab.get('loginRequiredDetail'))
      })
    })

    describe('`tabId` exists in appState', function () {
      before(function () {
        this.appState = defaultAppState.set('tabs', Immutable.fromJS([
          {
            tabId: 1
          }
        ]))
        this.appState = basicAuthState.setLoginRequiredDetail(this.appState, 1, {
          request: { url: 'someurl' },
          authInfo: { authInfoProp: 'value' }
        })
      })

      it('sets the login detail for `tabId` in the appState', function () {
        let tab = tabState.getByTabId(this.appState, 1)
        assert(tab)
        let loginRequiredDetail = tab.get('loginRequiredDetail')
        assert.equal('someurl', loginRequiredDetail.getIn(['request', 'url']))
        assert.equal('value', loginRequiredDetail.getIn(['authInfo', 'authInfoProp']))
      })
    })

    describe('`tabId` does not exist in appState', function () {
      before(function () {
        this.appState = basicAuthState.setLoginRequiredDetail(defaultAppState, 1, {
          request: { url: 'someurl' },
          authInfo: { authInfoProp: 'value' }
        })
      })

      it('creates a new tab in the appState and sets the login detail', function () {
        let tab = tabState.getByTabId(this.appState, 1)
        assert(tab)
        let loginRequiredDetail = tab.get('loginRequiredDetail')
        assert.equal('someurl', loginRequiredDetail.getIn(['request', 'url']))
        assert.equal('value', loginRequiredDetail.getIn(['authInfo', 'authInfoProp']))
      })
    })
  })

  describe('getLoginRequiredDetail', function () {
    describe('`tabId` exists in appState with loginRequiredDetail', function () {
      before(function () {
        this.appState = defaultAppState.set('tabs', Immutable.fromJS([defaultTab]))
        this.loginRequiredDetail = basicAuthState.getLoginRequiredDetail(this.appState, 1)
      })

      it('returns the login detail for `tabId`', function () {
        assert.equal('someurl', this.loginRequiredDetail.getIn(['request', 'url']))
        assert.equal('value', this.loginRequiredDetail.getIn(['authInfo', 'authInfoProp']))
      })
    })

    describe('`tabId` exists in appState with no loginRequiredDetail', function () {
      before(function () {
        this.appState = defaultAppState.set('tabs', Immutable.fromJS([
          {
            tabId: 1
          }
        ]))
        this.loginRequiredDetail = basicAuthState.getLoginRequiredDetail(this.appState, 1)
      })

      it('returns null', function () {
        assert.equal(null, this.loginRequiredDetail)
      })
    })

    describe('`tabId` does not exist in appState', function () {
      before(function () {
        this.loginRequiredDetail = basicAuthState.getLoginRequiredDetail(defaultAppState, 1)
      })

      it('returns null', function () {
        assert.equal(null, this.loginRequiredDetail)
      })
    })
  })
})
