

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
            const noteArr = await UserLocalStorage.retriveNoteData()
            noteArr.push(noteData)
            chrome.storage.local.set({ notes: noteArr });

        } else if (request.action === 'createTabAndInject') {
            chrome.tabs.create({ url: chrome.runtime.getURL('./stickyNote_html_page/index.html') });
        } else if (request.action === 'filterLocalStorage') {
            const id = request.id;
            const StoredNotes = await UserLocalStorage.retriveNoteData()

            // Filter out the note with the matching ID
            const newArray = StoredNotes.filter((note) => note.id !== id);

            // Save the updated array back to local storage
            chrome.storage.local.set({ notes: newArray });

            // Optionally, send a response back if needed
            sendResponse({ success: true });
        } else if (request.action === 'updateNoteContent') {
            const id = request.id
            const updateContent = request.content

            if (id && updateContent) {
                const noteArr = await UserLocalStorage.retriveNoteData()
                const updatedNoteArr = noteArr.map((note) => {
                    if (note.id == id) {
                        return { ...note, content: updateContent }
                    }
                })
                UserLocalStorage.setStorage(updatedNoteArr)
            }


        }

    }
);













