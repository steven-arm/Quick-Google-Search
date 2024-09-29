async function open_website() {
    var newUrl = "https://google.com";
    chrome.tabs.create({url: newUrl});
}
chrome.commands.onCommand.addListener((command) =>{
    if (command === "test_command") {
        open_website();
    }
});