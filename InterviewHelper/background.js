async function start_listening() {
    //send message to content script to get microphone data
    await chrome.tabs.query ({active: true, currentWindow: true}, function(tabs){
        let activeTab = tabs[0];

        chrome.tabs.sendMessage(activeTab.id, {message:"toggleRecognition"});
    });
}

chrome.commands.onCommand.addListener((command) =>{
    //intital command
    if (command === "test_command") {
        start_listening();
    }
});

var closeTabId;

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "openWindow") {
        // create new search query window that is focused
        chrome.windows.create({
            url: message.url,
            type: 'normal'
        }, function(window) {
            
            // wait for the tab to load
            let tabId = window.tabs[0].id;
            closeTabId = tabId;
            chrome.tabs.onUpdated.addListener(function(updatedTabId, changeInfo, tab){

                // send page reading message to loaded tab
                if (updatedTabId === tabId && changeInfo.status === 'complete') {
                    chrome.tabs.sendMessage(tabId, {message:"getAnswer"});
                }

            });
        });
    }

    if (message.action === "closeWindow"){
        try {
            chrome.tabs.remove(closeTabId);
        } catch (error) {
            console.error(error);
        }
    }
});
