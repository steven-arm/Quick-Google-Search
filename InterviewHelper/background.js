async function open_website() {
    var newUrl = "https://google.com";
    chrome.windows.create({url: newUrl});
}
async function start_listening() {
    await chrome.tabs.query ({active: true, currentWindow: true}, function(tabs){
        let activeTab = tabs[0];

        chrome.tabs.sendMessage(activeTab.id, {message:"toggleRecognition"});
    });
}
chrome.commands.onCommand.addListener((command) =>{
    if (command === "test_command") {
        start_listening();
    }
});
