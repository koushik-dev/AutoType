(function () {
  var options = {
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
      block: "border-left",
      blinker: "border-left",
      underline: "border-bottom",
    },
    cursorStyle = {
      block: "10px solid black",
      blinker: "3px solid black",
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

  function updateTextNode(text = "") {
    options.elem && (options.elem.innerHTML = text);
  }

  function clearTextNode() {
    options.elem && (options.elem.innerHTML = "");
  }

  function addWord() {
    var i = 1,
      interval = setInterval(function () {
        if (i > options.text.length) {
          clearInterval(interval);
          setTimeout(() => {
            options.elem.dispatchEvent(events.addComplete);
          }, options.timeDelay);
          return;
        }
        updateTextNode(options.text.slice(0, i));
        i++;
      }, options.timeGap);
  }

  function deleteWord() {
    var i = options.text.length,
      interval = setInterval(function () {
        if (i < 0) {
          clearInterval(interval);
          setTimeout(() => {
            options.elem.dispatchEvent(events.deleteComplete);
          }, options.timeDelay);
          return;
        }
        updateTextNode(options.text.slice(0, i));
        i--;
      }, options.timeGap);
  }

  function updateStyle(styles) {
    if (styles) {
      options.elem.style = "";
      Object.keys(styles).map(
        (style) => (options.elem.style[style] = styles[style])
      );
    }
  }

  function getWord() {
    return options.words[options.textIndex]["text"] || "";
  }

  function objectValue(object, key) {
    if (object && object.hasOwnProperty(key)) {
      return object[key];
    }
  }

  function updateCurrentWord() {
    options.textIndex = (options.textIndex + 1) % options.words.length;
    options.text = getWord();
    updateStyle(objectValue(options.words[options.textIndex], "styles"));
    updateCursorHeight(
      objectValue(
        objectValue(options.words[options.textIndex], "styles"),
        "font-size"
      )
    );
  }

  function preRequisites() {
    updateCurrentWord();
    clearTextNode();
  }

  function registerEventListeners() {
    options.elem.addEventListener("addComplete", () => {
      if (options.isAlternate) {
        deleteWord();
      } else {
        if (options.words.length - 1 === options.textIndex && !options.loop) {
          removeElement();
          if (options.showLast) {
            options.childSelector = createAndPrependElement(options.selector);
            updateElement();
            updateTextNode(options.words[options.words.length - 1]["text"]);
          }
        } else {
          preRequisites();
          typeWords();
        }
      }
    });
    if (options.isAlternate) {
      options.elem.addEventListener("deleteComplete", () => {
        if (options.words.length - 1 === options.textIndex && !options.loop) {
          removeElement();
          if (options.showLast) {
            options.childSelector = createAndPrependElement(options.selector);
            updateElement();
            updateStyle(options.words[options.textIndex]["styles"]);
            updateTextNode(options.words[options.words.length - 1]["text"]);
          }
        } else {
          preRequisites();
          typeWords();
        }
      });
    }
  }

  function createAndPrependElement(parentSelector) {
    var spanEl = document.createElement("span");
    spanEl.id = "auto_text_fill_" + Math.floor(Math.random() * 1000);
    document.querySelector(parentSelector).prepend(spanEl);
    return "#" + spanEl.id;
  }

  function removeElement() {
    options.elem.parentNode.removeChild(options.elem);
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

  function updateCursorHeight(height = "20px") {
    height &&
      options.cursorId &&
      (document.querySelector(options.cursorId).style.height = height);
  }

  function clearParentElement(selector) {
    document.querySelector(selector).innerHTML = "";
  }

  function makeParentElement(selector) {
    var parentEl = document.querySelector(selector);
    parentEl.style.display = "flex";
    clearParentElement(selector);
  }

  function typeWords() {
    addWord();
  }

  this.AutoType = function (opts) {
    if (!document.querySelector(opts.selector)) return;
    makeParentElement(opts.selector);
    opts.childSelector = createAndPrependElement(opts.selector);
    opts.words = opts.words.filter((word) => Object.values(word).length);
    updateOptions(opts);
    !options.noCursor && addCursor();
    registerEventListeners();
    preRequisites();
    typeWords();
  };
})();

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
