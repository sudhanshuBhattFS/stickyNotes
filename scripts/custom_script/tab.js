// get note data which has been inserted

const getNotesDataInSideBar = async () => {
    const notesData = await UserLocalStorage.retriveNoteData();
    return notesData;
};

// html 
const createCardsForNote = (note) => {
    return `
    <div id="${note.id}" hostName="${note.hostName}" class="d-flex flex-column border border-light noteContainer">
        <div data-url="${note.url}" class="note-header url px-3 py-3 d-flex justify-content-between align-items-center">
            <div data-url="${note.url}" class="cursor-pointer hostName">${note.hostName}</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi delete-note bi-trash custom-margin-10" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
        </div>
    </div>
    `;
};

const TextAreaForNotesHtml = (note) => {
    let innerText;
    note.content == '' ? innerText = 'Write Something' : innerText = note.content.replace(/\n/g, '<br>');
    const id = note.id;
    return `
    <div class="${id}  w-50 mx-auto my-2">
        <div class="w-100 bg-light text-dark px-3 py-2">
            <div class="w-100 .bg-light.bg-gradient d-flex justify-content-between">
                <div>
                  <span class="px-2">${note.date}</span><span class="px-2">${note.time}</span>
                </div>
                <div>
                    <button type="button" unique-id='${id}' class="btn btn-primary editBtn mx-2">Edit</button>
                </div>
            </div>
        </div>
        <div contenteditable="false" class="textAreaForNotes resize border border-light w-100 bg-transparent text-light p-2">${innerText}</div>
    </div>
    `;
};


// logic 
const insertContentInSideBar = (note) => {

    const container = document.querySelector('.list_notes');
    const htmlString = createCardsForNote(note);

    // Convert HTML string to DOM node
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Append each child of tempDiv to the container
    while (tempDiv.firstChild) {
        container.appendChild(tempDiv.firstChild);
    }


}


const insertContentInMain = (note) => {
    // for content page 
    const container = document.querySelector('.contentContainer');
    const htmlStr = TextAreaForNotesHtml(note)
    // converting html string to dom node 
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlStr;

    while (tempDiv.firstChild) {
        container.appendChild(tempDiv.firstChild);
    }

}



const toggleNoteContainerSelection = () => {
    let selectedNoteContainer = null;
    const noteContainers = document.querySelectorAll('.noteContainer');

    if (noteContainers.length > 0) {
        // Select the first note container by default
        selectedNoteContainer = noteContainers[0];
        selectedNoteContainer.style.backgroundColor = 'white';
        selectedNoteContainer.style.color = 'black';

        const hostName = selectedNoteContainer.getAttribute('hostName');

        // Get the data from local storage
        UserLocalStorage.retriveNoteData().then(storeArr => {
            // Filter based on hostName
            const updateArr = storeArr.filter(note => note.hostName === hostName);

            // Remove everything from the container
            const contentContainer = document.querySelector('.contentContainer');
            contentContainer.innerHTML = '';

            // Inject content in main
            updateArr.forEach(note => {
                insertContentInMain(note);
            });
        });
    }


    noteContainers.forEach(noteContainer => {
        noteContainer.addEventListener('click', async () => {
            if (selectedNoteContainer === noteContainer) {
                // Deselect if the same container is clicked again
                noteContainer.style.backgroundColor = '';
                noteContainer.style.color = '';
                selectedNoteContainer = null;

                // Clear main content container
                document.querySelector('.contentContainer').innerHTML = '';
            } else {
                // If a different container is selected
                if (selectedNoteContainer) {
                    selectedNoteContainer.style.backgroundColor = '';
                    selectedNoteContainer.style.color = '';
                }

                // When user clicks value will be selected
                noteContainer.style.backgroundColor = 'white';
                noteContainer.style.color = 'black';
                selectedNoteContainer = noteContainer;

                const hostName = noteContainer.getAttribute('hostName');


                // Get the data from local storage 
                const storeArr = await UserLocalStorage.retriveNoteData();
                // Filter based on hostName 
                const updateArr = storeArr.filter(note => note.hostName === hostName);

                // Remove everything from the container 
                const contentContainer = document.querySelector('.contentContainer');
                contentContainer.innerHTML = '';

                // Inject content in main 
                updateArr.forEach(note => {
                    insertContentInMain(note);
                });
            }
        });
    });
}

