let createFromData_id = 0;
let prepareRawMedia_id = 0;
let store_id = 0;
let Store = {};

const _requireById = (id) => {
    return webpackJsonp([], null, [id]);
};

const getStore = () => {
    if (typeof(_) === 'undefined') {
        return;
    }
    clearInterval(setIntervalGetStore);
    const getAllModules = () => {
        return new Promise((resolve) => {
            const id = _.uniqueId("fakeModule_");
            window["webpackJsonp"](
                [],
                {
                    [id]: (module, exports, __webpack_require__) => {
                        resolve(__webpack_require__.c);
                    }
                },
                [id]
            );
        });
    };
    const modules = getAllModules()._value;
    for (const key in modules) {
        if (modules[key].exports) {
            if (modules[key].exports.createFromData) {
                createFromData_id = modules[key].id.replace(/"/g, '"');
            }
            if (modules[key].exports.prepRawMedia) {
                prepareRawMedia_id = modules[key].id.replace(/"/g, '"');
            }
            if (modules[key].exports.default) {
                if (modules[key].exports.default.Wap) {
                    store_id = modules[key].id.replace(/"/g, '"');
                }
            }
        }
    }
    Store = _requireById(store_id).default;
    console.log('Store', Store);
    window.Store = Store;
};

const setIntervalGetStore = setInterval(getStore);

const fixBinary = (bin) => {
    const length = bin.length;
    const buf = new ArrayBuffer(length);
    const arr = new Uint8Array(buf);
    for (let i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
    }
    return buf;
};

const sendMedia = (jid, mediaBase64, caption, messageId, mentionedJidList) => {
    const createFromDataClass = _requireById(createFromData_id)["default"];
    const prepareRawMediaClass = _requireById(prepareRawMedia_id).prepRawMedia;
    Store.Chat.find(jid).then((chat) => {
        chat.markComposing();
        const data = mediaBase64.split(',')[1];
        const type = mediaBase64.split(',')[0].split(';')[0].split(':')[1];
        const binary = fixBinary(atob(data));
        const blob = new Blob([binary], {type: type});
        const random_name = Math.random().toString(36).substr(2, 5);
        const file = new File([blob], random_name, {
            type: type,
            lastModified: Date.now()
        });
        const temp = createFromDataClass.createFromData(file, file.type);
        const rawMedia = prepareRawMediaClass(temp, {});
        const target = _.filter(Store.Msg.models, (msg) => {
            return msg.id.id === messageId;
        })[0];
        const textPortion = {
            caption: caption,
            mentionedJidList: mentionedJidList,
            quotedMsg: undefined
        };
        console.log('textPortion', textPortion);
        rawMedia.sendToChat(chat, textPortion);
    });
};

const getChats = () => {
    return ['8613811716431-1533816084@g.us',];
    return ['8618810832259@c.us',];
    return Store.Chat.models.map((v) => {
        return v.__x_id._serialized;
    }).sort()
};

const sendText = (jid, body, messageId, mentionedJidList) => {
    Store.Chat.find(jid).then((chat) => {
        chat.markComposing();
        const target = _.filter(Store.Msg.models, (msg) => {
            return msg.id.id === messageId;
        })[0];
        const quotedMsg = {
            linkPreview: this.linkPreview,
            quotedMsg: undefined,
            mentionedJidList: mentionedJidList,
            quotedMsgAdminGroupJid: undefined
        };
        if (this.linkPreview) {
            quotedMsg.linkPreview = this.linkPreview;
        }
        console.log('quotedMsg', quotedMsg);
        chat.sendMessage(body, quotedMsg);
    });
};

document.addEventListener('groupInviteCode', (e) => {
    const code = e.detail.code;
    Store.Wap.acceptGroupInvite(code).then((e) => {
        console.log(e);
    })
});

document.addEventListener('setPushname', (e) => {
    const name = e.detail.name;
    Store.Wap.setPushname(name).then((e) => {
        console.log(e);
    })
});

document.addEventListener('sendSetStatus', (e) => {
    const status = e.detail.status;
    Store.Wap.sendSetStatus(status).then((e) => {
        console.log(e);
    })
});

document.addEventListener('getChats', (e) => {
    const callback = e.detail.callback;
    const chats = getChats();
    document.dispatchEvent(new CustomEvent('callbackChats', {detail: {callback: callback, chats: chats}}));
});

document.addEventListener('handleMessageMedia', (e) => {
    const jid = e.detail.jid;
    const mediaBase64 = e.detail.mediaBase64;
    const caption = e.detail.content;
    let mentioned = [];
    const jidList = jid.split('@');
    if (jidList[1] === 'g.us') {
        mentioned = e.detail.mentioned;
    }
    sendMedia(jid, mediaBase64, caption, null, mentioned);
});

const queryLinkPreview = (link, callback, ...params) => {
    if (!link) {
        this.linkPreview = undefined;
        callback.apply(this, params);
        return;
    }
    Store.Wap.queryLinkPreview(link).then((e) => {
        if (e.status !== 404) {
            this.linkPreview = e;
        } else {
            this.linkPreview = undefined;
        }
        callback.apply(this, params);
    })
};

document.addEventListener('handleMessageText', (e) => {
    const jid = e.detail.jid;
    const body = e.detail.content;
    const link = e.detail.link;
    let mentioned = [];
    const jidList = jid.split('@');
    if (jidList[1] === 'g.us') {
        mentioned = e.detail.mentioned;
    }
    queryLinkPreview(link, sendText, jid, body, null, mentioned);
});