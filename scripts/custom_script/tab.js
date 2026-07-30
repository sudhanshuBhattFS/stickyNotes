let selectedNoteContainer = null;
// get note data which has been inserted
let flag = true

function debounceTitle(func, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
let isViewGrid = true
let isSideBarVisible = true
const grid = document.getElementsByClassName('grid')
const containerEle = document.querySelector('.contentContainer');

(async function checkIsView() {
    isViewGrid = await UserLocalStorage.getIsViewGrid()

})()


const getNotesDataInSideBar = async () => {
    const notesData = await UserLocalStorage.retrieveNoteData();
    return notesData;
};

const getSelectedHostName = () => {
    if (!selectedNoteContainer || !document.body.contains(selectedNoteContainer)) {
        return null;
    }

    return selectedNoteContainer.getAttribute('hostName');
};

const getUniqueHostNotes = (notes) => {
    const uniqueSet = new Set();

    return notes.filter((note) => {
        // The global note is surfaced as its own pinned group, not under a host.
        if (UserLocalStorage.isGlobalNote(note)) {
            return false;
        }
        if (uniqueSet.has(note.hostName)) {
            return false;
        }

        uniqueSet.add(note.hostName);
        return true;
    });
};

const getGlobalNoteFrom = (notes) => notes.find((note) => UserLocalStorage.isGlobalNote(note)) || null;

const findSidebarItemByHost = (hostName) => {
    if (!hostName) {
        return null;
    }

    return Array.from(document.querySelectorAll('.noteContainer')).find((noteContainer) => {
        return noteContainer.getAttribute('hostName') === hostName;
    }) || null;
};

// Reflect the visual `.select` state to assistive tech via aria-pressed so a
// screen reader announces which host card is active.
const syncHostCardPressedState = () => {
    document.querySelectorAll('.noteContainer').forEach((noteContainer) => {
        noteContainer.setAttribute('aria-pressed', noteContainer.classList.contains('select') ? 'true' : 'false');
    });
};

const selectSidebarItem = (hostName) => {
    document.querySelectorAll('.noteContainer.select').forEach((noteContainer) => {
        noteContainer.classList.remove('select');
    });

    selectedNoteContainer = findSidebarItemByHost(hostName);

    if (selectedNoteContainer) {
        selectedNoteContainer.classList.add('select');
    }

    syncHostCardPressedState();
    return selectedNoteContainer;
};

const createEmptyState = (message) => {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = message;
    return emptyState;
};

const renderSidebarEmptyState = (message) => {
    const sidebarContainer = document.querySelector('.list_notes');
    sidebarContainer.innerHTML = '';
    sidebarContainer.appendChild(createEmptyState(message));
};

const renderMainEmptyState = (message) => {
    const contentContainer = document.querySelector('.contentContainer');
    contentContainer.innerHTML = '';
    contentContainer.appendChild(createEmptyState(message));
};

const renderMainNotesForHost = (notes, hostName, query = '') => {
    const contentContainer = document.querySelector('.contentContainer');
    contentContainer.innerHTML = '';

    if (!hostName) {
        return;
    }

    let hasRenderedNotes = false;

    notes.forEach((note) => {
        // The global note has its creation host's hostName, but it belongs to
        // its own "Global note" group — never a host's note list.
        if (note.hostName === hostName && !UserLocalStorage.isGlobalNote(note)) {
            hasRenderedNotes = true;
            if (query.trim() !== '') {
                searchAndHighlight(note, query);
            } else {
                insertContentInMain(note);
            }
        }
    });

    if (!hasRenderedNotes) {
        renderMainEmptyState(query.trim() !== '' ? 'No matching notes' : 'No notes saved');
    }
};

const sideBar = document.querySelector('#sideBar')
const stickyNoteSideBar = document.querySelector('.stickyNoteSideBar')
const sideBarImg = document.querySelector('.open-position')

sideBar.addEventListener('click', (event) => {
    isSideBarVisible = !isSideBarVisible

    if (isSideBarVisible === false) {
        // stickyNoteSideBar.style.display = 'none'
        stickyNoteSideBar.classList.add('sideBarCloseBtn')
        sideBar.classList.remove('sideBarOpen')
        sideBar.classList.add('sideBarClose')
        sideBarImg.style.left = "-10px"

    } else {
        stickyNoteSideBar.style.display = 'block'
        stickyNoteSideBar.classList.remove('sideBarCloseBtn')
        sideBar.classList.add('sideBarOpen')
        sideBar.classList.remove('sideBarClose')
        sideBarImg.style.left = "0px"
    }
})

const setView = (cards) => {
    if (isViewGrid) {
        containerEle.classList.remove('flex-column', 'align-items-center', 'd-flex');
        containerEle.classList.add('gridView');
        cards.forEach((card, index) => {
            if (card) {
                card.classList.remove('w-50');
                card.classList.add('w-100')

            } else {
                console.log(`card at index ${index} is undefined`);
            }
        });
    } else {
        containerEle.classList.remove('gridView');
        cards.forEach((card, index) => {
            if (card) {
                card.classList.add('w-50');
                card.classList.remove('w-100');
            } else {
                console.log(`card at index ${index} is undefined`);
            }
        });
        containerEle.classList.add('flex-column', 'align-items-center', 'd-flex');
    }
}
const SVG_NS = 'http://www.w3.org/2000/svg';
// Bootstrap "bi-trash" (filled), matching the popup note-card delete so every
// delete button across the extension uses the same glyph. Rendered filled at a
// 16-viewBox via TRASH_ICON_ATTRS.
const TRASH_ICON_PATHS = [
    { d: 'M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z' },
    { d: 'M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z' }
];
const TRASH_ICON_ATTRS = { fill: 'currentColor', viewBox: '0 0 16 16' };

const NAVIGATION_ICON_PATHS = [
    {
        d: 'M7 17 17 7M9 7h8v8',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
    }
];

// Stroked (wireframe) globe used to mark the global note group and card.
const GLOBE_ICON_PATHS = [
    {
        d: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z',
        stroke: 'currentColor',
        'stroke-width': '1.9'
    },
    {
        d: 'M3 12h18M12 3c2.5 2.4 3.8 5.6 3.8 9S14.5 18.6 12 21c-2.5-2.4-3.8-5.6-3.8-9S9.5 5.4 12 3Z',
        stroke: 'currentColor',
        'stroke-width': '1.7'
    }
];

const createElement = (tagName, className = '') => {
    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    return element;
};

const createSvgIcon = ({ className, paths, attributes = {} }) => {
    const icon = document.createElementNS(SVG_NS, 'svg');
    icon.setAttribute('xmlns', SVG_NS);
    icon.setAttribute('width', '16');
    icon.setAttribute('height', '16');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('class', className);
    icon.setAttribute('viewBox', '0 0 24 24');

    Object.entries(attributes).forEach(([name, value]) => {
        icon.setAttribute(name, value);
    });

    paths.forEach((pathAttributes) => {
        const path = document.createElementNS(SVG_NS, 'path');
        Object.entries(pathAttributes).forEach(([name, value]) => {
            path.setAttribute(name, value);
        });
        icon.appendChild(path);
    });

    return icon;
};

// Build a real, keyboard-operable icon button. The interactive class (used by
// the click handlers and tooltips) lives on the button; the SVG inside is
// decorative and hidden from assistive tech.
const createIconButton = ({ className, label, paths, attributes = {}, iconClassName = 'bi', iconAttributes = {} }) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.setAttribute('aria-label', label);

    Object.entries(attributes).forEach(([name, value]) => {
        button.setAttribute(name, value);
    });

    const icon = createSvgIcon({ className: iconClassName, paths, attributes: iconAttributes });
    icon.setAttribute('aria-hidden', 'true');
    button.appendChild(icon);

    return button;
};

