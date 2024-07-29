
class SimpleShadowDOM {
    static getHtmlTemplate(title, id, content) {
        return `
        <div class="note-container">
            <div class="note-title">
                <button class="add-btn">+</button>
                <span contenteditable="true">${title}</span>
                <button class="close-btn">X</button>
            </div>
            <div id="${id}" class='textarea' contenteditable="true">${content}</div>
        </div>
        `;
    }

    static createPopup(id, innerContent) {

        const title = `Sticky Note`
        const container = document.createElement('div');
        const shadowRoot = container.attachShadow({ mode: 'open' });

        container.className = 'model-notes'
        shadowRoot.innerHTML = SimpleShadowDOM.getHtmlTemplate(title, id, innerContent);

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

// const createCard = (id, innerHtml) => {
//     console.log(innerHtml, 'check ')
//     const existingElement = document.getElementById('app.profitops.ai-7-24-2024-4-54-01-PM');
//     console.log(existingElement, 'check')
//     if (existingElement) {
//         existingElement.innerHTML = innerHtml;
//     } else {
//         SimpleShadowDOM.createPopup(id, innerHtml);
//     }
// }

const createCard = (id, innerHtml) => {
    const containers = document.querySelectorAll('.model-notes');
    let elementExists = false;

    console.log(containers, 'model');
    containers.forEach((container) => {
        const shadowRoot = container.shadowRoot;
        console.log(shadowRoot, 'shadow root');
        const existingElement = shadowRoot.getElementById(id);
        if (existingElement) {
            elementExists = true;
            existingElement.innerHTML = innerHtml;
            return;
        }
    });

    if (!elementExists) {
        SimpleShadowDOM.createPopup(id, innerHtml);
    }
}




const injectCards = (noteData) => {
    const content = noteData.content
    const id = noteData.id
    createCard(id, noteData.content)
}