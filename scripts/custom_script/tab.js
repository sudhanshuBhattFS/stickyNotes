// get note data which has been inserted

const getNotesDataInSideBar = async () => {
    const notesData = await UserLocalStorage.retriveNoteData();
    return notesData;
};

// html 
const createCardsForNote = (note) => {
    return `
    <div  id="${note.id}" class="d-flex flex-column border border-light noteContainer">
        <div data-url="${note.url}" class="note-header url px-3 py-1 d-flex justify-content-between">
            <div class="curser-pointer" >${note.hostName}
            <svg  data-url="${note.url}" class="note-host" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"/>
              <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"/>
            </svg></div>
            <div >
            <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi delete-note bi-trash custom-margin-10" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
            </div>
        </div>
        <div class="px-3 curser-pointer pb-2 d-flex justify-content-between"  >
        <span >${note.date}</span>
            <span >${note.time}</span>
        </div>
     </div>   
    `;
};

const TextAreaForNotesHtml = (note) => {

    let innerText
    note.content == '' ? innerText = 'Write Something ' : innerText = note.content
    const id = note.id
    return `
    
    <div class="${id} w-50 mx-auto my-2">
    <div class="w-100 bg-light text-dark px-3 py-2">
    <div class="w-100 .bg-light.bg-gradient"><span>${note.hostName}</span><span class="px-2">${note.date}</span><span class="px-2">${note.time}</span></div>
    </div>
    <div><textarea class='w-100 bg-transparent text-light p-2' row='6'>${innerText}</textarea></div>
    </div>
    `
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

        // event lister for visit web pages 
        document.querySelectorAll('.note-host').forEach(hostElement => {
            hostElement.addEventListener('click', (event) => {
                const url = event.target.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
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

