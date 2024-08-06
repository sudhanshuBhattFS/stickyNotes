
(async () => {

    const response = await chrome.runtime.sendMessage({ greeting: "hello" });
    // do something with response here, not outside the function

    // inserting a div by creating a shadow dom
    // $x('//div[contains(@class, "shadowDom")]') use this in console to find if the div exist or not  

    // createCardAndUpdate()

})();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.message === "start") {
            const noteData = request.noteData
            createCardAndUpdate(noteData);
            sendResponse({ status: "success" });

        }

        // rename -- note 
        if (request.message === "injectPopUps") {
            const index = request.index
            injectCards(request.noteData, index)
            sendResponse({ status: "success" });
        }

        if (request.action === "removeElementFromDom") {
            const id = request.id
            SimpleShadowDOM.removeElementFromDom(id)
        }

        if (request.message === "hideStickyNotes") {
            const isHidden = request.isHidden

            if (isHidden === true) {
                SimpleShadowDOM.hideAllElementsFromDom()
            } else {
                SimpleShadowDOM.showAllElementsFromDom()
            }
        }

        if (request.action === "updateContentInCard") {
            const noteData = request.note
            createCardAndUpdate(noteData)
        }
    }
);








