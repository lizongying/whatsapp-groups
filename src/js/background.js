window.whatsapp = {
    isDelete: true,
    isMessage: true,
    isImage: true,
    imageLink: 'https://media.giphy.com/media/8lHkrNcowsQJ9MSy9m/giphy.gif',
    content: 'StarMaker appeal to our users and the public to #StandWithKerala/Kodagu. Donate for Kerala and Kodagu to spread your love, write down your best wishes for the people who are waiting for rescue. As long as everyone give a little love, we can light up the darkest time of the country.\n' +
    '👇👇👇👇👇👇👇👇\n' +
    'https://m.starmakerstudios.com/t?promotion_id=1153&showBar=1&showNavigation=true&new=true',
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
            });
            sendResponse({code: 0});
            return
        }
        sendResponse({code: 0, data: whatsapp[request]});
    });

const get_groups = (url) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            const status = xhr.status;
            if (status === 200) {
                const data = xhr.responseText;
                whatsapp.groups = data.replace(/\s/g, '').split(',');
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
