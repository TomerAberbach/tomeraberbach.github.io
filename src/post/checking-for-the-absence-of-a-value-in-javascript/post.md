---
title: "Checking for the Absence of a Value in JavaScript"
description: A thorough overview of the right way to check for the absence of a value in JavaScript.
tags:
- code
- javascript
- nodejs
- explainer
links: []
timestamp: 08/16/2018
---
When I first started learning JavaScript I was confused by the seemingly endless ways developers check for the absence of a value:

```js
console.log(value == null)
console.log(value === null)
console.log(value == undefined)
console.log(value === undefined)
console.log(value === undefined || value === null)
console.log(typeof value === 'undefined')
console.log(typeof value == 'undefined')
console.log(typeof value === 'undefined' || value === null)
console.log(typeof value === 'undefined' || value == null)
console.log(typeof value == 'undefined' || value == null)
console.log(typeof value == 'undefined' || value === null)
console.log(!value)
```

Which one is right?

## The Absence of a Value

In order to understand which of these expressions is correct we must first take a look at the two ways JavaScript represents the lack of a value.

### Undefined

`undefined` is one of JavaScript's primitive types which means checking its type using the `typeof` operator returns the string `'undefined'`:

```js
console.log(typeof undefined) // undefined
```

It is the default value of any declared, but unassigned variable:

```js
var x
console.log(x) // undefined
```

It is the value returned when trying to access an undeclared object property:

```js
var obj = {}
console.log(obj.a) // undefined
```

It is the default return value of a function which does not return:

```js
function f() {}
console.log(f()) // undefined
```

It is returned by the `void` operator, an operator which evaluates an expression and then returns `undefined`:

```js
console.log(void 0) // undefined
console.log(void 'hello') // undefined
console.log(void(3 + 2)) // undefined
console.log(void(/* any expression */)) // undefined
```