const appendHighlightedText = (element, text, query) => {
    const sourceText = text || '';
    const searchText = query ? query.trim() : '';
    element.textContent = '';

    if (!searchText) {
        element.textContent = sourceText;
        return;
    }

    const lowerSource = sourceText.toLowerCase();
    const lowerSearch = searchText.toLowerCase();
    let cursor = 0;
    let matchIndex = lowerSource.indexOf(lowerSearch, cursor);

    while (matchIndex !== -1) {
        if (matchIndex > cursor) {
            element.appendChild(document.createTextNode(sourceText.slice(cursor, matchIndex)));
        }

        const mark = document.createElement('mark');
        mark.textContent = sourceText.slice(matchIndex, matchIndex + searchText.length);
        element.appendChild(mark);

        cursor = matchIndex + searchText.length;
        matchIndex = lowerSource.indexOf(lowerSearch, cursor);
    }

    if (cursor < sourceText.length) {
        element.appendChild(document.createTextNode(sourceText.slice(cursor)));
    }
};

// html 
const createCardsForNote = (note, query) => {
    const noteContainer = createElement('div', 'd-flex flex-column border border-light noteContainer');
    noteContainer.id = note.id;
    noteContainer.setAttribute('hostName', note.hostName);
    // Keyboard/AT support: the whole card acts as a toggle that shows the
    // host's notes, so expose it as a focusable button with a name and state.
    noteContainer.setAttribute('role', 'button');
    noteContainer.setAttribute('tabindex', '0');
    noteContainer.setAttribute('aria-pressed', 'false');
    noteContainer.setAttribute('aria-label', `Show notes for ${note.hostName}`);

    const header = createElement('div', 'note-header url px-3 py-3 d-flex justify-content-between align-items-center');
    header.dataset.url = note.url;

    const hostName = createElement('div', 'cursor-pointer hostName');
    appendHighlightedText(hostName, note.hostName, query);

    const actions = createElement('div', 'sidebar-card-actions');
    const navigationIcon = createIconButton({
        className: 'navigation toolTipNav',
        label: 'Open this note\'s page in a new tab',
        paths: NAVIGATION_ICON_PATHS,
        attributes: { 'data-url': note.url },
        iconClassName: 'bi bi-arrow-up-right-square'
    });
    const deleteIcon = createIconButton({
        className: 'delete-note custom-margin-10',
        label: 'Delete all notes for this site',
        paths: TRASH_ICON_PATHS,
        iconClassName: 'bi bi-trash',
        iconAttributes: TRASH_ICON_ATTRS
    });

    actions.append(navigationIcon, deleteIcon);
    header.append(hostName, actions);
    noteContainer.appendChild(header);

    return noteContainer;
};

