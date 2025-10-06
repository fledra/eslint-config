// eslint-disable-next-line no-console
const log = console.log;

const err = new Error('x');

function r(hi) {
  log({ hi });
}

r();

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // Define a method within the class
  sayHello() {
    log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
  }
}

// Create an array of objects
const people = [
  new Person('Alice', 30),
  new Person('Bob', 25),
  new Person('Charlie', 35),
];

// Use the forEach method to iterate over the array
people.forEach((person) => {
  person.sayHello();
});

if (people.length != 2) {
  throw err;
}

people.forEach((person) => {
  log(JSON.stringify(person.name));
});

const { name, age } = people[0];
log(`First person in the array is ${name} and they are ${age} years old.`, multilineString);

const arr = [['foo'], 'bar'];

const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4, 5];
log(newNumbers);

const x = (n) => n;
const x2 = (n) => n;

x2 ('1');

function r1(a, b, c, d, e, f, g, h) {
  return {
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
  };
}

r1('xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx', 'xxx');

// Use a template literal to create a multiline string
const multilineString = `
  This is a multiline string
  that spans multiple lines.
`;

function foobar(bar, baz) {}

function foo(bar, baz) {}

function foobar2(bar, baz) {}

let baz; // TODO:
function m(foo) {
  return (bar) =>
    baz;
} // here

class C {
  field;

  method() {
    // code
  }

  static {
    // code
  }
}

if (baz) foobar2(1, 2);

let foox, barx, baxaz;

try {
  // Attempt to parse an invalid JSON string
  JSON.parse('invalid JSON');
} catch (error) {
  console.error('Error parsing JSON:', error.message);
}

const isEven = (num) => num % 2 === 0;
const number = 7;

log(`${number} is ${isEven(number) ? 'even' : 'odd'}.`);

setTimeout(() => {
  log('This code runs after a delay of 2 seconds.');
}, 2 * 1000);

let a, b, c, d;

if (a
  || b
  || c || d
  || (d && b)
) {
  foo();
}

const abc = { a, c, d };
