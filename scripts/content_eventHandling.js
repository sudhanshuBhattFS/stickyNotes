
const UpdateData = (textareaId, noteContent) => {
    chrome.storage.local.get('notes', function (result) {
        if (result.notes) {
            const notes = result.notes
            notes.forEach(element => {
                const id = `${element.hostName}-${element.date.replace(/\//g, '-')}-${element.time.replace(/:/g, '-').replace(' PM', '-PM').replace(' AM', '-AM')}`
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
        const data = window.location.href
        console.log(data, 'data')
        chrome.runtime.sendMessage({ action: "storeNoteData", data: data }, (response) => {
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