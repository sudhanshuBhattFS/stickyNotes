

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

const getNoteData = (url) => {
    // get date and time 
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    const hostName = new URL(url).hostname
    const timestamp = now.getTime(); // High-resolution timestamp
    const randomComponent = Math.random().toString(36).substring(2, 15); // Random string
    const uniqueId = `${timestamp}-${randomComponent}`; // Combine timestamp and random string

    return {
        id: uniqueId,
        date: dateStr,
        time: timeStr,
        hostName: hostName,
        url: url,
        content: ''
    };
}


// one way communication between background and content script
chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        if (request.greeting === "hello") {
            sendResponse({ farewell: "goodbye" });
        } else if (request.action == "storeNoteData") {

            // get id 
            const noteData = getNoteData(request.url)

            // send request 
            sendResponse({ id: noteData.id });

            // update data 
            const noteArr = await retriveData()
            noteArr.push(noteData)
            chrome.storage.local.set({ notes: noteArr });

        } else if (request.action === 'createTabAndInject') {
            chrome.tabs.create({ url: chrome.runtime.getURL('./stickyNote_html_page/index.html') });
        } else if (request.action === 'filterLocalStorage') {
            const id = request.id;
            const StoredNotes = await retriveData();

            // Filter out the note with the matching ID
            const newArray = StoredNotes.filter((note) => note.id !== id);

            // Save the updated array back to local storage
            chrome.storage.local.set({ notes: newArray });

            // Optionally, send a response back if needed
            sendResponse({ success: true });
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











