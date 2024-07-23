const eventListenerForNote = (shadowRoot, container) => {
    // add btn 
    shadowRoot.querySelector('.add-btn').addEventListener('click', SimpleShadowDOM.createPopup);

    // clove btn 
    const closeBtn = shadowRoot.querySelector('.close-btn');

    closeBtn.addEventListener('click', () => {
        container.remove();
    });

    closeBtn.addEventListener('mouseover', () => {
        closeBtn.style.background = '#ff5757';
        closeBtn.style.color = 'white'
    });

    closeBtn.addEventListener('mouseout', () => {
        closeBtn.style.background = '';
        closeBtn.style.color = 'black'
    });
}