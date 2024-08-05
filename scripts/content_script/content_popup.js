let index = 1

class SimpleShadowDOM {
    static getHtmlTemplate(heading, id, content, hostName) {
        return `
        <div uniqueId="${id}" class="note-container">
            <div class="note-title">
                <button class="add-btn">+</button>
                <span contenteditable="true">${heading}</span>
                <button class="close-btn">X</button>
            </div>
            <div id="${id}" class='textarea' contenteditable="true">${content}</div>
        </div>
        `;
    }

    static createPopup(id, innerContent, hostName) {
        const heading = `Sticky Note-${index}`;
        index++;
        const container = document.createElement('div');
        const shadowRoot = container.attachShadow({ mode: 'open' });

        container.className = 'model-notes';

        shadowRoot.innerHTML = SimpleShadowDOM.getHtmlTemplate(heading, id, innerContent, hostName);

        document.body.appendChild(container);

        // stylesheet
        addStyleSheetlink(shadowRoot);

        // draggable
        makeDraggable(shadowRoot.querySelector('.note-container'), shadowRoot.querySelector('.note-title'));

        // handling all the events for the note 
        eventListenerForNote(shadowRoot, container);

        // resizable
        makeResizable(shadowRoot.querySelector('.note-container'));
    }

    static removeElementFromDom(id) {
        const containers = document.querySelectorAll('.model-notes');
        containers.forEach((container) => {
            const shadowRoot = container.shadowRoot;
            const existingElement = shadowRoot.getElementById(id);
            if (existingElement) {
                existingElement.parentElement.remove();
            }
        });
    }

    static hideAllElementsFromDom() {
        document.querySelectorAll('.model-notes').forEach(element => {
            element.dataset.originalDisplay = element.style.display; // Store original display value
            element.style.display = 'none';
        });
    }

    static showAllElementsFromDom() {
        document.querySelectorAll('.model-notes').forEach(element => {
            element.style.display = element.dataset.originalDisplay || 'block'; // Restore original display value or default to 'block'
        });
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

const createCardAndUpdate = (note) => {
    const id = note.id;
    const innerHtml = note.content.replace(/\n/g, '<br>'); // Replace line breaks with <br> tags
    const hostName = note.hostName;

    const containers = document.querySelectorAll('.model-notes');
    let elementExists = false;

    containers.forEach((container) => {
        const shadowRoot = container.shadowRoot;
        const existingElement = shadowRoot.getElementById(id);
        if (existingElement) {
            elementExists = true;
            existingElement.innerHTML = innerHtml; // Insert content with <br> tags
            return;
        }
    });

    if (!elementExists) {
        SimpleShadowDOM.createPopup(id, innerHtml, hostName);
    }
};

// No need for this method, change this code ---
const injectCards = (noteData, i) => {
    index = i;
    createCardAndUpdate(noteData);
}
