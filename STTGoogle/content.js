// set up speech recognition
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    var recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;
}

//made this async for error checking, may not be necessary
async function runSearchData(url) {
    console.log(typeof url);
    console.log(url);
    chrome.runtime.sendMessage({action: "openWindow", url: url});
}

// runs every word
recognition.onresult = (event) => {
    console.log("Recognized Speech");

    const transcript = event.results[event.results.length - 1][0].transcript;

    // end phrase
    if (transcript.toLowerCase().includes("mistaken")){
        // create a google query minus end word
        toggleRecognition();
        setTimeout(() => {
            chrome.runtime.sendMessage({action: "closeWindow"});
        }, 1000);
        return;
    }

    //search word
    if (transcript.toLowerCase().includes("correct")){
        transcript.replace("correct", "");
        // create a google query minus end word
        //toggleRecognition();
        var searchString = transcript.replace("correct", "").trim();
        var newUrl = "https://www.google.com/search?q=" + encodeURIComponent(searchString);
        runSearchData(newUrl);
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

// message listener -> received from service_worker usually
chrome.runtime.onMessage.addListener(function(request){
    if (request.message === "toggleRecognition") {
        toggleRecognition();
    }
    if (request.message === "getAnswer"){
        //getAnswer();
    }
});

// basic toggle
function toggleRecognition() {
    if (!recognition.manualStop) {
        recognition.manualStop = true;
        recognition.stop();
    } else {
        recognition.manualStop = false;
        recognition.start();
    }
}

// strip google page for answer using known css guidelines to get first emphasized text
function getAnswer(){
    const featured = getFeaturedText();
    if(featured) return featured;

    const em = document.querySelector("#rs em");
    const content = em.textContent;
    
    return content;
}

// get text in the featured field (preferred answer)
const getFeaturedText = () => {
    const h2s = document.getElementsByTagName('h2');
    for(let h2 of h2s){
      if(h2.innerText === 'Featured snippet from the web'){
          const parent = h2.closest('.MjjYud');
          return parent.querySelector('b').textContent;
      }
    }
    return undefined;
  }