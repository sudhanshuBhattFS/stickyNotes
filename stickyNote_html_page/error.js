const seeAllNotes = document.getElementById('seeAllNotes')


seeAllNotes.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'createTabAndInject' });
    // UserLocalStorage.deleteNoteData()
});