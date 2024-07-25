
let noteArr = []
document.addEventListener('DOMContentLoaded', function () {

    const saveButton = document.getElementById('save');
    const noteContainer = document.getElementById('notesContainer')
    const addBtn = document.getElementById('add-note')
    const removeAllBtn = document.getElementById('removeAll')
    const allListContainer = document.getElementById('allNotesList')
    const removeAll = document.getElementById('remove-all')


    let url = ''
    let hostName = ''
    let isCardCreated = false
    let isNoteCreated = false

    // first get the tab url
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        hostName = new URL(tabs[0].url).hostname;
        url = tabs[0].url;
        console.log(url, 'url ')
    });

    function injectPopUps(note) {
        console.log(note, hostName, "hostName and Note")
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];

            if (note.hostName == hostName) {
                chrome.tabs.sendMessage(activeTab.id, { "message": "injectPopUps", "noteData": note, }, function (response) {
                    if (response && response.status === "success") {
                        console.log('popUps injected successfully')
                    }
                });
            }
        });
    }

    // funtions
    const retriveData = () => {
        chrome.storage.local.get('notes', function (result) {
            if (result.notes) {
                noteArr = result.notes;
                console.log(noteArr, 'note array ');
                noteArr.forEach(element => {
                    // inject card into the extension popup
                    injectCards(element);
                    // inject the note into the html if there is already stored value 
                    injectPopUps(element)
                });
            }
        });
    }


    const createCard = () => {
        //  store the details into localstorage 
        const noteHeading = getDateAndTime()
        noteArr.push(noteHeading)
        chrome.storage.local.set({ notes: noteArr });
        injectCards(noteHeading)

    }

    // get data time 
    function getDateAndTime() {
        const now = new Date();
        const dateStr = now.toLocaleDateString();
        const timeStr = now.toLocaleTimeString();

        return { date: dateStr, time: timeStr, hostName: hostName, url: url, content: '' }
    }


    // inject cards for the user 
    const injectCards = (note) => {
        const card = document.createElement('div');
        card.className = 'note-card';

        const hostName = note.hostName
        const dateStr = note.date
        const timeStr = note.time
        const url = note.url
        const content = note.content

        card.innerHTML = `
                <div data-url="${url}" class="note-header url">
                    <span>${hostName}</span>
                    <span> ${dateStr}</span>
                    <span> ${timeStr}</span>
                </div>
                <div contenteditable="false" style="overflow : hidden" >${content}</div>
            `;

        allListContainer.prepend(card);


        // Add event listener to url span
        const urlSpan = card.querySelector('.url');
        urlSpan.addEventListener('click', () => {
            chrome.tabs.create({ url: urlSpan.dataset.url }, (tab) => {
                console.log(tab, 'check if this code works ')
            });
        });

    }

    // retrive data 
    retriveData()


    // allow the user to create multiple text areas
    addBtn.addEventListener('click', () => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            const dateAndTime = getDateAndTime()
            chrome.tabs.sendMessage(activeTab.id, { "message": "start", "noteData": dateAndTime }, function (response) {
                if (response && response.status === "success") {
                    createCard();
                }
            });
        });
    });

    removeAll.addEventListener('click', () => {
        chrome.storage.local.clear(() => {
            console.log('All notes removed from storage');
        });
    });

    chrome.runtime.onMessage.addListener((request) => {
        console.log(request);
        if (request.action === "") {
            console.log('message is received')
            createCard()
        }
    });

});






