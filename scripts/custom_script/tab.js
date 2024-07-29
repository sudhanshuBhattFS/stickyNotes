// get note data which has been inserted

const getNotesDataInSideBar = async () => {
    const notesData = await UserLocalStorage.retriveNoteData();
    console.log(notesData, 'check data');
    return notesData;
};

// html 
const createCardsForNote = (note) => {
    return `
    <div class="d-flex flex-column border border-light">
        <div data-url="${note.url}" class="note-header url p-3 d-flex justify-content-between">
            <div data-url="${note.url}" class="note-host">${note.hostName}</div>
            <span>${note.time}</span>
        </div>
     </div>   
    `;
};

const TextAreaForNotesHtml = (innerText) => {
    return `<div class="w-50 mx-auto"><textarea class='w-100 bg-transparent text-light p-2' row='6'>${innerText}</textarea></div>`
}

// logic 
const insertContentInSideBar = (note, container) => {
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
    const htmlStr = TextAreaForNotesHtml(note.content)
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
    console.log(notesData, 'noteData check');

    if (notesData) {
        const container = document.querySelector('.list_notes');

        container.innerHTML = '';

        notesData.forEach(note => {
            //    for side bar 
            insertContentInSideBar(note, container)
            insertContentInMain(note)

        });

    }
};

// IIFE
(() => {
    // This function creates all the note cards 
    handleCardData();
})();

