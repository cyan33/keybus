# KeyBus
:snowboarder: Support simultaneous multi-keypress handler. Especially useful in canvas game development on web browser.

## Installation

```sh
npm install keybus
```

## Basics Handler

The basic key handler serves exactly like what the browser native API supports:

```js
import KeyBus from 'keybus'

const kb = new KeyBus(document)

let enterKeydownHandler = kb.down(13, () => console.log('Enter keydown!'))

// to remove the keydown event handler for a specific key and event
enterKeydownHandler.remove()
```

APIs:

## Advanced Multi-key Handler

This is what the KeyBus is built for. Let's talk about the current situation of keypress handler first.

The native api `addEventListener` doesn't sufficiently support simultaneous keydown event (See more at https://stackoverflow.com/questions/15661796/how-to-handle-multiple-keypresses-with-canvas). If you have a moving character, which you could control its movement using `wasd`, the keyboard handlers will break down if you press `w` and `d` and want it to move top right simultaneously.

The stackoverflow post above shows a way to solve this problem, by using a hash table. But you still have to check the hash table every time you execute `game_loop`, which is a redundant concern to the developer. It's not a good way of abstraction.

However, with KeyBus, you could do this:

```js
var canvas = document.getElementById('my-canvas')
var kb = new KeyBus(canvas)

kb.simulDown(38, () => console.log('up'))
kb.simulDown(39, () => console.log('right'))

function game_loop() {
  // the only thing you need to do is to call this method in every game loop,
  // the keybus will automatically check if anykey is pressed and run the according handlers (could be more than one)
  kb.executeMultiKeyHandlers();
}
```

Admittedly, under the hood there is still a hashtable. But as a consumer / developer, you are not aware of it, which ease most of the pain when handling this issue.