const createMainNoteCard = (note, query) => {
    const id = note.id;
    const isGlobal = UserLocalStorage.isGlobalNote(note);
    const cardClass = isViewGrid ? 'w-100' : 'w-50';
    const colorClass = (!isGlobal && note.color) ? `color-${note.color}` : '';

    const card = createElement('div', `${id} card-size ${cardClass} mx-2 my-2`);
    card.id = 'Cards';

    const heading = createElement('div', `w-100 heading text-dark px-3 py-2 ${colorClass}`);

    // Name row: the editable note name (or the fixed "Global note" label) plus
    // the delete action.
    const nameRow = createElement('div', 'w-100 d-flex justify-content-between align-items-center');

    let nameEl;
    if (isGlobal) {
        nameEl = createElement('div', 'main-note-name');
        nameEl.textContent = 'Global note';
    } else {
        nameEl = createElement('div', 'main-note-name main-note-name--editable');
        nameEl.setAttribute('contenteditable', 'plaintext-only');
        nameEl.dataset.noteId = id;
        nameEl.setAttribute('role', 'textbox');
        nameEl.setAttribute('aria-label', 'Note name');
        nameEl.setAttribute('spellcheck', 'false');
        nameEl.setAttribute('title', 'Rename note');
        nameEl.textContent = UserLocalStorage.getNoteTitle(note);

        const commitName = () => {
            chrome.runtime.sendMessage({
                action: MESSAGE.UPDATE_NOTE_TITLE,
                id: nameEl.dataset.noteId,
                title: nameEl.textContent
            });
        };
        nameEl.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                nameEl.blur();
            }
        });
        nameEl.addEventListener('input', debounceTitle(commitName, 400));
        nameEl.addEventListener('blur', commitName);
    }

    const actionContainer = document.createElement('div');
    const deleteIcon = createIconButton({
        className: 'deleteNoteBtn',
        label: 'Delete note',
        paths: TRASH_ICON_PATHS,
        attributes: { 'unique-id': id },
        iconClassName: 'bi bi-trash',
        iconAttributes: TRASH_ICON_ATTRS
    });
    actionContainer.appendChild(deleteIcon);

    nameRow.append(nameEl, actionContainer);

    // Meta row: date and time.
    const meta = createElement('div', 'note-card-meta');
    const date = createElement('span', 'px-2');
    date.textContent = note.date.replace(/\//g, '-');
    const time = createElement('span', 'px-2');
    time.textContent = note.time;
    meta.append(date, time);

    // The `.heading` is a flex row (shared with the app header), so stack the
    // name row and the meta row inside a single column child instead of letting
    // them become side-by-side flex siblings (which squished the date).
    const headingStack = createElement('div', 'w-100 d-flex flex-column');
    headingStack.append(nameRow, meta);
    heading.appendChild(headingStack);

    const noteBody = createElement('div', 'textAreaForNotes resize border border-light w-100 bg-transparent text-light p-2');
    noteBody.setAttribute('contenteditable', 'true');
    noteBody.setAttribute('uniqueId', id);
    appendHighlightedText(noteBody, note.content, query);

    card.append(heading, noteBody);

    return card;
};



