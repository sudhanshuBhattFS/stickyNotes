


(async () => {
    console.log('content scrupt is running !')
    const response = await chrome.runtime.sendMessage({ greeting: "hello" });
    // do something with response here, not outside the function

    // inserting a div by creating a shadow dom
    // $x('//div[contains(@class, "shadowDom")]') use this in console to find if the div exist or not  

})();


const createCard = () => {
    // Create a container element with Shadow DOM
    let i = 0
    const container = document.createElement('div');
    container.className = 'modal';
    container.id = `model${i}`
    i++
    container.style.position = 'absolute'; // Changed to absolute
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.background = '#333';
    container.style.color = 'white';
    container.style.borderRadius = '5px';
    container.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    container.style.width = '30%'
    container.style.height = '40%'
    container.style.zIndex = '99999'
    container.draggable = true; // Added draggable attribute
    const shadowRoot = container.attachShadow({ mode: 'open' });

    // Add your HTML content to the Shadow Root
    shadowRoot.innerHTML = `
    <div style=" display: flex;justify-content: space-between; background-color : yellow ; color : black ; padding : 10px " class="header"><button style="background: transparent;" class="add-btn">+</button></div>
      <div class="modal-content" style="
    background: transparent;
     color: wheat; 
     width: 950%; 
    height: 90%;
    border: none;
    padding : 10px ;
    outline : none ;
"  contenteditable="true"> Write Something..</div>
    `;

    // adding close button
    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-btn';
    closeButton.textContent = 'Close';
    const clsBtnStyle = closeButton.style
    clsBtnStyle
    shadowRoot.querySelector('.header').appendChild(closeButton);

    // Add an event listener to the close button
    closeButton.addEventListener('click', () => {
        container.remove();
    });


    // Append the container to the page
    document.body.appendChild(container);
    console.log('Card inserted');

    makeDraggable(container, shadowRoot.querySelector('.header'));
    shadowRoot.querySelector('.add-btn').addEventListener('click', createCard);

}


// make sure to read the add comments to understand how the function is working 
const makeDraggable = (element, handle) => {

    let isDragging = false;
    let startX, startY, initialMouseX, initialMouseY;

    const mouseDownHandler = (e) => {
        isDragging = true;
        startX = element.offsetLeft;
        startY = element.offsetTop;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);

        e.preventDefault(); // Prevent text selection
    };

    const mouseMoveHandler = (e) => {
        if (!isDragging) return;

        // it basically add or subtract from its initial position 
        const dx = e.clientX - initialMouseX;
        const dy = e.clientY - initialMouseY;

        element.style.left = `${startX + dx}px`;
        element.style.top = `${startY + dy}px`;
    };

    const mouseUpHandler = () => {
        isDragging = false;
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    handle.addEventListener('mousedown', mouseDownHandler);
};






// listening to the message in the content script 
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.action === 'my_action') {
//         console.log(request.data); // prints "hello"
//     }
// });



chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log({ request })
        if (request.message === "start") {
            createCard()
        }
    }
);

function start() {
    alert("started");
}



//  we can use the same message receving process as we used in background script
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.action === 'my_action') {
//         console.log(request.data); // prints "hello"
//     }
// });






