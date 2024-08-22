let selectedNoteContainer = null;
// get note data which has been inserted
let flag = true
let isViewGrid = true
let isSideBarVisiable = true
const grid = document.getElementsByClassName('grid')
const containerEle = document.querySelector('.contentContainer');

(async function checkIsView() {
    isViewGrid = await UserLocalStorage.getIsViewGrid()

})()


const getNotesDataInSideBar = async () => {
    const notesData = await UserLocalStorage.retriveNoteData();
    return notesData;
};

const sideBar = document.querySelector('#sideBar')
const stickyNoteSideBar = document.querySelector('.stickyNoteSideBar')
const sideBarImg = document.querySelector('.open-position')

sideBar.addEventListener('click', (event) => {
    isSideBarVisiable = !isSideBarVisiable

    if (isSideBarVisiable === false) {
        // stickyNoteSideBar.style.display = 'none'
        stickyNoteSideBar.classList.add('sideBarCloseBtn')
        sideBar.classList.remove('sideBarOpen')
        sideBar.classList.add('sideBarClose')
        sideBarImg.style.left = "-10px"

    } else {
        stickyNoteSideBar.style.display = 'block'
        stickyNoteSideBar.classList.remove('sideBarCloseBtn')
        sideBar.classList.add('sideBarOpen')
        sideBar.classList.remove('sideBarClose')
        sideBarImg.style.left = "0px"
    }
})

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
           <svg xmlns="http://www.w3.org/2000/svg" data-url="${note.url}" width="16" height="16" fill="currentColor" class="bi navigation bi-arrow-up-right-square toolTipNav" viewBox="0 0 16 16">
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
    let innerText = note.content === '' ? '' : note.content.replace(/\n/g, '<br>');
    const id = note.id;

    const cardClass = isViewGrid ? "w-100" : "w-50";

    return `
    <div id="Cards" class="${id} card-size ${cardClass} mx-2 my-2">
        <div class="w-100 heading text-dark px-3 py-2">
            <div class="w-100 d-flex justify-content-between">
                <div>
                  <span class="px-2">${note.date.replace(/\//g, '-')}</span><span class="px-2">${note.time}</span>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" unique-id='${id}' width="16" height="16" fill="currentColor" class="bi bi-trash deleteNoteBtn" viewBox="0 0 16 16">
                     <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                     <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                   </svg>
                </div>
            </div>
        </div>
        <div contenteditable="true" uniqueId="${id}" class="textAreaForNotes resize border border-light w-100 bg-transparent text-light p-2">${innerText}</div>
    </div>`;
};



// logic 
const insertContentInSideBar = (note) => {

    const container = document.querySelector('.list_notes');
    const htmlString = createCardsForNote(note);

    // eventListenerForDeleteBtn()

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



    // Tooltip for the 'Delete Note' button
    tippy('.deleteNoteBtn', {
        content: getDeleteDes(),
        placement: 'bottom'
    });
    tippy('.toolTipNav', {
        content: getMessageForNav(),
        placement: 'bottom'
    });
    tippy('.delete-note', {
        content: getDeleteAllDescription(),
        placement: 'bottom'
    });

}



const toggleNoteContainerSelection = () => {
    const noteContainers = document.querySelectorAll('.noteContainer');

    if (noteContainers.length > 0) {
        // Select the first note container by default
        selectedNoteContainer = noteContainers[0];
        selectedNoteContainer.classList.add('select');

        const hostName = selectedNoteContainer.getAttribute('hostName');

        if (flag) {
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
                eventListenerForEditBtn()
                eventListenerForDeleteBtn()

                const isViewGrid = await UserLocalStorage.getIsViewGrid();
                const cards = document.querySelectorAll('#Cards');
                setView(cards);
                UserLocalStorage.setIsViewGrid(isViewGrid);
            });
        }


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

                const searchBox = document.getElementById('searchBox');
                const flag = searchBox.value.trim() === '';


                if (flag === true) {
                    updateArr.forEach(note => {
                        insertContentInMain(note);
                    });
                } else {
                    insertFilterNote(searchBox.value)
                }

                flag == true
            }
            eventListenerForEditBtn()
            eventListenerForDeleteBtn()
        });
    });


    flag = true
}


