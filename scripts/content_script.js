
(async () => {
    console.log('content scrupt is running !')
    const response = await chrome.runtime.sendMessage({ greeting: "hello" });
    // do something with response here, not outside the function

    // inserting a div by creating a shadow dom
    // $x('//div[contains(@class, "shadowDom")]') use this in console to find if the div exist or not  

    // createCard()

})();

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log({ request })
        if (request.message === "start") {
            createCard()
        }
    }
);







