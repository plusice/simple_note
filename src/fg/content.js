var currentWindow = window;
// var iframes = document.getElementsByTagName('iframe');



// listen to bg.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.selectionText) {
        surround();
    }
    // sendResponse({
    //     farewell: "goodbye"
    // });
});



// add style
addStylesheetRules([
    ['.simple-note-highlight',
        ['color', '#000', true],
        ['background-color', '#0ff']
    ]
]);
// set current window when mousedown
// for (var i = iframes.length - 1; i >= 0; i--) {
//     iframes[i].addEventListener('mousedown', function(e) {
//         currentWindow = this.contentWindow;
//         e.stopPropagation();
//     });
// };
// window.addEventListener('mousedown', function(e) {
//     currentWindow = this;
// });



/**
 * highlight the current selection
 */
function surround() {
    var selection = currentWindow.getSelection();
    var range = selection.getRangeAt(0);
    var srcRangeData = {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset
    };

    // if range is in single node
    if (range.startContainer === srcRangeData.endContainer) {
        surroundRange(range);
        return true;
    }

    setRangeStartNode(range);
    var surrounder = surroundRange(range);
    var goOn = true;
    while (goOn) {
        goOn = moveRangeNextNode(range, surrounder, srcRangeData);
        surrounder = surroundRange(range);
    }



    // let range surround the start node
    function setRangeStartNode(range) {

        var startContainer = range.startContainer;
        var length = startContainer.length;

        range.setEnd(startContainer, length);

    }

    // surround the range with span
    function surroundRange(range) {
        var surrounder = null;

        surrounder = document.createElement("span");
        surrounder.className = 'simple-note-highlight';
        range.surroundContents(surrounder);
        return surrounder;

    }

    /**
     * move range to next node
     * @param  {Range}    range         current range
     * @param  {Node}     currentNode   current node
     * @param  {Object}   endData       the data of selection end
     * @return {boolean}                nextNode != endData.endContainer
     */
    function moveRangeNextNode(range, currentNode, endData) {
        var nextNode = getNextNode(currentNode);

        range.setStart(nextNode, 0);
        if (nextNode == endData.endContainer) {
            range.setEnd(nextNode, endData.endOffset);
            return false;

        } else {
            // if next node is not text node,find the text node in it
            if (nextNode.nodeType != 3) {
                nextNode = getTextNode(nextNode);
            }
            // the text node maybe the end
            if (nextNode == endData.endContainer) {
                range.setEnd(nextNode, endData.endOffset);
                return false;
            } else {
                range.setEnd(nextNode, nextNode.length);
                return true;
            }
        }

        // get next node width content,next Node may be element
        function getNextNode(node) {
            console.log(node)
            var currentNode = node;
            // do not use nextElementSibling, nextElementSibling always returns element,instead of text node
            var nextNode = currentNode.nextSibling;

            while (nextNode === null || nextNode.textContent.trim() == '') {
                if (nextNode === null) {
                    currentNode = currentNode.parentNode;
                    nextNode = currentNode.nextSibling;
                } else {
                    nextNode = nextNode.nextSibling;
                }
            }

            return nextNode;
        }

        // get text node in element node
        function getTextNode(node) {

            var textNode = null,
                childNodes = node.childNodes;
            for (var i = 0, max = childNodes.length; i < max; i++) {
                if (childNodes[i].nodeType == 3) {
                    textNode = childNodes[i];
                    break;
                }
            };

            // i am lazy,if there is no textnode in node,just use it self
            if (textNode != null) {
                return textNode;
            } else {
                return node;
            }

        }
    }
}

/**
 * Add a stylesheet rule to the document
 * from developer.mozilla.org
 * @example
    addStylesheetRules([
      ['h2', // Also accepts a second argument as an array of arrays instead
        ['color', 'red'],
        ['background-color', 'green', true] // 'true' for !important rules
      ],
      ['.myClass',
        ['background-color', 'yellow']
      ]
    ]);
 */
function addStylesheetRules(rules) {
    var styleEl = document.createElement('style'),
        styleSheet;

    // Append style element to head
    document.head.appendChild(styleEl);

    // Grab style sheet
    styleSheet = styleEl.sheet;

    for (var i = 0, rl = rules.length; i < rl; i++) {
        var j = 1,
            rule = rules[i],
            selector = rules[i][0],
            propStr = '';
        // If the second argument of a rule is an array of arrays, correct our variables.
        if (Object.prototype.toString.call(rule[1][0]) === '[object Array]') {
            rule = rule[1];
            j = 0;
        }

        for (var pl = rule.length; j < pl; j++) {
            var prop = rule[j];
            propStr += prop[0] + ':' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
        }

        // Insert CSS Rule
        styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
    }
}
