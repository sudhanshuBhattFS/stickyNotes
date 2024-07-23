
// one way communication between background and content script
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log({ request, sender, sendResponse })
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting === "hello") {
            sendResponse({ farewell: "goodbye" });
        }
    }
);

// auto refresh
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install" || details.reason == "update") {
        // Function to refresh all tabs
        function refreshAllTabs() {
            chrome.tabs.query({}, function (tabs) {
                tabs.forEach(function (tab) {
                    chrome.tabs.reload(tab.id);
                });
            });
        }

        // Refresh all tabs when extension is refreshed
        refreshAllTabs();
    }
});


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log({ message })
//     if (message.action === "createStickyNote") {
//         chrome.windows.create({
//             url: chrome.runtime.getURL("note/note.html"),
//             type: "popup",
//             width: 300,
//             height: 300
//         });
//     }
// });

// a listner should be in background.js if not result in error
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.action === 'my_action') {
//         console.log(request.data); // prints "hello"
//     }

// });







