class UserLocalStorage {
    // get note data 
    static retriveNoteData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('notes', (result) => {
                console.log(result, 'result')
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


    // pin 
    static async updateNote(updateNotes, pin) {
        try {
            const allNotes = await this.retriveNoteData(); // Retrieve all notes

            // Map through allNotes to update specific notes based on updateNotes array
            const updatedNotes = allNotes.map(note => {
                // Find the matching note in updateNotes by id
                const matchedNote = updateNotes.find(updatedNote => updatedNote.id === note.id);

                if (matchedNote) {
                    // Update enablePin value if the note is found in updateNotes
                    return { ...note, enablePin: matchedNote.enablePin };
                }

                // Return the note unchanged if it doesn't match any in updateNotes
                return note;
            });

            console.log(updatedNotes, 'updated notes')
            // Save the updated notes back to storage
            await this.setStorage(updatedNotes);

        } catch (error) {
            console.error('Error updating notes:', error);
        }
    }


    static setPin(enableAllPin) {

    }

    static getPin() {

    }



}

