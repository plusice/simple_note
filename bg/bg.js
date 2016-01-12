// the highlighted text
var textContent = '';



// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    // Create one item for selection context type.
    var contexts = ["selection"];
    for (var i = 0; i < contexts.length; i++) {
        var context = contexts[i];
        var title = '高亮';
        var id = chrome.contextMenus.create({
            "title": title,
            "contexts": [context],
            "id": "context_" + context
        });
    }
});
// listen context click
chrome.contextMenus.onClicked.addListener(onClickHandler);



function onClickHandler(info, tab) {
    var sText = info.selectionText;

    // send to content.js
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        textContent += (sText + '\n\n');
        chrome.tabs.sendMessage(tabs[0].id, {
            selectionText: sText
        }, function(response) {
            // console.log(response.farewell);
        });
    });

};