// The global note gets its own pinned sidebar card (globe + label), separate
// from the host groups. It has no host actions; deletion happens from its main
// note card (which broadcasts removal to every tab).
const createGlobalSidebarCard = (note) => {
    const noteContainer = createElement('div', 'd-flex flex-column border border-light noteContainer noteContainer--global');
    noteContainer.id = note.id;
    noteContainer.dataset.scope = 'global';
    noteContainer.setAttribute('role', 'button');
    noteContainer.setAttribute('tabindex', '0');
    noteContainer.setAttribute('aria-pressed', 'false');
    noteContainer.setAttribute('aria-label', 'Show the global note');

    const header = createElement('div', 'note-header px-3 py-3 d-flex justify-content-between align-items-center');

    const label = createElement('div', 'cursor-pointer hostName global-host-label');
    const badge = createSvgIcon({ className: 'global-host-globe', paths: GLOBE_ICON_PATHS });
    badge.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = 'Global note';
    label.append(badge, text);

    header.appendChild(label);
    noteContainer.appendChild(header);

    return noteContainer;
};

// Prepend (or refresh) the pinned global-note card at the top of the sidebar.
const renderGlobalGroup = (notes) => {
    const sidebarList = document.querySelector('.list_notes');
    if (!sidebarList) {
        return;
    }

    const stale = sidebarList.querySelector('.noteContainer--global');
    if (stale) {
        stale.remove();
    }

    const globalNote = getGlobalNoteFrom(notes);
    if (globalNote) {
        sidebarList.prepend(createGlobalSidebarCard(globalNote));
    }
};

const renderMainGlobalNote = (notes) => {
    const contentContainer = document.querySelector('.contentContainer');
    contentContainer.innerHTML = '';

    const globalNote = getGlobalNoteFrom(notes);
    if (!globalNote) {
        renderMainEmptyState('No global note');
        return;
    }

    const card = createMainNoteCard(globalNote);
    card.classList.add('card--global');
    contentContainer.appendChild(card);

    tippy('.deleteNoteBtn', {
        content: getDeleteDes(),
        placement: 'bottom'
    });
};

// logic
const insertContentInSideBar = (note, query) => {
    console.log(query, 'check query')

    const container = document.querySelector('.list_notes');
    container.appendChild(createCardsForNote(note, query));


}


const insertContentInMain = (note) => {
    // for content page 
    const container = document.querySelector('.contentContainer');
    container.appendChild(createMainNoteCard(note));



    // Tooltip for the 'Delete Note' button
    tippy('.deleteNoteBtn', {
        content: getDeleteDes(),
        placement: 'bottom'
    });
    tippy('.toolTipNav', {
        content: getMessageForNav(),
        placement: 'bottom'
    });
    tippy('.delete-note', {
        content: getDeleteAllDescription(),
        placement: 'bottom'
    });

}



