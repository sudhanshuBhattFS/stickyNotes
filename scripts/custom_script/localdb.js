class UserLocalStorage {
    // get note data 
    static retriveNoteData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('notes', (result) => {

                if (result.notes) {  // Corrected 'notes' to 'note'
                    resolve(result.notes);
                } else {
                    reject(null);
                }
            });
        });
    }
    // remove all note data 
    static deleteNoteData(noteId) {
        chrome.storage.local.clear(() => { });
    }

    // update note data 
    static setStorage(noteArr) {
        chrome.storage.local.set({ notes: noteArr });
    }
}

