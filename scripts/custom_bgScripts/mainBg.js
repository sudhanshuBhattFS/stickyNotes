

const getNoteData = (url) => {
    // get date and time 
    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();
    const hostName = new URL(url).hostname
    const timestamp = now.getTime(); // High-resolution timestamp
    const randomComponent = Math.random().toString(36).substring(2, 15); // Random string
    const uniqueId = `${timestamp}-${randomComponent}`; // Combine timestamp and random string
    const title = 'Title'

    return {
        id: uniqueId,
        date: dateStr,
        time: timeStr,
        hostName: hostName,
        url: url,
        content: '',
        title: title
    };
}


// one way communication between background and content script
chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

        console.log(request, 'bg request')
        if (request.greeting === "hello") {
            sendResponse({ farewell: "goodbye" });
        }

        // the first response created 
        if (request.action == "storeNoteData") {

            // get id 
            const noteData = getNoteData(request.url)

            // send request 
            sendResponse({ noteData: noteData });

            // update data 
            const noteArr = await UserLocalStorage.retriveNoteData()
            noteArr.push(noteData)
            chrome.storage.local.set({ notes: noteArr });

        }


        if (request.action === 'createTabAndInject') {
            chrome.tabs.create({ url: chrome.runtime.getURL('./stickyNote_html_page/index.html') });
        }


        if (request.action === 'filterLocalStorage') {
            const id = request.id;
            const StoredNotes = await UserLocalStorage.retriveNoteData();

            // Filter out the note with the matching ID
            const newArray = StoredNotes.filter((note) => note.id !== id);

            const noteToFind = StoredNotes.find(note => note.id === id);

            // Save the updated array back to local storage
            chrome.storage.local.set({ notes: newArray }, () => {

                // Query all tabs to find the one you want to send the message to
                chrome.tabs.query({}, function (tabs) {
                    tabs.forEach(tab => {
                        if (tab.url === noteToFind.url) {
                            chrome.tabs.sendMessage(tab.id, { action: 'removeElementFromDom', id: noteToFind.id });
                        }
                    });
                });

                // Send a response back if needed
                sendResponse({ success: true });
            });
        }


        if (request.action === 'updateNoteContent') {
            const id = request.id
            const updateContent = request.content

            if (id && updateContent) {
                const noteArr = await UserLocalStorage.retriveNoteData();
                const updatedNoteArr = noteArr.map((note) => {
                    if (note.id == id) {
                        return { ...note, content: updateContent };
                    }
                    return note; // Ensure that notes that don't match the id are returned unchanged
                });

                const noteToFind = updatedNoteArr.find(note => note.id === id);
                // updating it into the tab 
                chrome.tabs.query({}, function (tabs) {

                    tabs.forEach(tab => {
                        if (tab.url === noteToFind.url) {
                            chrome.tabs.sendMessage(tab.id, { action: 'updateContentInCard', note: noteToFind });
                        }
                    });
                });

                // upadte in local bg 
                UserLocalStorage.setStorage(updatedNoteArr);
            }


        }

        if (request.action == "removeUsingHostName") {
            const hostName = request.hostName
            const StoredNotes = await UserLocalStorage.retriveNoteData();

            // Filter out the note with the matching ID
            const newArray = StoredNotes.filter((note) => note.hostName === hostName);
            const updateArray = StoredNotes.filter((note) => note.hostName !== hostName);
            await UserLocalStorage.setStorage(updateArray)

            newArray.forEach((note) => {
                chrome.tabs.query({}, function (tabs) {
                    tabs.forEach(tab => {
                        if (tab.url === note.url) {
                            chrome.tabs.sendMessage(tab.id, { action: 'removeElementFromDom', id: note.id });
                        }
                    });
                });
            })
        }

        if (request.action === "removeTab") {
            const titleToRemove = request.title;

            chrome.tabs.query({}, (tabs) => {
                tabs.forEach((tab) => {
                    console.log(tabs, 'tabs')
                    if (tab.title === titleToRemove) {
                        chrome.tabs.remove(tab.id);
                    }
                });
            });
        }

        if (request.action === 'hide') {
            const isHidden = request.isHidden
            console.log(isHidden, 'isHidden check')
            //  isHidden logic start
            chrome.tabs.query({}, async (tabs) => {
                for (let tab of tabs) {
                    if (tab.url && !tab.url.startsWith('chrome://')) {
                        chrome.tabs.sendMessage(tab.id, { message: 'hideStickyNotes', isHidden: isHidden });
                    }
                }
            });

        }

        return true

    }
);













