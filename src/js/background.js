window.whatsapp = {
    media: '',
    mediaLink: '',
    mediaBase64: '',
    content: '',
    link: '',
    mentioned: [],
    groupsLink: 'http://songbook.ushow.media/whatsapp/obtain/0/200/',
    groups: [],
    sendInterval: 300,
    groupsInterval: 300,
    groupsIndex: 0,
    lastPhone: 0,
    chatsIndex: 0,
    name: '',
    status: '',
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
        if (request.indexOf(',') > -1) {
            const arr = request.split(',');
            const data = arr.map((v) => {
                return whatsapp[v]
            });
            sendResponse({code: 0, data: data});
            return
        }
        sendResponse({code: 0, data: whatsapp[request]});
    });

const getGroups = () => {
    if (whatsapp.groups.length) {
        chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {groups: whatsapp.groups});
        });
        return
    }
    if (!whatsapp.groupsLink) {
        alert('no groups');
        return
    }
    const url = whatsapp.groupsLink + whatsapp.lastPhone;
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


const mediaPreview = () => {
    if (whatsapp.mediaBase64) {
        chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {mediaBase64: whatsapp.mediaBase64});
        });
        return
    }
    if (!whatsapp.mediaLink) {
        chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {mediaBase64: ''});
        });
        return
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', whatsapp.mediaLink, true);
    xhr.responseType = 'blob';
    xhr.onload = () => {
        const status = xhr.status;
        if (status === 200) {
            const type = xhr.getResponseHeader('Content-Type');
            const random_name = Math.random().toString(36).substr(2, 5);
            const file = new File([xhr.response], random_name, {
                type: type,
                lastModified: Date.now()
            });
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                whatsapp.mediaBase64 = reader.result;
                chrome.tabs.query({'active': true, currentWindow: true}, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, {mediaBase64: whatsapp.mediaBase64});
                });
            }, false);
            if (file) {
                reader.readAsDataURL(file);
            }
        }
    };
    xhr.send();
};

const setBadge = (text) => {
    chrome.browserAction.setBadgeText(text);
};