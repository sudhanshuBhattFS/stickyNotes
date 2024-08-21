
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
            const id = response.noteData.id
            if (id) {
                const title = response.noteData.title
                SimpleShadowDOM.createPopup(response.noteData);
            }
        });


    });

    // clove btn 
    const closeBtn = shadowRoot.querySelector('.close-btn');
    const pin = shadowRoot.querySelector('.pin');
    const title = shadowRoot.querySelector('.title')


    pin.addEventListener('click', (event) => {

        // event target
        let enablePin = true

        if (pin.classList.contains('selected')) {
            pin.classList.remove('selected');
            enablePin = false
        } else {
            pin.classList.add('selected');
        }
        const id = pin.getAttribute('pinId')
        chrome.runtime.sendMessage({ action: "enablePin", isPinEnable: enablePin, id: id });
    })


    closeBtn.addEventListener('click', async () => {
        container.remove();

        // Get the uniqueId attribute from the closeBtn button
        const id = closeBtn.getAttribute('uniqueId');

        // Send message to the background script
        chrome.runtime.sendMessage({
            action: 'updatePin',
            isPinEnable: false, // or true, depending on what you want to set
            id: id
        });
    });


    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.background = '#ff5757';
        closeBtn.style.color = ''
    });

    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.background = '';
        closeBtn.style.color = 'black'
    });

    const textArea = shadowRoot.querySelector('.textarea');
    preventUnintendedEvents(textArea)
    // Debounce function to delay execution
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Event listener with debounce
    textArea.addEventListener('input', debounce(() => {
        const noteContent = textArea.innerText;
        const contentElement = UpdateData(textArea.id, noteContent);
        chrome.runtime.sendMessage({ action: "removeTab", title: "StickyNotes" });
    }, 500)); // Adjust the delay (in milliseconds) as needed


    function preventUnintendedEvents(element) {
        // Prevent event propagation while allowing default behavior
        element.addEventListener('keydown', function (event) {
            event.stopPropagation();
        });

        element.addEventListener('keypress', function (event) {
            event.stopPropagation();
        });

        element.addEventListener('keyup', function (event) {
            event.stopPropagation();
        });

        // Specially handle focus-related events
        element.addEventListener('focus', function (event) {
            event.stopPropagation();
        }, true);
    }

}