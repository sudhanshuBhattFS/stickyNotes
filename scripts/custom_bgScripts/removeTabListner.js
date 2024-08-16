// Object to store tab URLs
let tabUrls = {};

// Listen for tab updates to store the URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url) {
        tabUrls[tabId] = tab.url; // Store the tab's URL
    }
});

// Listen for tab closures
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    const closedTabUrl = tabUrls[tabId]; // Retrieve the stored URL for the closed tab
    delete tabUrls[tabId]; // Clean up the stored URL

    const allNotes = await UserLocalStorage.retriveNoteData(); // Retrieve all notes from local storage

    // Filter the notes: remove the one with the matching URL and empty content
    const updatedNotes = allNotes.filter(note => {
        // Keep the note if it does NOT match the closed tab URL or its content is not empty
        return !(note.url === closedTabUrl && note.content.trim() === "");
    });

    // Update the local storage with the filtered notes array
    await UserLocalStorage.setStorage(updatedNotes);

    console.log(`Notes updated after closing tab with URL: ${closedTabUrl}. Remaining notes: ${updatedNotes.length}`);
});

