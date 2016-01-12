var textarea = document.getElementById('popUp_textarea');
textarea.value = chrome.extension.getBackgroundPage().textContent;

textarea.onchange = function() {
    chrome.extension.getBackgroundPage().textContent = this.value;
}

