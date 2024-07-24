
let noteCounter = 1
class SimpleShadowDOM {
    static getHtmlTemplate(title) {
        return `
        <div class="note-container">
            <div class="note-title">
                <button class="add-btn">+</button>
                <span contenteditable="true">${title}</span>
                <button class="close-btn">X</button>
            </div>
            <div class='textarea' contenteditable="true">Write Something..</div>
        </div>
        `;
    }

    static createPopup() {
        const title = `Sticky Note`
        const container = document.createElement('div');
        const shadowRoot = container.attachShadow({ mode: 'open' });

        container.className = 'model-notes';
        shadowRoot.innerHTML = SimpleShadowDOM.getHtmlTemplate(title);
        document.body.appendChild(container);

        // stlesheet
        addStyleSheetlink(shadowRoot)

        // draggable
        makeDraggable(shadowRoot.querySelector('.note-container'), shadowRoot.querySelector('.note-title'));

        // handling all the event for the note 
        eventListenerForNote(shadowRoot, container)

        // resizable
        makeResizable(shadowRoot.querySelector('.note-container'));

    }
}

const makeResizable = (element) => {
    element.style.resize = 'both';
    element.style.overflow = 'auto';
}

const addStyleSheetlink = (shadowRoot) => {
    // stylesheet 
    const linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('href', chrome.runtime.getURL('styles/content_script.css'));
    shadowRoot.appendChild(linkElement);
}

const createCard = () => {
    console.log('createCard is working !')
    SimpleShadowDOM.createPopup(noteCounter)
}