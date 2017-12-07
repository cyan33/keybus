function createKeyBus(target) {
  const simulDownListeners = {};
  let isMultiKey = false;
  let keyhash = null;

  if (!(target instanceof HTMLElement)) {
    throw Error('KeyBus: target must be a DOM element.');
  }

  function enableMultiKey() {
    isMultiKey = true;
    keyhash = {};
  }

  function disableMultiKey() {
    isMultiKey = false;
    keyhash = null;
  }

  function getKeyhash() {
    return isMultiKey ? keyhash : null;
  }

  function down(keyCode, cb) {
    if (isMultiKey) {
      throw Error('multikey handlers should not use the "down" method of KeyBus');
      return;
    }

    function keydownHandler(e) {
      if (e.keyCode === keyCode) {
        e.preventDefault();
        cb(e);
      }
    }

    target.addEventListener('keydown', keydownHandler);
    
    return {
      remove() {
        target.removeEventListener('keydown', keydownHandler);
      }
    };
  }

  function up(keyCode, cb) {
    if (isMultiKey) {
      throw Error('multikey handlers should not use the "on" method of KeyBus');
      return;
    }

    function keyupHandler(e) {
      if (e.keyCode === keyCode) {
        e.preventDefault();
        cb(e);
      }
    }

    target.addEventListener('keyup', keyupHandler);

    return {
      remove() {
        target.removeEventListener('keyup', keyupHandler);
      }
    };
  }

  function simulDown(keyCode, cb) {
    simulDownListeners[keyCode] ? simulDownListeners[keyCode] = [cb] 
      : simulDownListeners[keyCode].push(cb);

    function updateKeyhash(e, val) {
      if (e.keyCode === keyCode) {
        e.preventDefault();
        keyhash[keyCode] = val;
      }
    }

    const keydownUpdate = (e) => updateKeyhash(e, true);
    const keyupUpdate = (e) => updateKeyhash(e, false);


    target.addEventListener('keydown', keydownUpdate);
    target.addEventListener('keyup', keyupUpdate);

    return {
      remove() {
        simulDownListeners[keyCode].splice(simulDownListeners[keyCode].indexOf(cb), 1);

        target.removeEventListener('keydown', keydownUpdate);
        target.removeEventListener('keyup', keyupUpdate);
      }
    };
  }

  function executeMultiKeyHandlers() {
    for (let key in simulDownListeners) {
      if (keyhash[key]) {
        simulDownListeners[key].forEach(cb => {
          cb();
        });
      }
    }
  }
}

module.exports = createKeyBus;
