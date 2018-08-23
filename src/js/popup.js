import '../css/popup.css'

const whatsapp = chrome.extension.getBackgroundPage().whatsapp;

$(() => {
    $('#set').click(() => {
        const content = $('#content').val().trim();
        const imageLink = $('#image-link').val().trim();
        const isImage = $('input[name="is-image"]:checked').val();
        const isDelete = $('input[name="is-delete"]:checked').val();
        const groups = $('#groups').val().replace(/\s/g, '').split(',').filter((item) => {
            return item
        });
        const groupsLink = $('#groups-link').val().trim();
        if (groups.length > 0 && groupsLink.length > 0) {
            alert('You Must choose only one in the "Groups" and "Groups link".');
            return;
        }
        whatsapp.isImage = !!parseInt(isImage);
        whatsapp.isDelete = !!parseInt(isDelete);
        chrome.storage.sync.set({isImage: isImage});
        if (content.length > 0) {
            whatsapp.content = content;
            chrome.storage.sync.set({content: content});
        }
        if (imageLink.length > 0) {
            whatsapp.imageLink = imageLink;
            chrome.storage.sync.set({imageLink: imageLink});
        }
        if (groups.length > 0) {
            whatsapp.groups = groups;
            chrome.storage.sync.set({groups: groups});
        }
        if (groupsLink.length > 0) {
            whatsapp.groupsLink = groupsLink;
            chrome.storage.sync.set({groupsLink: groupsLink});
        }
        alert('Success');
    });
    const show = () => {
        $('#content').html(whatsapp.content);
        $('#image-link').html(whatsapp.imageLink);
        $('#is-image-yes').attr('checked', whatsapp.isImage);
        $('#is-image-no').attr('checked', !whatsapp.isImage);
        $('#is-delete-yes').attr('checked', whatsapp.isDelete);
        $('#is-delete-no').attr('checked', !whatsapp.isDelete);
        if (whatsapp.groupsLink.length > 0) {
            $('#groups-link').html(whatsapp.groupsLink);
        } else {
            $('#groups').html(whatsapp.groups.join(', '));
        }
        $('#is-message').html(whatsapp.isMessage ? 'Yes' : 'No');
        $('#groups-count').html(whatsapp.groups.length);
        $('#groups-index').html(whatsapp.groupsIndex);
        $('#last-phone').html(whatsapp.lastPhone);
    };
    setInterval(show, 10)
});