

class SimpleShadowDOM {
    static getHtmlTemplate(heading, id, content, hostName, enablePin) {

        const pinClass = enablePin ? 'selected' : '';
        return `
        <div uniqueId="${id}" class="note-container">
            <div class="note-title">
                <button class="add-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
</svg></button>
                <span contenteditable="true">${heading}</span>
                <div>
                <button pinId="${id}" class="bg-transparent ${pinClass} pin">
                <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi  bi-pin-angle" viewBox="0 0 16 16">
  <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146m.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a5 5 0 0 0-.288-.076 5 5 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a5 5 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034q.172.002.343-.04L9.927 2.028q-.042.172-.04.343a1.8 1.8 0 0 0 .062.46z"/>
</svg>
                </button>
              
                <button uniqueId="${id}" class="close-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
</svg>
                </button>
  </div>
            </div>
            <div id="${id}" class='textarea' contenteditable="true">${content}</div>
        </div>
        `;
    }

    static createPopup(id, innerContent, hostName, enablePin, position) {

        const heading = getHeading();
        const container = document.createElement('div');
        container.className = 'model-notes';
        const shadowRoot = container.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = SimpleShadowDOM.getHtmlTemplate(heading, id, innerContent, hostName, enablePin);

        document.body.appendChild(container);

        // stylesheet
        addStyleSheetlink(shadowRoot);

        // draggable
        makeDraggable(shadowRoot.querySelector('.note-container'), shadowRoot.querySelector('.note-title'), id, position);

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

    static updatePin(id) {
        const containers = document.querySelectorAll('.model-notes');

        for (const container of containers) {
            const shadowRoot = container.shadowRoot;
            const pinBtn = shadowRoot.querySelector(`[pinId="${id}"]`);

            if (pinBtn) {
                let enablePin = true;

                if (pinBtn.classList.contains('selected')) {
                    pinBtn.classList.remove('selected');
                    enablePin = false;
                } else {
                    pinBtn.classList.add('selected');
                }


                // Exit the loop once the element is found and updated
                break;
            }
        }

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
    const pinEnable = note.enablePin
    const position = note.position


    const containers = document.querySelectorAll('.model-notes');
    let elementExists = false;

    // if element existed
    containers.forEach((container) => {
        const shadowRoot = container.shadowRoot;
        const existingElement = shadowRoot.getElementById(id);
        if (existingElement) {
            elementExists = true;
            existingElement.innerHTML = innerHtml; // Insert content with <br> tags
            return;
        }
    });

    // if the element did not exist 
    if (!elementExists) {
        SimpleShadowDOM.createPopup(id, innerHtml, hostName, pinEnable, position);
    }
};

// No need for this method, change this code ---
const injectCards = (noteData) => {
    createCardAndUpdate(noteData);
}
