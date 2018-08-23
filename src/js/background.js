window.whatsapp = {
    isDelete: true,
    isMessage: true,
    isImage: true,
    imageLink: 'https://media.giphy.com/media/8lHkrNcowsQJ9MSy9m/giphy.gif',
    content: 'StarMaker appeal to our users and the public to #StandWithKerala/Kodagu. Donate for Kerala and Kodagu to spread your love, write down your best wishes for the people who are waiting for rescue. As long as everyone give a little love, we can light up the darkest time of the country.\n' +
    '👇👇👇👇👇👇👇👇\n' +
    'https://m.starmakerstudios.com/t?promotion_id=1153&showBar=1&showNavigation=true&new=true',
    groupsLink: 'https://m1res-1256122840.cos.ap-mumbai.myqcloud.com/whatsapp_group/',
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
        if (request instanceof Object) {
            Object.keys(request).map((item) => {
                whatsapp[item] = request[item];
                chrome.storage.sync.set({[item]: request[item]});
            });
            sendResponse({code: 0});
        } else {
            sendResponse({code: 0, data: whatsapp[request]});
        }
    });