const insertFilterNote = async (query) => {

    const notesData = await getNotesDataInSideBar();

    const filteredNotes = notesData.filter(note =>
        note.hostName.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
    );
    const hostName = selectedNoteContainer.getAttribute('hostName')
    filteredNotes.forEach(note => {
        if (note.hostName == hostName) {
            insertContentInMain(note)
        }
    })


}

const eventListenerForDeleteBtn = () => {
    document.querySelectorAll('.deleteNoteBtn').forEach((deleteBtn) => {
   
        deleteBtn.addEventListener('click', async (event) => {
            if (confirm(getDeleteMsg())) {
                const deleteBtn = event.target
                // Ensure you're using the correct attribute name
                const id = deleteBtn.getAttribute('unique-id');
                // Use querySelector to find the card element with the id
                const cardToRemove = document.querySelector(`.${CSS.escape(id)}`);

                if (cardToRemove) {
                    cardToRemove.remove();

                    const noteArr = await UserLocalStorage.retriveNoteData()
                    const filerArr = noteArr.filter(note => note.id !== id)
                    UserLocalStorage.setStorage(filerArr)

                    chrome.tabs.query({}, function (tabs) {
                        tabs.forEach(tab => {
                            chrome.tabs.sendMessage(tab.id, { action: 'removeElementFromDom', id: id });
                        });
                    });
                    toggleNoteContainerSelection()

                } else {
                    console.error(`Element with class ${id} not found.`);
                }
            }
        })
    })
}


const eventListenerForEditBtn = () => {
    document.querySelectorAll('.textAreaForNotes').forEach((textArea) => {
        // Make each textarea content editable
        textArea.setAttribute('contenteditable', 'true');

        // Add event listener for input
        const debouncedUpdate = debounce(() => {
            const updatedContent = textArea.innerText;
            const id = textArea.getAttribute('uniqueId');

            // Send the updated content to the background script or storage
            chrome.runtime.sendMessage({
                action: 'updateNoteContent',
                id: id,
                content: updatedContent
            });
        }, 500); // Adjust the delay as needed

        textArea.addEventListener('input', debouncedUpdate);

        // Focus and move cursor to the end when user clicks on the textarea
        textArea.addEventListener('focus', () => {
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(textArea);
            range.collapse(false); // Collapse to end of the content
            selection.removeAllRanges();
            selection.addRange(range);
        });
    });

    // Debounce function to delay the execution of a function
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }


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

    const hostName = selectedNoteContainer.getAttribute('hostName')

    noteArr.forEach(note => {
        insertContentInSideBar(note);
    });

    filteredNotes.forEach(note => {

        if (hostName == note.hostName) {
            insertContentInMain(note);
        }
    });

    flag = false
    eventListenerForNavigation()
    eventListenerForEditBtn()
    eventListenerForDeleteBtn()
    eventListenerForDeleteAllHostNote()
    toggleNoteContainerSelection();
};

const eventListenerForDeleteAllHostNote = () => {

    document.querySelectorAll('.delete-note').forEach(deleteButton => {
   
        deleteButton.addEventListener('click', (event) => {
            const message = getDeleteMessage()
            if (confirm(getDeleteAllMsg())) {
                event.stopPropagation();
                (deleteButton, 'deletebtn remove')
                deleteButton.closest('.noteContainer').remove();
                const hostName = deleteButton.closest('.noteContainer').getAttribute('hostName')
                const id = deleteButton.closest('.noteContainer').id

                // remove logic for main container 
                const contentContainer = document.querySelector('.contentContainer');
                contentContainer.innerHTML = '';
                chrome.runtime.sendMessage({ action: "removeUsingHostName", hostName: hostName },);
                toggleNoteContainerSelection()

            }
        });
    });
}
const eventListenerForNavigation = () => {
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
}

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

        //
    }

    // event handling 
    eventListenerForNavigation()
    eventListenerForEditBtn()
    eventListenerForDeleteBtn()
    eventListenerForDeleteAllHostNote()

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
    document.getElementById('refresh').addEventListener('click', () => {
        location.reload();
    });


};


// IIFE
(() => {
    // This function creates all the note cards 
    handleCardData();
})();