// Selection logic for a single sidebar host card, shared by the delegated
// click and keyboard handlers.
const selectHostCard = async (noteContainer) => {
    if (selectedNoteContainer === noteContainer) {
        // Toggle off if the active card is activated again.
        noteContainer.classList.remove('select');
        selectedNoteContainer = null;
        document.querySelector('.contentContainer').innerHTML = '';
    } else {
        if (selectedNoteContainer) {
            selectedNoteContainer.classList.remove('select');
        }

        noteContainer.classList.add('select');
        selectedNoteContainer = noteContainer;

        const storeArr = await UserLocalStorage.retrieveNoteData();

        if (noteContainer.dataset.scope === 'global') {
            // The global note is not host-scoped; render it directly.
            renderMainGlobalNote(storeArr);
        } else {
            const hostName = noteContainer.getAttribute('hostName');
            const searchBox = document.getElementById('searchBox');
            const hasEmptySearch = searchBox.value.trim() === '';

            if (hasEmptySearch === true) {
                renderMainNotesForHost(storeArr, hostName);
            } else {
                insertFilterNote(searchBox.value);
            }
        }

        flag = true;
    }

    syncHostCardPressedState();
    eventListenerForEditBtn();
    eventListenerForDeleteBtn();
};

// Bind sidebar selection once via delegation on the stable list container, so
// re-rendering cards (or re-running selection setup after a delete) never
// stacks duplicate per-card listeners.
const setupSidebarDelegation = () => {
    const sidebarList = document.querySelector('.list_notes');
    if (!sidebarList || sidebarList.dataset.delegationBound === 'true') return;
    sidebarList.dataset.delegationBound = 'true';

    sidebarList.addEventListener('click', (event) => {
        // Action buttons (open / delete) stop propagation, so only plain card
        // clicks reach here.
        const card = event.target.closest('.noteContainer');
        if (!card) return;
        selectHostCard(card);
    });

    sidebarList.addEventListener('keydown', (event) => {
        const card = event.target.closest('.noteContainer');
        // Only when the card itself is focused, not a nested action button.
        if (!card || event.target !== card) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectHostCard(card);
        }
    });
};

const toggleNoteContainerSelection = () => {
    // Default host selection only considers host cards; the pinned global card
    // is selected explicitly by the user, never auto-selected here.
    const noteContainers = document.querySelectorAll('.noteContainer:not(.noteContainer--global)');

    if (noteContainers.length === 0) {
        selectedNoteContainer = null;
        document.querySelector('.contentContainer').innerHTML = '';
        flag = true;
        return;
    }

    if (noteContainers.length > 0) {
        const currentHostName = getSelectedHostName();
        const initialHostName = findSidebarItemByHost(currentHostName)
            ? currentHostName
            : noteContainers[0].getAttribute('hostName');

        // Select the first note container by default
        selectSidebarItem(initialHostName);

        const hostName = getSelectedHostName();

        if (flag) {
            UserLocalStorage.retrieveNoteData().then(async (storeArr) => {
                renderMainNotesForHost(storeArr, hostName);
                eventListenerForEditBtn()
                eventListenerForDeleteBtn()

                const isViewGrid = await UserLocalStorage.getIsViewGrid();
                const cards = document.querySelectorAll('#Cards');
                setView(cards);
                await UserLocalStorage.setIsViewGrid(isViewGrid);
            });
        }


    }


    setupSidebarDelegation();

    flag = true
}


const insertFilterNote = async (query) => {

    const notesData = await getNotesDataInSideBar();
    const hostName = getSelectedHostName();
    const contentContainer = document.querySelector('.contentContainer');
    contentContainer.innerHTML = '';

    if (!hostName) {
        renderMainEmptyState('Select a site to view matching notes');
        return;
    }

    const filteredNotes = notesData.filter(note =>
        note.hostName.toLowerCase().includes(query.toLowerCase()) ||
        (note.content || '').toLowerCase().includes(query.toLowerCase())
    );
    renderMainNotesForHost(filteredNotes, hostName, query);


}

