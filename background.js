const retriveData = async () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get('notes', function (result) {
            if (result.notes) {
                resolve(result.notes);
            } else {
                resolve([]);
            }
        });
    });
}


// one way communication between background and content script
chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        console.log({ request, sender, sendResponse })
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting === "hello") {
            sendResponse({ farewell: "goodbye" });
        } else if (request.action == "storeNoteData") {
            const url = request.data

            // get date and time 
            const now = new Date();
            const dateStr = now.toLocaleDateString();
            const timeStr = now.toLocaleTimeString();
            const hostName = new URL(url).hostname

            const noteData = { date: dateStr, time: timeStr, hostName: hostName, url: url, content: '' }
            const id = `${noteData.hostName}-${noteData.date.replace(/\//g, '-')}-${noteData.time.replace(/:/g, '-').replace(' PM', '-PM').replace(' AM', '-AM')}`;

            sendResponse({ id: id });
            const noteArr = await retriveData()
            noteArr.push(noteData)
            // set local storage 
            chrome.storage.local.set({ notes: noteArr });
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









