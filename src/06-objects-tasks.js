/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class BuilderCss {
  constructor() {
    this.storage = {
      element: [],
      id: [],
      class: [],
      attr: [],
      pseudoClass: [],
      pseudoElement: [],
      combination: [],
    };

    this.errorDuplicates = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.errorWrongOrder = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
  }

  checkFilledSelectorsAfter(selector) {
    const storageKeys = Object.keys(this.storage);

    return storageKeys.slice(storageKeys.findIndex((item) => item === selector) + 1)
      .some((key) => this.storage[key].length);
  }

  element(value) {
    if (this.storage.element.length) throw new Error(this.errorDuplicates);
    if (this.checkFilledSelectorsAfter('element')) throw new Error(this.errorWrongOrder);

    this.storage.element.push(value);

    return this;
  }

  id(value) {
    if (this.storage.id.length) throw new Error(this.errorDuplicates);
    if (this.checkFilledSelectorsAfter('id')) throw new Error(this.errorWrongOrder);

    this.storage.id.push(`#${value}`);

    return this;
  }

  class(value) {
    if (this.checkFilledSelectorsAfter('class')) throw new Error(this.errorWrongOrder);

    this.storage.class.push(`.${value}`);

    return this;
  }

  attr(value) {
    if (this.checkFilledSelectorsAfter('attr')) throw new Error(this.errorWrongOrder);

    this.storage.attr.push(`[${value}]`);

    return this;
  }

  pseudoClass(value) {
    if (this.checkFilledSelectorsAfter('pseudoClass')) throw new Error(this.errorWrongOrder);

    this.storage.pseudoClass.push(`:${value}`);

    return this;
  }

  pseudoElement(value) {
    if (this.storage.pseudoElement.length) throw new Error(this.errorDuplicates);
    if (this.checkFilledSelectorsAfter('pseudoElement')) throw new Error(this.errorWrongOrder);

    this.storage.pseudoElement.push(`::${value}`);

    return this;
  }

  stringify() {
    const element = this.storage.element.join('');
    const elementId = this.storage.id.join('');
    const elementClass = this.storage.class.join('');
    const elementAttr = this.storage.attr.join('');
    const elementPseudoClass = this.storage.pseudoClass.join('');
    const elementPseudoElement = this.storage.pseudoElement.join('');

    return `${element}${elementId}${elementClass}${elementAttr}${elementPseudoClass}${elementPseudoElement}`;
  }
}

const cssSelectorBuilder = {
  combination: null,

  element(value) {
    return new BuilderCss().element(value);
  },

  id(value) {
    return new BuilderCss().id(value);
  },

  class(value) {
    return new BuilderCss().class(value);
  },

  attr(value) {
    return new BuilderCss().attr(value);
  },

  pseudoClass(value) {
    return new BuilderCss().pseudoClass(value);
  },

  pseudoElement(value) {
    return new BuilderCss().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    this.combination = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;

    return this;
  },

  stringify() {
    return this.combination;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};