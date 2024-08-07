// get note data which has been inserted

let isViewGrid = false
const grid = document.getElementsByClassName('grid')
const containerEle = document.querySelector('.contentContainer');

const getNotesDataInSideBar = async () => {
    const notesData = await UserLocalStorage.retriveNoteData();
    return notesData;
};

const setView = (cards) => {
    if (isViewGrid) {
        containerEle.classList.remove('flex-column', 'align-items-center', 'd-flex');
        containerEle.classList.add('gridView');
        cards.forEach((card, index) => {
            if (card) {
                card.classList.remove('w-50');
                card.classList.add('w-100')

            } else {
                console.log(`card at index ${index} is undefined`);
            }
        });
    } else {
        containerEle.classList.remove('gridView');
        cards.forEach((card, index) => {
            if (card) {
                card.classList.add('w-50');
                card.classList.remove('w-100');
            } else {
                console.log(`card at index ${index} is undefined`);
            }
        });
        containerEle.classList.add('flex-column', 'align-items-center', 'd-flex');
    }
}
// html 
const createCardsForNote = (note) => {
    return `
    <div id="${note.id}"  hostName="${note.hostName}" class="d-flex flex-column border border-light noteContainer">
        <div data-url="${note.url}" class="note-header url px-3 py-3 d-flex justify-content-between align-items-center">
            <div  class="cursor-pointer hostName">${note.hostName}</div>
           <div>
           <svg xmlns="http://www.w3.org/2000/svg" data-url="${note.url}" width="16" height="16" fill="currentColor" class="bi navigation bi-arrow-up-right-square" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5.854 8.803a.5.5 0 1 1-.708-.707L9.243 6H6.475a.5.5 0 1 1 0-1h3.975a.5.5 0 0 1 .5.5v3.975a.5.5 0 1 1-1 0V6.707z"/>
</svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi delete-note bi-trash custom-margin-10" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
           </div>
        </div>
    </div>
    `;
};

const TextAreaForNotesHtml = (note) => {


    let innerText;
    note.content == '' ? innerText = 'Write Something' : innerText = note.content.replace(/\n/g, '<br>');
    const id = note.id;

    if (isViewGrid) {
        return `
    <div  id="Cards" class="${id} card-size w-100 mx-2 my-2 ">
        <div class="w-100 heading text-dark px-3 py-2">
            <div class="w-100  d-flex justify-content-between">
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
    } else {
        return `
         <div  id="Cards" class="${id} card-size w-50 mx-2 my-2 ">
        <div class="w-100 heading text-dark px-3 py-2">
            <div class="w-100  d-flex justify-content-between">
                <div>
                  <span class="px-2">${note.date}</span><span class="px-2">${note.time}</span>
                </div>
                <div>
                    <button type="button" unique-id='${id}' class="btn btn-primary editBtn mx-2">Edit</button>
                </div>
            </div>
        </div>
        <div contenteditable="false" class="textAreaForNotes resize border border-light w-100 bg-transparent text-light p-2">${innerText}</div>
    </div>`
    }
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
        selectedNoteContainer.classList.add('select');

        const hostName = selectedNoteContainer.getAttribute('hostName');

        // Get the data from local storage
        UserLocalStorage.retriveNoteData().then(async (storeArr) => {
            // Filter based on hostName
            const updateArr = storeArr.filter(note => note.hostName === hostName);

            // Remove everything from the container
            const contentContainer = document.querySelector('.contentContainer');
            contentContainer.innerHTML = '';

            // Inject content in main
            updateArr.forEach(note => {
                insertContentInMain(note);
            });

            const isViewGrid = await UserLocalStorage.getIsViewGrid();
            const cards = document.querySelectorAll('#Cards');
            setView(cards);
            UserLocalStorage.setIsViewGrid(isViewGrid);
        });
    }

    noteContainers.forEach(noteContainer => {
        noteContainer.addEventListener('click', async () => {
            if (selectedNoteContainer === noteContainer) {
                // Deselect if the same container is clicked again
                noteContainer.classList.remove('select');
                selectedNoteContainer = null;

                // Clear main content container
                document.querySelector('.contentContainer').innerHTML = '';
            } else {
                // If a different container is selected
                if (selectedNoteContainer) {
                    selectedNoteContainer.classList.remove('select');
                }

                // When user clicks, value will be selected
                noteContainer.classList.add('select');
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
            if (event.target.classList.contains('navigate')) {
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
        document.querySelectorAll('.navigation').forEach(hostElement => {
            hostElement.addEventListener('click', (event) => {
                event.stopPropagation();
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

    // event handling 

    grid[0].addEventListener('click', (event) => {
        isViewGrid = !isViewGrid;
        const cards = document.querySelectorAll('#Cards')
        setView(cards)
        UserLocalStorage.setIsViewGrid(isViewGrid)
    });

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

