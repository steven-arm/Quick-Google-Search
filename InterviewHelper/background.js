async function open_website() {
    var newUrl = "https://google.com";
    chrome.windows.create({url: newUrl});
}
async function start_listening() {
    const [activeTab] = await chrome.tabs.query ({active: true, currentWindow: true});
    chrome.tabs.sendMessage(activeTab.id, {command:"toggleRecognition"});
}
chrome.commands.onCommand.addListener((command) =>{
    if (command === "test_command") {
        open_website();
    }
});