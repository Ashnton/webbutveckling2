function toggle(clickableElementId, elementToToggleId) {
    const clickableElement = document.getElementById(clickableElementId);
    const elementToToggle = document.getElementById(elementToToggleId);

    if (elementToToggle.getAttribute("data-visible") == "false") {
        clickableElement.innerText = "Visa mindre";
        elementToToggle.setAttribute("data-visible", "true");
        elementToToggle.classList.remove("text-hidden");
    } else if (elementToToggle.getAttribute("data-visible") == "true") {
        clickableElement.innerText = "Läs mer";
        elementToToggle.setAttribute("data-visible", "false");
        elementToToggle.classList.add('text-hidden')
    }
}