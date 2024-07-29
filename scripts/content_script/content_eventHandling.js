
const UpdateData = (textareaId, noteContent) => {
    chrome.storage.local.get('notes', function (result) {
        if (result.notes) {
            const notes = result.notes
            notes.forEach(element => {
                const id = element.id
                if (textareaId == id) {
                    element.content = noteContent
                    chrome.storage.local.set({ notes: notes }) // Update the local storage
                }
            });
        }
    })
}


const eventListenerForNote = (shadowRoot, container,) => {
    // add btn 
    shadowRoot.querySelector('.add-btn').addEventListener('click', async () => {
        // created a code for id and inner html 
        const url = window.location.href

        chrome.runtime.sendMessage({ action: "storeNoteData", url: url }, (response) => {
            console.log(response, 'response for id ')
            const id = response.id
            if (id) {
                SimpleShadowDOM.createPopup(id, 'Write something ...');
            }
        });


    });

    // clove btn 
    const closeBtn = shadowRoot.querySelector('.close-btn');

    closeBtn.addEventListener('click', () => {
        container.remove();
    });

    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.background = '#ff5757';
        closeBtn.style.color = 'white'
    });

    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.background = '';
        closeBtn.style.color = 'black'
    });

    const textArea = shadowRoot.querySelector('.textarea');
    textArea.addEventListener('input', () => {
        const noteContent = textArea.innerText;
        const contentElement = UpdateData(textArea.id, noteContent)
    });
}