And lastly, it is not a literal. It is a property of the [global object](https://developer.mozilla.org/en-US/docs/Glossary/Global_object), an object that always exists in the global scope (accessible through the `window` property on browsers).

### Null

`null` is also a JavaScript primitive type, but checking its type using the `typeof` operator does not return what you'd expect:

```js
console.log(typeof null) // object
```

According to [W3Schools](https://www.w3schools.com/js/js_datatypes.asp) you can consider this behavior a bug in JavaScript. `typeof null` should return `'null'`, but since a lot of code has already been written with the assumption that `typeof null` erroneously returns `'object'`, it will not be changed to avoid breaking old code.

Unlike `undefined`, `null` does not show up as a default value anywhere. Instead it is usually returned by functions which are expected to return an object when one could not be retrieved from the given parameters.

For example, in browsers `document.getElementById` returns `null` if no element with the given ID was found in the HTML document:

```js
console.log(document.getElementById('some-id-which-no-element-has')) // null
```

In contrast to `undefined`, `null` *is* a literal. It is not the identifier of some property. It represents a lack of identification.

Based on these characteristics it is safe to say that both `undefined` and `null` represent the absence of a value. Therefore, any code we write which aims to check for the absence of a value should account for both `undefined` and `null`.

## Equality

Now that we understand `undefined` and `null`, we still need to briefly address the difference between `==` and `===` in order to understand the expressions at the beginning of this post.

### Strict

Strict equality is invoked using `===` and is relatively straight forward. If two values, `a` and `b`, are of different types then `a === b` will return `false`. However, if they are of the same type then `true` is returned if their contents match and `false` otherwise:

Examples:
```js
console.log(0 === 0) // true
console.log('hello!' === 'hello!') // true
console.log(null === null) // true
console.log(undefined === undefined) // true

console.log(0 === 5) // false
console.log(0 === '0') // false
console.log(0 === 'hello!') // false
console.log(null === undefined) // false

var obj = {}
console.log(obj === {}) // false (because objects are compared by reference)
console.log(obj === obj) // true (because reference to same object)
```

### Loose

Loose quality is invoked using `==` and often produces unexpected results. If two values, `a` and `b`, are of the same type then `a === b` is returned. However, if they are of different types then JavaScript will attempt to coerce (i.e. convert) the two values to the same type and then strictly equate the two. This second case has prompted the use of loose equality to be largely discouraged by the JavaScript community:

Examples:
```js
console.log(1 == 1) // true
console.log(1 == '1') // true (because the string was converted to a number)
console.log('1' == 1) // true (because the string was converted to a number)
console.log(0 == false) // true (because the boolean was converted to a number)
console.log(0 == null) // false (because absence of a value is never considered equal to a concrete value)
console.log({} == {}) // false (because objects are compared by reference)
console.log(0 == undefined) // false (because absence of a value is never considered equal to a concrete value)
console.log(null == undefined) // true (because both represent the absence of a value)
console.log(undefined == null) // true (because both represent the absence of a value)
console.log("hello!" == false) // false
console.log("" == false) // true (because the string was converted to a boolean and an empty string kind of represents falsity in the realm of strings I guess?)
console.log([] == false) // true (because the array was converted to a boolean and an empty array kind of represents falsity in the realm of array I guess?)
```

If you're feeling confused you wouldn't be the only one. Check out this [operand conversion table](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness#Loose_equality_using) and this [article](https://www.sitepoint.com/javascript-truthy-falsy) about truthy and falsey values if you want to fully understand loose equality. Additionally, if you want a handy reference of how `==` and `===` behave then I would recommend this [link](https://dorey.github.io/JavaScript-Equality-Table/unified).

## Bringing It All Together

It's time to check which of the expressions from the beginning of the post work! Let's take a look at the first expression and write a checklist to evaluate it:

```js
console.log(value == null)
```

 * *Does it return `true` on `undefined`?* Yes, because substituting `undefined` for `value` yields `undefined == null` and as we have learned from the loose equality section, `undefined` and `null` are loosely equal because both represent the absence of a value.
 * *Does it return `true` on `null`?* Yes, because substituting `null` for `value` yields `null == null` which obviously returns `true`.
 * *Does it return `false` on everything else?* Yes, because as we have learned from the loose equality section, `null` is not loosely equal to anything other than itself and `undefined` because the absence of a value is never considered equal to a concrete value.

You may have noticed that `value == undefined` would also work for almost the same reasons. However, `value == null` is safer because the value of `undefined` is not guaranteed to stay constant. Prior to JavaScript version ES5 `undefined` could be reassigned since it's simply a global property and even in the most recent versions of JavaScript `undefined` can be shadowed by a local variable. This could never happen with `null` because it is a literal and that makes it the objectively better choice.

It is worth noting that these issues with `undefined` can be avoided by using the `void` operator instead because it is guaranteed to return the expected value of `undefined`. Most commonly, the expression passed to the `void` operator for this purpose is `0` because `void 0` is short and quick to evaluate. However, I would still not recommend using `value == void 0` in place of `value == null` because it may confuse other programmers (many of which are unfamiliar with the `void` operator), `null` is two characters shorter than `void 0`, and `void 0` may be marginally slower than `null` since `0` must be evaluated before `undefined` is returned.
 
These methods work except for one lurking issue. All of our questions assume that we know for a fact that `value` has been declared and we have access to it. However, if `value` is undeclared our code will throw a `ReferenceError`. This may seem absurd because don't we *always* know if a variable has been declared or not? Unfortunately this is not always the case.

Many JavaScript libraries aim to be platform agnostic. They are designed in such a way which allows them to run in the browser, on the server, or as a Node.js module. In Node.js there is a global variable `module` which can be used to export methods for use in other modules, but on the browser this variable is never declared. Therefore, if we execute `module == null` on Node.js it would return `false`, but on browsers it would throw a `ReferenceError`! One way to handle this issue would be to use `try` `catch` blocks to catch the `ReferenceError` and resume execution in the case we're not running on Node.js:

```js
try {
  value // expression statement will throw a ReferenceError if value is an undeclared variable
  console.log('value is declared') // will log if the previous statement did not throw an error
} catch (err) {
  console.log('value is undeclared') // will log if a ReferenceError was thrown
}
```

Note that if any code following the first statement in the `try` block throws an error for some other reason then the `catch` block would be executed even though `value` was declared. This issue can be avoided by checking that the thrown error was specifically a `ReferenceError` using the `instanceof` operator:

```js
try {
  value
  console.log('value is declared')
  /* some potentially error-throwing code */
} catch (err) {
  if (err instanceof ReferenceError) {
    console.log('value is undeclared')
  } else {
    console.log('Some other error occurred')
  }
}
```

Note that this solution only works if the potentially error-throwing code does not also throw a `ReferenceError` because it would also match the if condition. I cannot think of any reason anyone would do this on purpose. This situation would likely arise due to misspelling the name of a declared variable. For this reason you should try to keep the code in the `try` `catch` blocks as short as possible. The if condition could also be altered to check the `ReferenceError` message `string` for our specific variable `err instanceof ReferenceError && err.message.split(' ')[0] === 'value'`, but I do not recommend it because it assumes your code has misspelled variables names which can and should be debugged and fixed. 

The code with the if condition kept the same is a good solution if you specifically want to check if a variable is declared or not. However, if you want to classify undeclared variables as absent values and lump them in with `undefined` and `null` then fortunately there is a better solution. It turns out that checking the type of an undeclared variable using the `typeof` operator will not throw a `ReferenceError`, but will return the string `'undefined'` instead. This is convenient because checking the type of a declared variable with a value of `undefined` using the `typeof` operator will also return the string `'undefined'`. So the expression `typeof value === 'undefined'` also checks off the first item on our checklist! However, it doesn't take into account if `value` is `null` so we must add an additional check in an or clause:

```js
console.log(typeof value === 'undefined' || value === null)
```

 * *Does it return `true` on when `value` is undeclared?* Yes, because checking the type of an undeclared variable using the `typeof` operator returns the string `'undefined'` which after substituting gives us `'undefined' === 'undefined'` in the first condition which obviously returns `true`, and because the first condition is `true` the expression short-circuits and allows us to avoid the `ReferenceError` which would have been caused by `value === null`. The prevention of the error-throwing code's execution by short-circuiting shows why the order of the two conditions cannot be switched.
 * *Does it return `true` on `undefined`?* Yes, because substituting `undefined` for `value` yields `typeof undefined === 'undefined'` in the first condition, which simplifies to `'undefined' === 'undefined'` and obviously returns `true`.
 * *Does it return `true` on `null`?* Yes, because although substituting `null` for `value` in the first condition fails due to `typeof null === 'undefined'` simplifying to `'object' === 'undefined'`, substituting `null` for `value` in the second condition yields `null === null` which obviously returns `true`.
 * *Does it return `false` on everything else?* Yes, because checking the type of any concrete value using the `typeof` operator will not return `'undefined'` so the first condition returns `false`, and substituting any concrete value in the second condition will also return `false` because `null` is only strictly equal to itself.

This method works in every situation, but it is slower than `value == null`. The optimal strategy is to use this method when you don't know if `value` has been declared and use the previous method when you do. This is the approach taken by CoffeeScript when transpiling its [existential operator](https://coffeescript.org/#existential-operator) to JavaScript.

You may have noticed that a few of the expressions at the beginning of the post look almost identical to the expression we just evaluated. Interestingly enough the following four expressions share the same behavior:

```js
console.log(typeof value === 'undefined' || value === null)
console.log(typeof value === 'undefined' || value == null)
console.log(typeof value == 'undefined' || value == null)
console.log(typeof value == 'undefined' || value === null)
```

So why did we choose the expression with strict equality in both conditions?
 * Strict equality is no slower than loose equality because they both check the operand types.
 * Strict equality is faster than loose equality when the types of the operands differ because it can immediately return `false` without having to coerce the operand types.
 * Loose equality often produces unexpected results and should be avoided if possible. 

The second bullet point makes a strong argument for using strict equality for the second condition because `value` may not be the same type as `null`, but in the first condition both `typeof value` and `'undefined'` are guaranteed to be of type `string` so the decision to use strict equality is only supported by the first and third bullet points. This makes the first expression above the best choice.

Lastly, let's evaluate the rest of the expressions from the beginning of the post:

```js
console.log(value === null) // doesn't account for undefined
console.log(value === undefined) // doesn't account for null
console.log(value === undefined || value === null) // works, but is simply a slower version of value == null and value == undefined
console.log(typeof value === 'undefined') // doesn't account for null
console.log(typeof value == 'undefined') // doesn't account for null
console.log(!value) // erroneously returns true for falsey values such as false, '', [], 0, etc.
```

## Object Properties

When checking for the absence of a value in an object property, additional considerations must be made regarding the property itself. Consider the following example where we use `value == null` to check for the absence of a value in each object's `key` property:

```js
var obj1 = {}
var obj2 = {
  key: undefined
}

console.log(obj1.key == null) // true
console.log(obj2.key == null) // true
```

An object without a `key` property produces the same result as an object with its `key` property set to a value of `undefined`. This is because in contrast to undeclared variables, trying to access the value of an undeclared *property* always returns `undefined`. This means that `value == null` is a good solution if you want to classify undeclared properties as absent values and lump them in with `undefined` and `null`. However, if you specifically want to check if a property is declared or not then a different method must be used.

One way is to use the `in` operator:

```js
var obj1 = {}
var obj2 = {
  key: undefined
}

console.log('key' in obj1) // false
console.log('key' in obj2) // true
```

Note that a `string` or `Symbol` containing the property name must be used on the lefthand side of the `in` operator, not a token. This may seem like a good solution, but consider the following case:

```js
var obj1 = {}
var obj2 = {
  constructor: undefined
}

console.log('constructor' in obj1) // true
console.log('constructor' in obj2) // true
```

Probably not what you expected right? The expression `'constructor' in obj1` returns `true` because the `constructor` property was inherited from the [object's prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype). This means that the `in` operator considers both the specific properties of the object as well as inherited properties.

Fortunately, there is a way to check just the specific uninherited properties of the object using the `hasOwnProperty` method, which itself is inherited from the `Object` constructor, or class in object oriented terms:

```js
var obj1 = {}
var obj2 = {
  constructor: undefined
}

console.log(obj1.hasOwnProperty('constructor')) // false
console.log(obj2.hasOwnProperty('constructor')) // true
```

Note that unlike the `in` operator, the `hasOwnProperty` method can only take a `string` argument. There is one caveat to using the `hasOwnProperty` method. Consider the following case:

```js
var obj = {
  hasOwnProperty: function () {
    return true
  }
}

console.log(obj.hasOwnProperty('wow')) // true
```

The `hasOwnProperty` method of the `Object` constructor was shadowed, or overridden in object oriented terms, by a method which always returns `true`. Accessing properties always prefers uninherited to inherited ones which is why `true` was returned for the name of an undeclared property. Fortunately there is a way around this. The `hasOwnProperty` method can be accessed directly from the `Object` constructor and called with `this` as a specified value using the `call` method of the `Function` constructor. The `call` method takes the value of `this` as its first argument and the arguments to the called function as the rest of its arguments:

```js
var obj = {
  hasOwnProperty: function () {
    return true
  }
}

console.log(Object.prototype.hasOwnProperty.call(obj, 'wow')) // false
```

If you find yourself using this method more than once I would recommend extracting it out as a function:

```js
function hasOwnProperty(obj, property) {
  return Object.prototype.hasOwnProperty.call(obj, property)
}

var obj = {
  hasOwnProperty: function () {
    return true
  }
}

console.log(hasOwnProperty(obj, 'wow')) // false
```

## Conclusion

To recap here are the optimal expressions.

Checking if a variable is declared:

```js
try {
  value
  // value is declared
} catch (err) {
  if (err instanceof ReferenceError) {
    // value is undeclared
  } else {
    // some other error occurred
  }
}
```

Checking for the absence of an uninherited property in an object when the object definitely doesn't have a shadowing `hasOwnProperty` property:

```js
!obj.hasOwnProperty(key)
```

Checking for the existence of an uninherited property in an object when the object definitely doesn't have a shadowing `hasOwnProperty` property:

```js
obj.hasOwnProperty(key)
```

Checking for the absence of an uninherited property in an object when the object may have a shadowing `hasOwnProperty` property:

```js
!Object.prototype.hasOwnProperty.call(obj, key)
```

Checking for the existence of an uninherited property in an object when the object may have a shadowing `hasOwnProperty` property:

```js
Object.prototype.hasOwnProperty.call(obj, key)
```

Checking for the absence of an inherited or uninherited property in an object:

```js
!(key in obj)
```

Checking for the existence of an inherited or uninherited property in an object:

```js
key in obj
```

Checking for the absence of a value when the value may be an undeclared variable:

```js
typeof value === 'undefined' || value === null
```

Checking for the existence of a value when the value may be an undeclared variable (derived using [De Morgan's Law](https://en.wikipedia.org/wiki/De_Morgan%27s_laws#Negation_of_a_disjunction)):

```js
typeof value !== 'undefined' && value !== null
```

Checking for the absence of a value when the value is definitely declared:

```js
value == null
```

Checking for the existence of a value when the value is definitely declared:

```js
value != null
```

Checking for the absence of a value when the value is definitely declared and you want to avoid loose equality:

```js
value === null || value === void 0
```

Checking for the existence of a value when the value is definitely declared and you want to avoid loose equality (derived using [De Morgan's Law](https://en.wikipedia.org/wiki/De_Morgan%27s_laws#Negation_of_a_disjunction)):

```js
value !== null && value !== void 0
```

Feel free to use combinations of these to fit your needs. For example, here's how you would check if an object has an uninherited property which has an absent value such as `undefined` or `null` when the object definitely doesn't have a shadowing `hasOwnProperty` property:

```js
obj.hasOwnProperty(key) && obj[key] == null
```

Thank you for reading!
