import '../css/popup.css'

const whatsapp = chrome.extension.getBackgroundPage().whatsapp;

$(() => {
    const checkUrl = (url) => {
        if (url !== '') {
            const reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (reg.test(url)) {
                return true
            }
        }
        return false
    };

    const checkLink = (text) => {
        if (checkUrl(text)) {
            return text;
        }
        return ''
    };

    const checkMentioned = (text) => {
        const res = (text + ' ').match(/@\d+\s/g);
        if (res) {
            return res.map((v) => {
                return v.replace('@', '').replace(' ', '') + '@c.us';
            });
        }
        return []
    };

    const checkMediaLink = (text) => {
        if (checkUrl(text)) {
            return text;
        }
        return ''
    };

    const checkMediaBase64 = (text) => {
        if (whatsapp.media && !checkUrl(text)) {
            return text;
        }
        return ''
    };

    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (request['lastPhone'] !== undefined) {
                $('#last-phone').html(whatsapp.lastPhone);
            }
            if (request['groups'] !== undefined) {
                $('#groups').html(whatsapp.groups.join(', '));
                $('#groups-count').html(whatsapp.groups.length);
            }
        });

    $('#set').click(() => {
        const media = $('#media').val().trim();
        const content = $('#content').val().trim();
        const groups = $('#groups').val().replace(/\s/g, '').split(',').filter((item) => {
            return item
        });
        const groupsLink = $('#groups-link').val().trim();
        const sendInterval = parseInt($('#send-interval').val());
        const groupsInterval = parseInt($('#groups-interval').val());
        const name = $('#name').val().trim();
        const status = $('#status').val().trim();
        whatsapp.media = media;
        chrome.storage.sync.set({media: media});
        whatsapp.mediaLink = checkMediaLink(media);
        chrome.storage.sync.set({mediaLink: whatsapp.mediaLink});
        whatsapp.mediaBase64 = checkMediaBase64(media);
        chrome.storage.sync.set({mediaBase64: whatsapp.mediaBase64});
        whatsapp.content = content;
        chrome.storage.sync.set({content: content});
        whatsapp.link = checkLink(content);
        chrome.storage.sync.set({link: whatsapp.link});
        whatsapp.mentioned = checkMentioned(content);
        chrome.storage.sync.set({mentioned: whatsapp.mentioned});
        whatsapp.groups = groups;
        chrome.storage.sync.set({groups: groups});
        whatsapp.groupsLink = groupsLink;
        chrome.storage.sync.set({groupsLink: groupsLink});
        whatsapp.sendInterval = sendInterval;
        chrome.storage.sync.set({sendInterval: sendInterval});
        whatsapp.groupsInterval = groupsInterval;
        chrome.storage.sync.set({groupsInterval: groupsInterval});
        whatsapp.name = name;
        chrome.storage.sync.set({name: name});
        whatsapp.status = status;
        chrome.storage.sync.set({status: status});
        $('#content').focus();
        alert('Success');
    });

    const show = () => {
        $('#media').html(whatsapp.media);
        $('#content').html(whatsapp.content);
        $('#groups').html(whatsapp.groups.join(', '));
        $('#groups-link').html(whatsapp.groupsLink);
        $('#send-interval').val(whatsapp.sendInterval);
        $('#groups-interval').val(whatsapp.groupsInterval);
        $('#name').val(whatsapp.name);
        $('#status').val(whatsapp.status);
        $('#groups-count').html(whatsapp.groups.length);
        $('#last-phone').html(whatsapp.lastPhone);
    };

    show();
});