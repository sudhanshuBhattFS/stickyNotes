class SimpleShadowDOM {
    static getHtmlTemplate() {
        return `
        <div class="note-container">
            <div class="note-title">
                <button class="add-btn">+</button>
                <button class="close-btn">X</button>
            </div>
            <div class='textarea' contenteditable="true">Write Something..</div>
        </div>
        `;
    }

    static createPopup() {

        const container = document.createElement('div');
        const shadowRoot = container.attachShadow({ mode: 'open' });

        container.className = 'model-notes';
        shadowRoot.innerHTML = SimpleShadowDOM.getHtmlTemplate();

        document.body.appendChild(container);

        // stlesheet
        addStyleSheetlink(shadowRoot)

        // draggable
        makeDraggable(shadowRoot.querySelector('.note-container'), shadowRoot.querySelector('.note-title'));

        // handling all the event for the note 
        eventListenerForNote(shadowRoot, container)
    }
}

const addStyleSheetlink = (shadowRoot) => {
    // stylesheet 
    const linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'stylesheet');
    linkElement.setAttribute('href', chrome.runtime.getURL('styles/content_script.css'));
    shadowRoot.appendChild(linkElement);
}

const createCard = () => {
    SimpleShadowDOM.createPopup()
}