const eventListenerForDeleteBtn = () => {
    document.querySelectorAll('.deleteNoteBtn').forEach((deleteBtn) => {

        deleteBtn.addEventListener('click', async (event) => {
            if (confirm(getDeleteMsg())) {
                const deleteBtn = event.currentTarget
                // Ensure you're using the correct attribute name
                const id = deleteBtn.getAttribute('unique-id');
                // Use querySelector to find the card element with the id
                const cardToRemove = document.querySelector(`.${CSS.escape(id)}`);

                if (cardToRemove) {
                    cardToRemove.remove();

                    const noteArr = await UserLocalStorage.retrieveNoteData()
                    const deletedNote = noteArr.find(note => note.id === id)
                    const filerArr = noteArr.filter(note => note.id !== id)
                    await UserLocalStorage.setStorage(filerArr)

                    chrome.tabs.query({}, function (tabs) {
                        tabs.forEach(tab => {
                            sendMessageToTab(tab.id, { action: MESSAGE.REMOVE_ELEMENT_FROM_DOM, id: id });
                        });
                    });

                    // Deleting the global note removes its pinned sidebar card too,
                    // so the sidebar does not keep a stale entry.
                    if (UserLocalStorage.isGlobalNote(deletedNote)) {
                        const globalCard = document.querySelector('.noteContainer--global');
                        if (globalCard) {
                            if (selectedNoteContainer === globalCard) {
                                selectedNoteContainer = null;
                            }
                            globalCard.remove();
                        }
                    }

                    toggleNoteContainerSelection()

                } else {
                    console.error(`Element with class ${id} not found.`);
                }
            }
        })
    })
}


const eventListenerForEditBtn = () => {
    document.querySelectorAll('.textAreaForNotes').forEach((textArea) => {
        // Make each textarea content editable
        textArea.setAttribute('contenteditable', 'true');

        // Add event listener for input
        const debouncedUpdate = debounce(() => {
            const updatedContent = textArea.innerText;
            const id = textArea.getAttribute('uniqueId');

            // Send the updated content to the background script or storage
            chrome.runtime.sendMessage({
                action: MESSAGE.UPDATE_NOTE_CONTENT,
                id: id,
                content: updatedContent
            });
        }, 500); // Adjust the delay as needed

        textArea.addEventListener('input', debouncedUpdate);

        // Focus and move cursor to the end when user clicks on the textarea
        textArea.addEventListener('focus', () => {
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(textArea);
            range.collapse(false); // Collapse to end of the content
            selection.removeAllRanges();
            selection.addRange(range);
        });
    });

    // Debounce function to delay the execution of a function
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }


}
const searchAndHighlight = (note, query) => {
    console.log(note, 'check note')
    const container = document.querySelector('.contentContainer');
    container.appendChild(createMainNoteCard(note, query));

    // Initialize tooltips for buttons
    tippy('.deleteNoteBtn', {
        content: getDeleteDes(),
        placement: 'bottom'
    });
    tippy('.toolTipNav', {
        content: getMessageForNav(),
        placement: 'bottom'
    });
    tippy('.delete-note', {
        content: getDeleteAllDescription(),
        placement: 'bottom'
    });
};


