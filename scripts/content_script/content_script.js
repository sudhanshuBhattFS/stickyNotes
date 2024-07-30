
(async () => {

    const response = await chrome.runtime.sendMessage({ greeting: "hello" });
    // do something with response here, not outside the function

    // inserting a div by creating a shadow dom
    // $x('//div[contains(@class, "shadowDom")]') use this in console to find if the div exist or not  

    // createCard()

})();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.message === "start") {

            const noteData = request.noteData
            const content = 'Write Something ...'
            const id = noteData.id
            createCard(id, content);
            sendResponse({ status: "success" });

        }
        if (request.message === "injectPopUps") {
            console.log(request.noteData)
            injectCards(request.noteData)
            sendResponse({ status: "success" });
        }
        // Return true to indicate you want to send a response asynchronously
        return true;
    }
);








