class KeyBus {
  constructor(target) {
    this.target = target
    this.enableMultiKey = false

    this.simulDownListeners = {}
  }

  enableMultiKey() {
    this.enableMultiKey = true
    this.keyhash = {}
  }

  disableMultiKey() {
    this.enableMultiKey = false
    this.keyhash = null
  }

  getKeyhash() {
    return this.enableMultiKey ? this.keyhash : null
  }

  down(keyCode, cb) {
    if (this.enableMultiKey) {
      throw Error('multikey handlers should not use the "on" method of KeyBus')
      return
    }
    this.target.addEventListener('keydown', cb.bind(cb))
    
    return {
      remove() {
        this.target.removeEventListener('keydown', cb)
      }
    }
  }

  up(keyCode, cb) {
    if (this.enableMultiKey) {
      throw Error('multikey handlers should not use the "on" method of KeyBus')
      return
    }
    this.target.addEventListener('keyup', cb.bind(cb))

    return {
      remove() {
        this.target.removeEventListener('keydown', cb)
      }
    }
  }

  simulDown(keyCode, cb) {
    this.simulDownListeners[keyCode] ? this.simulDownListeners[keyCode] = [cb] 
      : this.simulDownListeners[keyCode].push(cb)

    this.target.addEventListener('keydown', (e) => {
      if (e.keyCode === keyCode) this.keyhash[keyCode] = true
    })
    this.target.addEventListener('keyup', (e) => {
      if (e.keyCode === keyCode) this.keyhash[keyCode] = false
    })

    return {
      remove() {
        this.simulDownListeners[keyCode].splice(this.simulDownListeners[keyCode].indexOf(cb), 1)
      }
    }
  }

  executeMultiKeyHandlers() {
    for (let key in this.simulDownListeners) {
      if (this.keyhash[key]) {
        this.simulDownListeners[key].forEach(cb => {
          cb()
        })
      }
    }
  }
}

module.exports = KeyBus
