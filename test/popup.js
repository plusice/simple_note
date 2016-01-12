
// highlight the current selection
function surround() {
    var selection = window.getSelection();
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
        var style = [
            'background-color: #f00',
            'color: #0f0'
        ];

        surrounder = document.createElement("span");
        surrounder.className = 'simple-note-highlight';
        surrounder.style = style.join(';');
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

