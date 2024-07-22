document.addEventListener('DOMContentLoaded', function () {

    const saveButton = document.getElementById('save');
    const noteContainer = document.getElementById('notesContainer')
    const addBtn = document.getElementById('add-note')
    const removeAllBtn = document.getElementById('removeAll')

    let currentUrl = ''

    // first get the tab url
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        currentUrl = new URL(tabs[0].url).hostname;

    });



    // allow the user to create multiple text areas
    addBtn.addEventListener('click', () => {

        // send message to this js to background js 
        // chrome.runtime.sendMessage({ action: 'createStickyNote' });

        // in this example we have send a message to this js file to content js 
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, { "message": "start" });
        });

        // chrome.runtime.sendMessage({ action: 'my_action', data: 'hello' });

    });




});
