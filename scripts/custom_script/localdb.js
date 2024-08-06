class UserLocalStorage {
    // get note data 
    static retriveNoteData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('notes', (result) => {

                if (result.notes) {  // Corrected 'notes' to 'note'
                    resolve(result.notes);
                } else {
                    reject([]);
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

    static setIsHidden(isHidden) {
        chrome.storage.local.set({ isHidden: isHidden });
    }

    static getIsHidden() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('isHidden', (result) => {
                if (result.isHidden) {
                    resolve(result.isHidden)
                } else {
                    resolve(false)
                }
            })
        })
    }
    static removeIsHidden() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.remove('isHidden', () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    }

    static setIsViewGrid(isViewGrid) {
        chrome.storage.local.set({ isViewGrid: isViewGrid });
    }

    static getIsViewGrid() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('isViewGrid', (result) => {
                if (result.isViewGrid) {
                    resolve(result.isViewGrid)
                } else {
                    resolve(false)
                }
            })
        })
    }


}

