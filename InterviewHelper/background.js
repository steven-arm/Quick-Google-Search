async function open_website() {
    var newUrl = "https://google.com";
    chrome.tabs.create({url: newUrl});
}
async function start_listening() {
    
}
chrome.commands.onCommand.addListener((command) =>{
    if (command === "test_command") {
        open_website();
    }
});