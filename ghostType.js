let options = {
    text: "",
    speed: 500,
    reverse: true,
    loop: true,
    cursor: true,
    cursorType: "blinker",
    cursorId: "",
    cursorAnimate: true,
    showLast: true,
    timeDelay: 0,
    childSelector: "",
  },
  cursorStyle = {
    block: "width: 10px",
    blinker: "border-left: 5px solid",
    underline: "bottom: 0; width: 20px; border-bottom: 2px solid",
  },
  CONSTANTS = {
    TEXT: 'text',
    CLASSNAME: 'className'
  };

function updateTextNode(i) {
  if(i < 1) {
    this.childEl.removeChild(this.cursorEl)
  } else if (i === 1) {
    this.childEl.append(this.cursorEl)
  }
  this.childEl.childNodes.forEach(node => {
    if (node.nodeType === 3) {
      node.nodeValue = this.text.slice(0, i);
    }
  })
}

// type the word by letters
function typeWord() {
  return new Promise((resolve) => {
    let letterIndex = 1, _reverse = false,
      interval = setInterval(() => {
        updateTextNode.call(this, letterIndex)
        if (letterIndex === this.text.length)
          this.reverse ? (_reverse = true) : (letterIndex = 0);
        // no if-else because if 'no reverse' need to clear interval
        if (letterIndex === 0) {
          clearInterval(interval);
          resolve();
        }
        _reverse ? letterIndex-- : letterIndex++
      }, this.speed || 500)
  });
}

// function updateStyle(styles) {
//   if (styles) {
//     options.elem.style = "";
//     options.elem.style.lineHeight = "1";
//     Object.keys(styles).map(
//       (style) => (options.elem.style[style] = styles[style])
//     );
//   }
// }

function getValue(obj = {}, key) {
  if (obj.hasOwnProperty(key)) return obj[key];
  return ''
}

function removeElement() {
  this.parentEl.removeChild(this.childEl);
}

function addCursor() {
  var cursorEl = document.createElement("span");
  cursorEl.id = "auto_text_fill_cursor_" + Math.floor(Math.random() * 1000);
  cursorEl.className = "cursor";
  // this.cursorAnimate &&
  //   (cursorEl.style.animationDuration =
  //     (this.cursorDuration || (500)) + "ms");
  cursorEl.style.cssText = cursorStyle[this.cursorType];
  this.cursorEl = cursorEl;
}

function removeCursor() {
  document
    .querySelector(options.selector)
    .removeChild(document.querySelector(options.cursorId));
}

function updateCursorHeight() {
  options.cursorId &&
    (document.querySelector(options.cursorId).style.height = "auto");
}

function updateCursorWidth() {
  document.querySelector(options.cursorId).style.width = getComputedStyle(
    options.elem
  ).fontSize;
}

function makeParentElement() {
  clearParentElement.apply(this);
}

function clearParentElement() {
  this.parentEl.innerHTML = "";
}

function createAndPrependElement() {
  var spanEl = document.createElement("span");
  spanEl.id = "auto_text_fill_" + Math.floor(Math.random() * 1000);
  
  spanEl.style.display = 'inline-block';
  // for cursor alignment
  spanEl.style.position = 'relative';
  
  spanEl.append(document.createTextNode(''));
  this.parentEl.prepend(spanEl);
  return document.querySelector("#" + spanEl.id)
}

async function typeWords() {
  for(let i = 0; i < this.words.length; i++) {
    this.text = getValue(this.words[i], CONSTANTS.TEXT)

    //add class name to the element
    this.childEl.classList = Array.of(getValue(this.words[i], CONSTANTS.CLASSNAME))

    // for cursor
    let childStyle = getComputedStyle(this.childEl);
    this.cursorEl.style[this.cursorType === 'underline' ? 'width' : 'height'] = childStyle.lineHeight;
    this.cursorEl.style.backgroundColor = childStyle.color;
    this.cursorEl.style.borderColor = childStyle.color;

    await typeWord.apply(this);
    // loop again from start
    (this.loop && i === this.words.length -1) && (i = -1)
  }
}

let GhostType = function (selector, opts) {
  if (!document.querySelector(selector)) return;

  let scope = {
    ...options,
    ...opts,
    parentEl : document.querySelector(selector)
  };

  // Clean the parent element
  makeParentElement.apply(scope);

  // Create and append the span element
  scope.childEl = createAndPrependElement.apply(scope);
  
  scope.words = opts.words.filter((word) => Object.values(word).length);
  scope.cursor && addCursor.apply(scope);
  typeWords.apply(scope);
};
