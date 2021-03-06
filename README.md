# Orbit System

This orbit system is an es6 class that simulates orbiting planets or bodies.

## Installation

with webpack

```bash
yarn add @meteora-digital/orbit
```

## HTML Usage

```html
<canvas class="canvas-orbit"></canvas>
```

```css
.canvas-orbit {
  width: 100vw;
  height: 100vh;
}
```

```javascript
import OrbitSystem from '@meteora-digital/orbit';

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const System = new OrbitSystem(document.querySelector('canvas.canvas-orbit'));

for (var i = 0; i < 30; i++) {
  let mass = random(300,500);
  let radius = mass / 100;

  System.createBody({
    x: random(0,window.innerWidth),
    y: random(0, window.innerHeight),
    mass: mass,
    radius: radius,
  });
}

System.start();
```


## OrbitSystem Arguments

| Argument | Type | Description |
|----------|------|-------------|
| 1 | Dom Element | The canvas we want to draw our system in |
| 2 | Object | Options | Determines global settings for our system |

## OrbitSystem Options

```Gravity```

determines the global gravity force.

```javascript

{
  gravity: 1,
}

```

# OrbitSystem Methods

```createBody```

Creates a new body in the system

```javascript

System.createBody({
  x: random(0,window.innerWidth),
  y: random(0, window.innerHeight),
  mass: mass,
  radius: radius,
});

```

```start```

Begins the system

```javascript

System.start();

```

```stop```

Stops the system

```javascript

System.stop();

```

## Body Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| x | Number | X Coordinate to place the body | 0 |
| y | Number | Y Coordinate to place the body | 0 |
| v | Number | Initial velocity of the body | 0 |
| angle | Number | The initial angle the body is moving | 0 |
| mass | Number | How attractive this body is | 1 |
| radius | Number | The size of our body | 5 |
| boundary | Number | Radius of interactive area | true |
| color | string | Colour of the body | '#000000' |
| trail | number | Length of our trails - limit this depending on computer memory | 0 |
| mobile | Boolean | Controls the mobility of the body | true |

## Inspired by
[guest73's YouTube Video](https://youtu.be/p2quAZ5fVdA)

## License
[MIT](https://choosealicense.com/licenses/mit/)

