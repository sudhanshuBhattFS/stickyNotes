let index = 1
class SimpleShadowDOM {
    static getHtmlTemplate(heading, id, content, title) {
        return `
        <div uniqueId="${id}" class="note-container">
            <div class="note-title">
                <button class="add-btn">+</button>
                <span contenteditable="true">${heading}</span>
                <button class="close-btn">X</button>
            </div>
            <pre class="title" contenteditable="true" >${title}</pre>
            <div id="${id}" class='textarea' contenteditable="true">${content}</div>
        </div>
        `;
    }

    static createPopup(id, innerContent, title) {

        const heading = `Sticky Note-${index}`
        index++
        const container = document.createElement('div');
        const shadowRoot = container.attachShadow({ mode: 'open' });

        container.className = 'model-notes'

        shadowRoot.innerHTML = SimpleShadowDOM.getHtmlTemplate(heading, id, innerContent, title);

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

    static removeElementFromDom(id) {
        const containers = document.querySelectorAll('.model-notes');
        containers.forEach((container) => {
            const shadowRoot = container.shadowRoot;
            const existingElement = shadowRoot.getElementById(id);
            if (existingElement) {
                existingElement.parentElement.remove()
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



const createCard = (id, innerHtml, title) => {

    const containers = document.querySelectorAll('.model-notes');
    let elementExists = false;

    containers.forEach((container) => {
        const shadowRoot = container.shadowRoot;
        const existingElement = shadowRoot.getElementById(id);
        if (existingElement) {
            elementExists = true;
            existingElement.innerHTML = ''; // Clear existing content
            const preElement = document.createElement('pre');
            preElement.textContent = innerHtml; // Set text content
            existingElement.appendChild(preElement);
            return;
        }
    });

    if (!elementExists) {
        const preElement = document.createElement('pre');
        preElement.textContent = innerHtml; // Set text content
        SimpleShadowDOM.createPopup(id, preElement.outerHTML, title);
    }
};


// no need of this method change this code ---
const injectCards = (noteData, i) => {
    const content = noteData.content
    const id = noteData.id
    index = i
    const title = noteData.title
    debugger
    createCard(id, noteData.content, title)
}