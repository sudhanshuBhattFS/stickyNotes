

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'contentScriptInjected') {

        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            if (tabs.length > 0) {
                const activeTab = tabs[0];
                const hostName = new URL(activeTab.url).hostname;

                // Retrieve the stored notes
                const noteArr = await UserLocalStorage.retriveNoteData();

                if (noteArr.length > 0) {
                    noteArr.forEach((element) => {
                        if (element.hostName === hostName && element.enablePin && element.url === activeTab.url) {

                            chrome.tabs.sendMessage(activeTab.id, {
                                message: "injectPopUps",
                                noteData: element,
                            });
                        }
                    });
                }
            }
        });
    }
});

// Listen for tab URL updates (e.g., navigating to a different page in the same tab)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {


    if (changeInfo.status === 'complete') {
        const hostName = new URL(tab.url).hostname;
        const url = new URL(tab.url);

        // Retrieve the stored notes
        const noteArr = await UserLocalStorage.retriveNoteData();
        const errorURLs = [
            'chrome://newtab/', // Add more URLs here if needed
        ];

        // Check if the URL matches any in the errorURLs list
        if (errorURLs.includes(url.href)) {
            chrome.action.setPopup({ tabId: tabId, popup: '../../stickyNote_html_page/error.html' });
            return; // Exit function to prevent further actions
        }

        if (tab && tab.title.includes('StickyNotes')) {
            chrome.action.setPopup({ tabId: tabId, popup: '../../stickyNote_html_page/error.html' });

        }

        if (noteArr.length > 0) {
            noteArr.forEach((element) => {
                if (element.hostName === hostName && element.enablePin) {

                    chrome.tabs.sendMessage(tabId, {
                        message: "injectPopUps",
                        noteData: element,
                    });
                }
            });
        }
    }
});
