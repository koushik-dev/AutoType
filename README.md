# GhostType
Ghost type is a javascript plugin. Automatically type and delete the text letter by letter.

# Features
 - Set text typing speed.
 - Set time delay after completing each word.
 - Enable / Disable cursor.
 - Set type of cursor.
 - Enable / Disable cursor animation.
 - Specify individual css for each word in the array.
 - Enable / Disable the delete after each word.
 - To loop the words or not.

 # How to use

Add the script and css files to your webpage.

Initialize the plugin by `new` keyword.

    new GhostType()

the constructor needs an parent element to build the ghost type feature. Provide the holder element `id`, `classname` or `tagname` (If no same tags are in the document).

    new GhostType('#parent_container', {})

The contructor will get a following object which contains the options for the ghost typing. Using options, can control the speed of the typing, color, background color,  fontsize and font-weight of the text that is being typed. And also the cursor can be changed.

The cursor comes with three predefined styles `normal`, `block` and `underline`.

    new GhostType(".change-text",{
        speed: 300,
        reverse: true,
        loop: true,
        cursorType: 'block',
        words: [
          {
            text: 'First Word',
            className: 'bg-pink-300 font-hairline'
          },
          {
            text: 'Second word'
          },
          {
            text: 'Third word',
            className: 'bg-green-300 underline'
          }
        ]
      });
