if (!window.recognition) {
    window.recognition = new webkitSpeechRecognition();
}
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.continuous = true;

recognition.onresult = (event) => {
    console.log("Recognized Speech");

    const transcript = event.results[event.results.length - 1][0].transcript;

    insertTextAtCursor(transcript);
};

chrome.runtime.onMessage.addListener((request) => {
    if (request.command === "toggleRecognition") {
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