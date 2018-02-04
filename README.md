# babel-plugin-transform-object-from-destructuring
Babel plugin that allows you to extract an object/array from a destructuring expression.

## Installation

```sh
$ npm install --save-dev babel-plugin-transform-object-from-destructuring
```

## Why do I need this?
It can be very exhausting when you create an object from a destructuring expression, especially when you have to rename, add or remove a property. With this plugin maintaining such scenarios gets much more easier for you.

### Object example
```javascript
let myObject = {
  test1: "stringTest1",
  test2: "stringTest2",
  test3: "stringTest3"
};
let { test1, test3 } = myObject,
  myTest = { test1, test3 };
```

With this plugin activated you can simply write:
```javascript
let myObject = {
  test1: "stringTest1",
  test2: "stringTest2",
  test3: "stringTest3"
};
let myTest = { test1, test3 } = myObject;
```

### Array example
It also works great with arrays:
```javascript
let myArray = ["stringTest1", "stringTest2", "stringTest3"];
let [ test1, , test3 ] = myArray,
  myTest = [ test1, test3 ];
```

Can be written as follow:
```javascript
let myArray = ["stringTest1", "stringTest2", "stringTest3"];
let myTest = [ test1, , test3 ] = myArray;
```

**Note**: You are not allowed to use a rest spread operator: `let myTest = { test1, ...rest } = myObject`.

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-object-from-destructuring"]
}
```

### Via CLI

```sh
$ babel --plugins transform-object-from-destructuring script.js
```

### Via Node API

```javascript
require('babel').transform('code', {
  plugins: ['transform-object-from-destructuring']
});
```
