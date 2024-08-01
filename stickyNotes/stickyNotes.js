
let noteArr = []
let isHidden = false




document.addEventListener('DOMContentLoaded', function () {

    const addBtn = document.getElementById('add-note')
    const allListContainer = document.getElementById('allNotesList')
    const hideAllBtn = document.getElementById('remove-all')


    let url = ''
    let hostName = ''


    // query
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        hostName = new URL(tabs[0].url).hostname;
        url = tabs[0].url;

    });

    // inject function
    function injectPopUps(note, index) {

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];

            if (note.hostName == hostName) {
                chrome.tabs.sendMessage(activeTab.id, { "message": "injectPopUps", "noteData": note, "index": index }, function (response) {
                    if (response && response.status === "success") {

                    }
                });
            }
        });
    }

    // retriveData 
    const retriveData = async () => {

        isHidden = await UserLocalStorage.getIsHidden()
        isHidden ? hideAllBtn.innerText = 'Show All Notes' : hideAllBtn.innerText = 'Hide All Notes'

        chrome.storage.local.get('notes', function (result) {
            if (result.notes) {
                noteArr = result.notes;

                if (noteArr.length > 0) {

                    noteArr.forEach((element, index) => {

                        if (element.hostName === hostName) {
                            // inject card into the extension popup
                            injectCards(element)
                            // inject the note into the html if there is already stored value 

                            injectPopUps(element, index)

                        }
                    });
                }
            }
        });
    }
    retriveData()

    // get data time 
    function getDateAndTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString();
        const timeStr = now.toLocaleTimeString();
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




    // inject cards for the user 
    const injectCards = (note) => {
        const card = document.createElement('div');
        card.className = 'note-card';

        const hostName = note.hostName
        const dateStr = note.date
        const content = note.content
        const url = note.url
        const timeStr = note.time
        const id = note.id

        card.innerHTML = `
        <div>
                <div class="note-header ">
                    <span class="url" data-url="${url}">${hostName}</span>
                    <span> ${dateStr}</span>
                    <span id="${id}" class='delete-btn'> Delete </span>
                </div>
                <div contenteditable="false" style="overflow : hidden ;  height: 1rem;" >${content}</div>
        </div>
            `;

        allListContainer.prepend(card);


        // Add event listener to url span
        const urlSpan = card.querySelector('.url');
        urlSpan.addEventListener('click', (event) => {
            chrome.tabs.create({ url: urlSpan.dataset.url }, (tab) => {

            });
        });

        // event listner for delete btn 
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            if (confirm("Are you sure you want to Remove this Note")) {



                const noteArr = await UserLocalStorage.retriveNoteData()

                if (noteArr.length > 0) {
                    noteArr.forEach((note) => {
                        const id = note.id

                        if (deleteBtn.id == id) {

                            // Remove the note from the array
                            const newArr = noteArr.filter((n) => n !== note);

                            UserLocalStorage.setStorage(newArr)

                            card.remove();
                            // remove the element from the dom 
                            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                                var activeTab = tabs[0];
                                chrome.tabs.sendMessage(activeTab.id, { "action": "removeElementFromDom", "id": id });
                            });

                        }
                    })
                }
            } else {
                console.warn("Note not removed");
            }
        });


    }




    // allow the user to create multiple text areas
    addBtn.addEventListener('click', () => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            const noteData = getDateAndTime()
            chrome.tabs.sendMessage(activeTab.id, { "message": "start", "noteData": noteData }, function (response) {
                if (response && response.status === "success") {
                    // update the data in loaclstorage
                    noteArr.push(noteData)
                    chrome.storage.local.set({ notes: noteArr });
                    // inject a add in the extension with the id data 
                    injectCards(noteData)
                }
            });
        });
    });

    hideAllBtn.addEventListener('click', () => {

        isHidden = !isHidden
        UserLocalStorage.setIsHidden(isHidden)
        if (isHidden === true) {
            hideAllBtn.innerText = 'Show All Notes'
        } else {
            hideAllBtn.innerText = 'Hide All Notes'
        }
        chrome.tabs.query({ currentWindow: true, active: true }, async (tabs) => {
            const activeTab = tabs[0];
            // const noteArr = await UserLocalStorage.retriveData()
            chrome.tabs.sendMessage(activeTab.id, { "message": 'hideStickyNotes', 'isHidden': isHidden, "noteData": noteArr }, {
            });
        });
    });


    document.getElementById('openTabButton').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'createTabAndInject' });
        // UserLocalStorage.deleteNoteData()
    });

});






