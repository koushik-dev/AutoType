let options = {
    text: "",
    timeGap: 500,
    timeDelay: 0,
    isAlternate: true,
    loop: true,
    showLast: true,
    childSelector: "",
    noCursor: false,
    cursor: "blinker",
    cursorId: "",
    cursorAnimate: true,
  },
  events = {
    addComplete: new Event("addComplete"),
    deleteComplete: new Event("deleteComplete"),
  },
  cursorType = {
    block: "background-color",
    blinker: "border-left",
    underline: "border-bottom",
  },
  cursorStyle = {
    block: "black",
    blinker: "5px solid black",
    underline: "2px solid black",
  };

function updateOptions(opts) {
  options = {
    ...options,
    ...opts,
    textIndex: -1,
    text: "",
    elem: document.querySelector(opts.childSelector),
  };
}

function updateTextNode(i) {
  this.childEl.innerHTML = this.text.slice(0, i);
}

function clearTextNode() {
  this.childEl.innerHTML = "";
}

function addWord() {
  var i = 1,
    interval = setInterval(() => {
      if (i > this.text.length) {
        clearInterval(interval);
        setTimeout(() => {
          this.childEl.dispatchEvent(events.addComplete);
        }, this.timeDelay || 0);
        return;
      }
      updateTextNode.apply(this, [i]);
      i++;
    }, (this.timeGap || 500));
}

function deleteWord() {
  var i = this.text.length,
    interval = setInterval(() => {
      if (i < 0) {
        clearInterval(interval);
        setTimeout(() => {
          this.childEl.dispatchEvent(events.deleteComplete);
        }, (this.timeDelay || 0));
        return;
      }
      updateTextNode.apply(this, [i]);
      i--;
    }, (this.timeGap || 500));
}

function updateStyle(styles) {
  if (styles) {
    options.elem.style = "";
    options.elem.style.lineHeight = "1";
    Object.keys(styles).map(
      (style) => (options.elem.style[style] = styles[style])
    );
  }
}

function getWord() {
  return this.words[this.textIndex]["text"] || "";
}

function objectValue(object, key) {
  if (object && object.hasOwnProperty(key)) {
    return object[key];
  }
}

function updateCurrentWord() {
  this.textIndex = (this.textIndex + 1) % this.words.length;
  this.text = getWord.apply(this);
  // updateStyle(objectValue(options.words[options.textIndex], "styles"));
  // updateCursorWidth();
  // updateCursorHeight();
}

function preRequisites() {
  updateCurrentWord.apply(this);
  clearTextNode.apply(this);
}

function registerEventListeners() {
  this.childEl.addEventListener("addComplete", () => {
    if (this.isAlternate) {
      deleteWord.apply(this);
    } else {
      if (this.words.length - 1 === this.textIndex && !this.loop) {
        // removeElement();
        if (this.showLast) {
          this.childSelector = createAndPrependElement.apply(this);
          updateElement();
          updateTextNode(this.words[this.words.length - 1]["text"]);
        }
      } else {
        preRequisites.apply(this);
        typeWords.apply(this);
      }
    }
  });
  if (this.isAlternate) {
    this.childEl.addEventListener("deleteComplete", () => {
      if (this.words.length - 1 === this.textIndex && !this.loop) {
        removeElement.apply(this);
        if (this.showLast) {
          this.childSelector = createAndPrependElement(this.selector);
          updateElement();
          updateStyle(this.words[this.textIndex]["styles"]);
          updateCursorWidth();
          updateTextNode(this.words[this.words.length - 1]["text"]);
        }
      } else {
        preRequisites.apply(this);
        typeWords.apply(this);
      }
    });
  }
}

function removeElement() {
  this.parentEl.removeChild(this.childEl);
}

function updateElement() {
  options.elem = document.querySelector(options.childSelector);
}

function addCursor() {
  var cursorEl = document.createElement("span");
  cursorEl.id = "auto_text_fill_cursor_" + Math.floor(Math.random() * 1000);
  cursorEl.className = "cursor";
  options.cursorAnimate &&
    (cursorEl.style.animationDuration =
      (options.cursorDuration || options.timeGap) + "ms");
  cursorEl.style[cursorType[options.cursor]] = cursorStyle[options.cursor];
  options.cursorId = "#" + cursorEl.id;
  document.querySelector(options.selector).appendChild(cursorEl);
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
  this.parentEl.style.display = "inline-flex";
  clearParentElement.apply(this);
}

function clearParentElement() {
  this.parentEl.innerHTML = "";
}

function createAndPrependElement() {
  var spanEl = document.createElement("span")
  spanEl.id = "auto_text_fill_" + Math.floor(Math.random() * 1000)
  this.parentEl.prepend(spanEl)
  return document.querySelector("#" + spanEl.id)
}

function typeWords() {
  addWord.apply(this);
}

let GhostType = function (selector, opts) {
  if (!document.querySelector(selector)) return;

  let scope = {
    ...opts,
    parentEl : document.querySelector(selector),
    textIndex: -1
  };

  // Clean the parent element
  makeParentElement.apply(scope);

  // Create and append the span element
  scope.childEl = createAndPrependElement.apply(scope);
  
  scope.words = opts.words.filter((word) => Object.values(word).length);
  // updateOptions(opts);
  // !options.noCursor && addCursor();
  registerEventListeners.apply(scope);
  preRequisites.apply(scope);
  typeWords.apply(scope);
};

/*
new AutoType({
  selector: "div",
  words: [
    {
      text: "Developer",
      styles: { color: "red", "font-size": "24px" }
    },
    {
      text: "Designer",
      styles: { color: "blue" }
    }
  ],
  timeGap: 100,
  timeDelay: 0,
  cursorDuration: 300,
  isAlternate: true,
  loop: true,
  showLast: true,
  cursor: "blinker",
  cursorAnimate: true
});
*/
