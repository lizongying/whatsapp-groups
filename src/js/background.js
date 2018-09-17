window.whatsapp = {
    isDelete: true,
    isMessage: true,
    isImage: true,
    imageLink: '',
    content: '',
    groupsLink: 'http://songbook.ushow.media/whatsapp/obtain/0/200/',
    groups: [],
    groupsIndex: 0,
    lastPhone: 0,
};

Object.keys(whatsapp).map((item) => {
    chrome.storage.sync.get(item, (result) => {
        if (result[item] !== undefined) {
            whatsapp[item] = result[item];
        }
    });
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request instanceof Array) {
            eval(request[0])(...request.slice(1));
            return
        }
        if (request instanceof Object) {
            Object.keys(request).map((item) => {
                whatsapp[item] = request[item];
                chrome.storage.sync.set({[item]: request[item]});
                chrome.runtime.sendMessage({[item]: request[item]});
            });
            sendResponse({code: 0});
            return
        }
        sendResponse({code: 0, data: whatsapp[request]});
    });

const getGroups = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            const status = xhr.status;
            if (status === 200) {
                const data = xhr.responseText;
                whatsapp.groups = data.replace(/\s/g, '').split(',');
                chrome.runtime.sendMessage({groups: whatsapp.groups});
                if (whatsapp.groups.length) {
                    chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
                        chrome.tabs.sendMessage(tabs[0].id, {groups: whatsapp.groups});
                    });
                } else {
                    alert('no groups');
                }
            } else {
                alert('no groups');
            }
        }
    };
    xhr.open('GET', url, true);
    xhr.send();
};

const setBadge = (text) => {
    chrome.browserAction.setBadgeText(text);
};