const filterNotes = async (query) => {
    const notesData = await getNotesDataInSideBar();

    // Clear current notes
    const sidebarContainer = document.querySelector('.list_notes');
    sidebarContainer.innerHTML = '';

    const mainContainer = document.querySelector('.contentContainer');
    mainContainer.innerHTML = '';

    // Filter notes based on query
    const filteredNotes = notesData.filter(note =>
        note.hostName.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
    );

    // Display filtered notes in sidebar and main container
    const uniqueSet = new Set();
    const noteArr = filteredNotes.filter(note => {
        if (uniqueSet.has(note.hostName)) {
            return false;
        } else {
            uniqueSet.add(note.hostName);
            return true;
        }
    });

    noteArr.forEach(note => {
        insertContentInSideBar(note);
    });

    filteredNotes.forEach(note => {
        insertContentInMain(note);
    });

    toggleNoteContainerSelection();
};

const handleCardData = async () => {
    // Get all the note data 
    const notesData = await getNotesDataInSideBar();


    if (notesData) {

        const uniqueSet = new Set()

        const noteArr = notesData.filter(note => {
            if (uniqueSet.has(note.hostName)) {
                return false
            } else {
                uniqueSet.add(note.hostName);
                return true;
            }
        })

        noteArr.forEach(note => {
            //    for side bar 
            insertContentInSideBar(note)
        });

        toggleNoteContainerSelection()

        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('hostName')) {
                const url = event.target.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            }
        });

        // creating a logic for the delete btn 
        document.querySelectorAll('.delete-note').forEach(deleteButton => {
            deleteButton.addEventListener('click', (event) => {
                if (confirm('Are you sure you want to delete this note?')) {
                    event.stopPropagation();
                    (deleteButton, 'deletebtn remove')
                    deleteButton.closest('.noteContainer').remove();
                    const hostName = deleteButton.closest('.noteContainer').getAttribute('hostName')
                    const id = deleteButton.closest('.noteContainer').id

                    // remove logic for main container 
                    const contentContainer = document.querySelector('.contentContainer');
                    contentContainer.innerHTML = '';
                    chrome.runtime.sendMessage({ action: "removeUsingHostName", hostName: hostName },);

                }
            });
        });

        // event lister for visit web pages 
        document.querySelectorAll('.note-host').forEach(hostElement => {
            hostElement.addEventListener('click', (event) => {
                const url = event.target.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            });
        });


        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('editBtn')) {
                const targetElement = event.target;
                const id = targetElement.getAttribute('unique-id');
                const parentElement = document.getElementsByClassName(id)[0];
                const textArea = parentElement.querySelector('.textAreaForNotes');

                if (textArea) {
                    const isEditable = textArea.getAttribute('contenteditable') === 'true';
                    textArea.setAttribute('contenteditable', !isEditable);

                    if (!isEditable) {
                        textArea.focus();
                        targetElement.innerText = 'Save';
                    } else {
                        targetElement.innerText = 'Edit';
                        const updatedContent = textArea.innerText;
                        chrome.runtime.sendMessage({
                            action: 'updateNoteContent',
                            id: id,
                            content: updatedContent
                        });
                    }
                }
            }
        });

    }

    document.getElementById('searchBox').addEventListener('input', (event) => {
        const query = event.target.value;
        filterNotes(query);
    });
};

// IIFE
(() => {
    // This function creates all the note cards 
    handleCardData();
})();

