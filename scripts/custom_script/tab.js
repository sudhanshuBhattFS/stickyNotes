// get note data which has been inserted

const getNotesDataInSideBar = async () => {
    const notesData = await UserLocalStorage.retriveNoteData();
    return notesData;
};

// html 
const createCardsForNote = (note) => {
    return `
    <div  id="${note.id}" class="d-flex flex-column border border-light noteContainer">
        <div data-url="${note.url}" class="note-header url p-3 d-flex justify-content-between">
            <div data-url="${note.url}" class="note-host">${note.hostName}</div>
            <div >
            <span >${note.date}</span>
            <span >${note.time}</span>
            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi delete-note bi-trash custom-margin-10" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>
            </div>
        </div>
     </div>   
    `;
};

const TextAreaForNotesHtml = (note) => {
    const innerText = note.content
    const id = note.id
    return `<div class=" ${id} w-50 mx-auto"><textarea class='w-100 bg-transparent text-light p-2' row='6'>${innerText}</textarea></div>`
}

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
    // Event listner 
    document.querySelectorAll('.note-host').forEach(hostElement => {
        hostElement.addEventListener('click', (event) => {
            const url = event.target.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

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

const handleCardData = async () => {
    // Get all the note data 
    const notesData = await getNotesDataInSideBar();


    if (notesData) {


        notesData.forEach(note => {
            //    for side bar 
            insertContentInSideBar(note)
            insertContentInMain(note)

        });

        // creating a logic for the delete btn 
        document.querySelectorAll('.delete-note').forEach(deleteButton => {
            deleteButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this note?')) {
                    deleteButton.closest('.noteContainer').remove();
                    const id = deleteButton.closest('.noteContainer').id

                    const textAreaElements = document.getElementsByClassName(id);
                    if (textAreaElements.length > 0) {
                        textAreaElements[0].remove();
                    }

                    chrome.runtime.sendMessage({ action: "filterLocalStorage", id: id },);

                }
            });
        });


    }
};

// IIFE
(() => {
    // This function creates all the note cards 
    handleCardData();
})();

