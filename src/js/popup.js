import '../css/popup.css'

const whatsapp = chrome.extension.getBackgroundPage().whatsapp;

$(() => {
    $('#show-content').html(whatsapp.content);
    $('#ok').click(() => {
        const content = $('#content').val();
        if (content) {
            whatsapp.content = content;
            $('#show-content').html(content);
        }
    });
});