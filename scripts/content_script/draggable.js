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