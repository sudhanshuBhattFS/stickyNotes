

class SimpleShadowDOM {
    static getHtmlTemplate(note) {

        const content = note.content
        const id = note.id

        const pinClass = note.enablePin ? 'selected' : 'disable';
        const colorClass = note.color ? `color-${note.color}` : '';
        console.log(colorClass, 'check color class ')

        return `
       <div uniqueId="${id}" class="note-container">
    <div class="note-title ${colorClass}">
        <button class="add-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
            </svg>
        </button>
        <span class='heading' contenteditable="true">Stick it </span>
        <div class="dropdown">
            <button id="options" class="options">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                </svg>
            </button>
                    <button pinId="${id}" class="bg-transparent ${pinClass} pin">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle" viewBox="0 0 16 16">
                           <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146"/>
                       </svg>
                    </button>
                    <button uniqueId="${id}" class="close-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                    </button>
        </div>
    </div>
  <div class="color-palette">
    <button class="btn color-btn  color-red" data-color="red"></button>
    <button class="btn color-btn color-yellow " data-color="yellow" ></button>
    <button class="btn color-btn color-default" data-color="default" ></button>
    <button class="btn color-btn color-grey " data-color="grey" "></button>
    <button class="btn color-btn  color-purple" data-color="purple" ></button>
    <button class="btn color-btn color-pink" data-color="pink" ></button>
    </div>
    <div id="${id}" class='textarea' contenteditable="true">${content}</div>
        <div class="resize-handle top"></div>
    <div class="resize-handle right"></div>
    <div class="resize-handle bottom"></div>
    <div class="resize-handle left"></div>
    </div>
</div>

        `;
    }

    static createPopup(note) {
        const id = note.id
        const position = note.position
        const size = { width: note.width, height: note.height }

        const container = document.createElement('div');
        container.className = 'model-notes';
        const shadowRoot = container.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = SimpleShadowDOM.getHtmlTemplate(note);

        document.body.appendChild(container);

        // for tranisition 
        const noteContainer = shadowRoot.querySelector('.note-container')

        // Trigger the zoom-in transition by adding the 'show' class
        setTimeout(() => {
            noteContainer.classList.add('show');
        }, 50);


        // stylesheet
        addStyleSheetlink(shadowRoot);

        // draggable    
        makeDraggable(shadowRoot.querySelector('.note-container'), shadowRoot.querySelector('.note-title'), id, position);

        // handling all the events for the note 
        eventListenerForNote(shadowRoot, container, noteContainer);

        // resizable
        makeResizable(shadowRoot.querySelector('.note-container'), size);

        // Tooltip for the 'Delete Note' button
    }

    static removeElementFromDom(id) {
        const containers = document.querySelectorAll('.model-notes');
        if (containers) {
            containers.forEach((container) => {
                const shadowRoot = container.shadowRoot;
                const existingElement = shadowRoot.getElementById(id);
                if (existingElement) {
                    existingElement.parentElement.remove();
                }
            });
        }
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
                    pinBtn.classList.add('disable');
                    enablePin = false;
                } else {
                    pinBtn.classList.add('selected');
                    pinBtn.classList.remove('disable');
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

const makeResizable = (element, size) => {
    if (size && size.width !== undefined && size.height !== undefined) {
        element.style.width = `${size.width}px`;
        element.style.height = `${size.height}px`;
    }

    const handles = {
        top: element.querySelector('.resize-handle.top'),
        right: element.querySelector('.resize-handle.right'),
        bottom: element.querySelector('.resize-handle.bottom'),
        left: element.querySelector('.resize-handle.left'),
    };

    let startX, startY, startWidth, startHeight, startLeft, startTop, direction;

    const resize = (e) => {
        if (direction === 'right') {
            element.style.width = `${startWidth + (e.clientX - startX)}px`;
        } else if (direction === 'bottom') {
            element.style.height = `${startHeight + (e.clientY - startY)}px`;
        } else if (direction === 'left') {
            const newWidth = startWidth - (e.clientX - startX);
            if (newWidth > 0) {
                element.style.width = `${newWidth}px`;
                element.style.left = `${startLeft + (e.clientX - startX)}px`;
            }
        } else if (direction === 'top') {
            const newHeight = startHeight - (e.clientY - startY);
            if (newHeight > 0) {
                element.style.height = `${newHeight}px`;
                element.style.top = `${startTop + (e.clientY - startY)}px`;
            }
        }
    };

    const stopResize = () => {
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);

        const width = element.offsetWidth;
        const height = element.offsetHeight;
        const id = element.getAttribute('uniqueId');

        // Send size updates to background or storage
        chrome.runtime.sendMessage({
            action: 'StoreAndUpdateWidthAndHeight',
            id: id,
            width: width,
            height: height,
        });
    };

    const startResize = (e, resizeDirection) => {
        startX = e.clientX;
        startY = e.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        startLeft = element.offsetLeft;  // Capture initial left position
        startTop = element.offsetTop;    // Capture initial top position
        direction = resizeDirection;

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    };

    handles.right.addEventListener('mousedown', (e) => startResize(e, 'right'));
    handles.bottom.addEventListener('mousedown', (e) => startResize(e, 'bottom'));
    handles.left.addEventListener('mousedown', (e) => startResize(e, 'left'));
    handles.top.addEventListener('mousedown', (e) => startResize(e, 'top'));
};




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
        SimpleShadowDOM.createPopup(note);
    }
};

// No need for this method, change this code ---
const injectCards = (noteData) => {
    createCardAndUpdate(noteData);
}
