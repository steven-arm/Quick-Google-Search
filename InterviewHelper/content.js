if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    var recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;
}

function insertTextAtCursor(text) {
    const el = document.activeElement;
    const tagName = el.tagName.toLowerCase();

    if (tagName === "input" || tagName === "textarea") {
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const value = el.value;

        el.value = value.slice(0, start) + text + value.slice(end);
        el.selectionStart = el.selectionEnd = start + text.length;
    } else if (
        tagName === "div" &&
        el.getAttribute("contenteditable") === "true"
    ) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        range.deleteContents();
        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    const inputEvent = new Event("input", { bubbles: true, cancelable: true });
    el.dispatchEvent(inputEvent);
    const changeEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
    });
    el.dispatchEvent(changeEvent);
}

recognition.onresult = (event) => {
    console.log("Recognized Speech");

    const transcript = event.results[event.results.length - 1][0].transcript;

    if (transcript.toLowerCase().includes("correct")){
        let searchString = transcript.replace(" ", "+");
        searchString = searchString.replace("correct", "");
        var newUrl = "https://www.google.com/search?q=" + searchString;
        //chrome.windows.create({url: newUrl});
        open(newUrl);

        toggleRecognition();

        return;
    }

};

recognition.onend = () => {
    if (!recognition.manualStop) {
        setTimeout(() => {
            recognition.start();
        }, 100);
    }
};

chrome.runtime.onMessage.addListener(function(request){
    if (request.message === "toggleRecognition") {
        toggleRecognition();
    }
});

function toggleRecognition() {
    if (!recognition.manualStop) {
        recognition.manualStop = true;
        recognition.stop();
    } else {
        recognition.manualStop = false;
        recognition.start();
    }
}