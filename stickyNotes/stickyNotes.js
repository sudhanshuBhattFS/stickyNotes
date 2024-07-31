
let noteArr = []
document.addEventListener('DOMContentLoaded', function () {

    const addBtn = document.getElementById('add-note')
    const allListContainer = document.getElementById('allNotesList')
    const removeAll = document.getElementById('remove-all')


    let url = ''
    let hostName = ''


    // query
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        hostName = new URL(tabs[0].url).hostname;
        url = tabs[0].url;

    });

    // inject function
    function injectPopUps(note) {

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];

            if (note.hostName == hostName) {
                chrome.tabs.sendMessage(activeTab.id, { "message": "injectPopUps", "noteData": note, }, function (response) {
                    if (response && response.status === "success") {

                    }
                });
            }
        });
    }

    // retriveData 
    const retriveData = () => {

        chrome.storage.local.get('notes', function (result) {
            console.log(result.notes)
            if (result.notes) {
                noteArr = result.notes;

                if (noteArr.length > 0) {

                    noteArr.forEach(element => {

                        if (element.hostName === hostName) {

                            // inject card into the extension popup
                            injectCards(element);
                            // inject the note into the html if there is already stored value 
                            injectPopUps(element)
                        }
                    });
                }
            }
        });
    }


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

                card.remove();

                const noteArr = await UserLocalStorage.retriveNoteData()

                if (noteArr.length > 0) {
                    noteArr.forEach((note) => {
                        const id = note.id
                        console.log(id, 'id2')
                        if (deleteBtn.id == id) {
                            console.log(note, 'inside conidtion check ')
                            // Remove the note from the array
                            const newArr = noteArr.filter((n) => n !== note);
                            console.log(newArr, 'new array ')
                            UserLocalStorage.setStorage(newArr)

                            // remove the element from the dom 
                            // chrome.tabs.sendMessage({ "message": "removeElementFromDom", id: id });

                        }
                    })
                }
            } else {
                console.warn("Note not removed");
            }
        });


    }

    // retrive data 
    retriveData()


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

    removeAll.addEventListener('click', () => {
        chrome.storage.local.clear(() => {

        });
    });


    document.getElementById('openTabButton').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'createTabAndInject' });

    });

});






