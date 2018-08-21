window.whatsapp = {
    content: 'https://go.onelink.me/2172530114/d1477344',
    imageLink: 'https://media.giphy.com/media/5eFQVUYlv9UPFLLDVk/giphy.gif',
    groupIndex: 0,
};

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.content) {
            whatsapp.content = request.content;
            sendResponse({code: 0});
        } else {
            sendResponse({code: 0, data: whatsapp[request]});
        }
    });