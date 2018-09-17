import '../css/popup.css'

const whatsapp = chrome.extension.getBackgroundPage().whatsapp;

$(() => {
    chrome.runtime.onMessage.addListener(
        (request, sender, sendResponse) => {
            if (request['is-message'] !== undefined) {
                $('#is-message').html(whatsapp.isMessage ? 'Yes' : 'No');
            }
            if (request['lastPhone'] !== undefined) {
                $('#last-phone').html(whatsapp.lastPhone);
            }
            if (request['groups'] !== undefined) {
                $('#groups').html(whatsapp.groups.join(', '));
                $('#groups-count').html(whatsapp.groups.length);
            }
        });
    $('#set').click(() => {
        const content = $('#content').val().trim();
        const imageLink = $('#image-link').val().trim();
        const isImage = $('input[name="is-image"]:checked').val();
        const isDelete = $('input[name="is-delete"]:checked').val();
        const groups = $('#groups').val().replace(/\s/g, '').split(',').filter((item) => {
            return item
        });
        const groupsLink = $('#groups-link').val().trim();
        whatsapp.isDelete = !!parseInt(isDelete);
        whatsapp.isImage = !!parseInt(isImage);
        chrome.storage.sync.set({isImage: isImage});
        whatsapp.content = content;
        chrome.storage.sync.set({content: content});
        whatsapp.imageLink = imageLink;
        chrome.storage.sync.set({imageLink: imageLink});
        whatsapp.groups = groups;
        chrome.storage.sync.set({groups: groups});
        whatsapp.groupsLink = groupsLink;
        chrome.storage.sync.set({groupsLink: groupsLink});
        alert('Success');
    });
    const show = () => {
        $('#content').html(whatsapp.content);
        $('#image-link').html(whatsapp.imageLink);
        $('#is-image-yes').attr('checked', whatsapp.isImage);
        $('#is-image-no').attr('checked', !whatsapp.isImage);
        $('#is-delete-yes').attr('checked', whatsapp.isDelete);
        $('#is-delete-no').attr('checked', !whatsapp.isDelete);
        $('#groups-link').html(whatsapp.groupsLink);
        $('#groups').html(whatsapp.groups.join(', '));
        $('#is-message').html(whatsapp.isMessage ? 'Yes' : 'No');
        $('#groups-count').html(whatsapp.groups.length);
        $('#last-phone').html(whatsapp.lastPhone);
    };
    show();
});