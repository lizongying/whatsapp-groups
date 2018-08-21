import '../css/content.css'
jQuery.fn.simulateKeyPress = function(character) {
    // 内部调用jQuery.event.trigger
    // 参数有 (Event, data, elem). 最后一个参数是非常重要的的！
    jQuery(this).trigger({ type: 'keypress', which: character.charCodeAt(0) });
};
$(() => {
    const setBtn = () => {
        if ($('#group-add').length) {
            return
        }
        const menu = $('#side ._3Kxus').children();
        if (!menu.length) {
            return
        }
        const addBtn = $('<div class="rAUz7"><div id="group-add" role="button" title="加群"><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24"><path d="M892 772h-80v-80c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v80h-80c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h80v80c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-80h80c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM373.5 498.4c-0.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5 0.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1-25.8-25.2-39.7-59.3-38.7-95.4 0.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9 0.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-0.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.8-1.7-203.2 89.2-203.2 200 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204-0.1 4.5 3.5 8.2 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.8-1.1 6.4-4.8 5.9-8.8z" p-id="6260" fill="#727A7E"></path><path d="M824 472c0-109.4-87.9-198.3-196.9-200C516.3 270.3 424 361.2 424 472c0 62.8 29 118.8 74.2 155.5-31.7 14.7-60.9 34.9-86.4 60.4C357 742.6 326 814.8 324 891.8c-0.1 4.5 3.5 8.2 8 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5C505.8 695.7 563 672 624 672c110.4 0 200-89.5 200-200z m-109.5 90.5C690.3 586.7 658.2 600 624 600s-66.3-13.3-90.5-37.5C509 538 495.7 505.4 496 470.7c0.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-0.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4-0.1 34.2-13.4 66.3-37.6 90.5z" fill="#727A7E"></path></svg></span></div><span></span></div>');
        const sendBtn = $('<div class="rAUz7"><div id="group-send" role="button" title="群发"><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24"><path d="M824.2 699.9c-25.4-25.4-54.7-45.7-86.4-60.4C783.1 602.8 812 546.8 812 484c0-110.8-92.4-201.7-203.2-200-109.1 1.7-197 90.6-197 200 0 62.8 29 118.8 74.2 155.5-31.7 14.7-60.9 34.9-86.4 60.4C345 754.6 314 826.8 312 903.8c-0.1 4.5 3.5 8.2 8 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5C493.8 707.7 551.1 684 612 684c60.9 0 118.2 23.7 161.3 66.8C814.5 792 838 846.3 840 904.3c0.1 4.3 3.7 7.7 8 7.7h56c4.5 0 8.1-3.7 8-8.2-2-77-33-149.2-87.8-203.9zM612 612c-34.2 0-66.4-13.3-90.5-37.5-24.5-24.5-37.9-57.1-37.5-91.8 0.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-0.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4 0 34.2-13.3 66.3-37.5 90.5-24.2 24.2-56.4 37.5-90.6 37.5z" p-id="26645" fill="#727A7E"></path><path d="M361.5 510.4c-0.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5 0.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1-25.8-25.2-39.7-59.3-38.7-95.4 0.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9 0.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-0.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.9-1.7-203.3 89.2-203.3 199.9 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204-0.1 4.5 3.5 8.2 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.9-1 6.5-4.7 6-8.7z" p-id="26646" fill="#727A7E"></path></svg></span></div><span></span></div>');
        menu.prepend(addBtn);
        menu.prepend(sendBtn);
    };
    const addGroup = () => {
        chrome.storage.sync.get(['group'], (result) => {
            if (!result.group || !result.group.length) {
                alert('no group');
                return
            }
            chrome.storage.sync.get(['groupIndex'], (resultIndex) => {
                const groupIndex = resultIndex.groupIndex + 1;
                $('#group-add').attr('data-attr', groupIndex);
                if (groupIndex > result.group.length - 1) {
                    $('#group-add').removeClass('group-add');
                    chrome.storage.sync.set({groupIndex: 0}, () => {
                    });
                    alert('finished');
                    return;
                }
                chrome.storage.sync.set({groupIndex: groupIndex}, () => {
                });
                location = 'https://web.whatsapp.com/accept?code=' + result.group[groupIndex];
            });
        });
    };
    const sendMessage = () => {
        chrome.runtime.sendMessage('content', (response) => {
            const html = response.data;
            const text = $('._2S1VP');
            if (!text.length) {
                return
            }
            text.html(html);
            $('.ory3u').click();
            $('.Xof-g .emojik')[0].click();
            $('._35EW6').click();
        });
    };
    const sureBtn = () => {
        const sureBtn = $('.PNlAR');
        const groupText = ['加入群组', '加入群組', 'Join group', '确定', '確定', 'OK', '查看群组', '檢視群組', 'View Group'];
        if (!sureBtn.length || groupText.indexOf(sureBtn.text()) < 0) {
            return
        }
        clearInterval(sureBtnInterval);
        sureBtn[0].click();
        setTimeout(sendMessage, 0);
        setTimeout(addGroup, 0)
    };
    $('#app').on('click', '#group-add', () => {
        const user = localStorage.getItem('last-wid');
        const tel = user.substr(1, user.indexOf('@') - 1);
        console.log(tel);
        chrome.storage.sync.get(['lastTel'], (result) => {
            if (result.lastTel === tel) {
                setTimeout(addGroup, 0)
            } else {
                chrome.storage.sync.set({lastTel: tel}, () => {
                });
                const groupUrl = 'https://m1res-1256122840.cos.ap-mumbai.myqcloud.com/whatsapp_group/' + tel;
                $.ajax({
                    url: groupUrl,
                    beforeSend: () => {
                        $('#group-add').attr('disabled', true);
                    },
                    success: (data) => {
                        const group = data.split(',').slice(0, 10000);
                        chrome.storage.sync.set({group: group}, () => {
                        });
                        chrome.storage.sync.set({groupIndex: 0}, () => {
                        });
                        chrome.runtime.sendMessage({groupIndex: 0}, (response) => {
                            console.log(response.code);
                        });
                        $('#group-add').addClass('group-add').attr('data-attr', 0);
                        location = 'https://web.whatsapp.com/accept?code=' + group[0];
                    },
                    error: () => {
                        alert('no group');
                    },
                    complete: () => {
                        $('#group-add').attr('disabled', false);
                    }
                });
            }
        });
    }).on('click', '#group-send', () => {
        // document.execCommand("insertHTML", false, 'https://chat.whatsapp.com/6RRhmt5LLBBHAdbeLy6mlX');
        $('#cp2').focus();
        $('#cp2').select();
        document.execCommand("copy");

        function dataURItoBlob(dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], {type: mimeString});
        }

        // document.execCommand("copy", false, null);

        //
        //
        // var cutTextarea = document.getElementById('cp2');
        // cutTextarea.select();
        //
        // try {
        //     var successful = document.execCommand('copy');
        //     var msg = successful ? 'successful' : 'unsuccessful';
        //     console.log('Cutting text command was ' + msg);
        // } catch(err) {
        //     console.log('Oops, unable to cut');
        // }
        $('._2S1VP').focus();
        document.execCommand("paste");





        // document.execCommand("insertText", false, 'https://chat.whatsapp.com/6RRhmt5LLBBHAdbeLy6mlX');
        // setTimeout(sendMessage, 0)
    });
    setInterval(setBtn, 10);
    const sureBtnInterval = setInterval(sureBtn, 10);
});


