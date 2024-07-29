
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

    // query
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        hostName = new URL(tabs[0].url).hostname;
        url = tabs[0].url;
        console.log(url, 'url ')
    });

    // inject function
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

    // retriveData 
    const retriveData = () => {
        chrome.storage.local.get('notes', function (result) {
            if (result.notes) {
                noteArr = result.notes;
                console.log(noteArr, 'note array ');
                noteArr.forEach(element => {
                    console.log(element, 'element')
                    if (element.hostName === hostName) {

                        // inject card into the extension popup
                        injectCards(element);
                        // inject the note into the html if there is already stored value 
                        injectPopUps(element)
                    }
                });
            }
        });
    }

    // createCard 
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
        const content = note.content
        const url = note.url
        const timeStr = note.time
        const id = `${note.hostName}-${note.date.replace(/\//g, '-')}-${note.time.replace(/:/g, '-').replace(' PM', '-PM').replace(' AM', '-AM')}`;

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
                console.log(tab, 'check if this code works');
            });
        });

        // event listner for delete btn 
        const deleteBtn = card.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            if (confirm("Are you sure you want to Remove this Note")) {

                card.remove();

                const noteArr = await UserLocalStorage.retriveNoteData()
                console.log(noteArr)
                console.log(deleteBtn.id, 'id')
                if (noteArr.length > 0) {
                    noteArr.forEach((note) => {
                        const id = `${note.hostName}-${note.date.replace(/\//g, '-')}-${note.time.replace(/:/g, '-').replace(' PM', '-PM').replace(' AM', '-AM')}`;
                        console.log(id, 'id2')
                        if (deleteBtn.id == id) {
                            console.log(note, 'inside conidtion check ')
                            // Remove the note from the array
                            const newArr = noteArr.filter((n) => n !== note);
                            console.log(newArr, 'new array ')
                            UserLocalStorage.setStorage(newArr)

                        }
                    })
                }

                console.log("Note removed");
            } else {
                console.log("Note not removed");
            }
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


    document.getElementById('openTabButton').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'createTabAndInject' });

    });

});