const filterNotes = async (query) => {
    const notesData = await getNotesDataInSideBar();
    const previousHostName = getSelectedHostName();

    // Clear current notes
    const sidebarContainer = document.querySelector('.list_notes');
    sidebarContainer.innerHTML = '';

    const mainContainer = document.querySelector('.contentContainer');
    mainContainer.innerHTML = '';

    // Filter notes based on query
    const filteredNotes = notesData.filter(note =>
        note.hostName.toLowerCase().includes(query.toLowerCase()) ||
        (note.content || '').toLowerCase().includes(query.toLowerCase())
    );

    // Display filtered notes in sidebar and main container
    const noteArr = getUniqueHostNotes(filteredNotes);

    if (noteArr.length === 0) {
        selectedNoteContainer = null;
        renderSidebarEmptyState(query.trim() === '' ? 'No notes saved' : 'No matching sites');
        renderMainEmptyState(query.trim() === '' ? 'No notes saved' : 'No matching notes');
        // The global note stays pinned at the top regardless of the query.
        renderGlobalGroup(notesData);
        flag = false;
        return;
    }

    noteArr.forEach(note => {
        insertContentInSideBar(note, query);  // Inserting into the sidebar as usual
    });

    const firstMatchingHostName = noteArr.length > 0 ? noteArr[0].hostName : null;
    const hostName = noteArr.some(note => note.hostName === previousHostName) ? previousHostName : firstMatchingHostName;
    selectSidebarItem(hostName);

    renderMainNotesForHost(filteredNotes, hostName, query);

    flag = false;
    eventListenerForNavigation();
    eventListenerForEditBtn();
    eventListenerForDeleteBtn();
    eventListenerForDeleteAllHostNote();
    toggleNoteContainerSelection();

    // Keep the global note pinned at the top of the sidebar after the rebuild.
    renderGlobalGroup(notesData);
};

const eventListenerForDeleteAllHostNote = () => {

    document.querySelectorAll('.delete-note').forEach(deleteButton => {

        deleteButton.addEventListener('click', (event) => {
            const message = getDeleteMessage()
            if (confirm(getDeleteAllMsg())) {
                event.stopPropagation();
                (deleteButton, 'deletebtn remove')
                deleteButton.closest('.noteContainer').remove();
                const hostName = deleteButton.closest('.noteContainer').getAttribute('hostName')
                const id = deleteButton.closest('.noteContainer').id

                // remove logic for main container 
                const contentContainer = document.querySelector('.contentContainer');
                contentContainer.innerHTML = '';
                chrome.runtime.sendMessage({ action: MESSAGE.REMOVE_USING_HOST_NAME, hostName: hostName },);
                toggleNoteContainerSelection()

            }
        });
    });
}
const eventListenerForNavigation = () => {
    // event lister for visit web pages 
    document.querySelectorAll('.navigation').forEach(hostElement => {
        hostElement.addEventListener('click', (event) => {

            event.stopPropagation();
            const url = event.currentTarget.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
}

const handleCardData = async () => {
    // Get all the note data 
    const notesData = await getNotesDataInSideBar();


    if (notesData) {
        const noteArr = getUniqueHostNotes(notesData);
        const globalNote = getGlobalNoteFrom(notesData);

        if (noteArr.length === 0 && !globalNote) {
            selectedNoteContainer = null;
            renderSidebarEmptyState('No notes saved');
            renderMainEmptyState('No notes saved');
        }

        noteArr.forEach(note => {
            //    for side bar
            insertContentInSideBar(note)
        });

        if (noteArr.length > 0) {
            toggleNoteContainerSelection()
        }

        // Pin the global note's card to the top of the sidebar (after host
        // selection so it never becomes the default host).
        renderGlobalGroup(notesData);

        // Ensure delegated sidebar selection is bound even when there are no
        // host cards (global note only), since toggleNoteContainerSelection —
        // which normally binds it — is skipped in that case.
        setupSidebarDelegation();

        // If the global note is the only note, select it by default so the page
        // is not left blank.
        if (noteArr.length === 0 && globalNote) {
            const globalCard = document.querySelector('.noteContainer--global');
            if (globalCard) {
                selectHostCard(globalCard);
            }
        }

        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('navigate')) {
                const url = event.target.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            }
        });

        //
    }

    // event handling 
    eventListenerForNavigation()
    eventListenerForEditBtn()
    eventListenerForDeleteBtn()
    eventListenerForDeleteAllHostNote()

    grid[0].addEventListener('click', async (event) => {
        isViewGrid = !isViewGrid;
        const cards = document.querySelectorAll('#Cards')
        setView(cards)
        await UserLocalStorage.setIsViewGrid(isViewGrid)
    });

    document.getElementById('searchBox').addEventListener('input', (event) => {
        const query = event.target.value;
        filterNotes(query);
    });
    document.getElementById('refresh').addEventListener('click', () => {
        location.reload();
    });


};


// IIFE
(() => {
    // This function creates all the note cards 
    handleCardData();
})();


