var hook = {};

hook.before = function (data, url, ws) {
    console.log(11111);
    // data = 'modified data while sending'
    console.log(data);
    // console.log(wsHook);
    // console.log(ws);
    // console.log(a);
    // a++;
    // console.log(a);
    // if (a<3) {
    //     ws.send('eeeeeeeee');
    // }
    return data;
};


hook.after = function (messageEvent, url) {
    messageEvent.data = messageEvent.data + ' and receiving';
    console.log(messageEvent.data);
    return messageEvent
};



window.wsHook = hook;
(function () {
    function MutableMessageEvent(o) {
        this.bubbles = o.bubbles || false;
        this.cancelBubble = o.cancelBubble || false;
        this.cancelable = o.cancelable || false;
        this.currentTarget = o.currentTarget || null;
        this.data = o.data || null;
        this.defaultPrevented = o.defaultPrevented || false;
        this.eventPhase = o.eventPhase || 0;
        this.lastEventId = o.lastEventId || '';
        this.origin = o.origin || '';
        this.path = o.path || new Array(0);
        this.ports = o.parts || new Array(0);
        this.returnValue = o.returnValue || true;
        this.source = o.source || null;
        this.srcElement = o.srcElement || null;
        this.target = o.target || null;
        this.timeStamp = o.timeStamp || null;
        this.type = o.type || 'message';
        this.__proto__ = o.__proto__ || MessageEvent.__proto__
    }

    var before = hook.before = function (data, url, ws) {
        console.log(1111333344441);
        return data;
    };
    var after = hook.after = function (e, ws) {
        console.log(1111133333);
        return e;
    };
    hook.resetHooks = function () {
        hook.before = before;
        hook.after = after
    };

    var _WS = WebSocket;
    WebSocket = function (url, protocols) {
        var WSObject;
        this.url = url;
        this.protocols = protocols;
        if (!this.protocols) {
            WSObject = new _WS(url)
        } else {
            WSObject = new _WS(url, protocols)
        }

        var _send = WSObject.send;
        WSObject.send = function (data) {
            arguments[0] = hook.before(data, WSObject.url, WSObject) || data;
            _send.apply(this, arguments)
        };

        // Events needs to be proxied and bubbled down.
        WSObject._addEventListener = WSObject.addEventListener;
        WSObject.addEventListener = function () {
            var eventThis = this;
            // if eventName is 'message'
            if (arguments[0] === 'message') {
                arguments[1] = (function (userFunc) {
                    return function instrumentAddEventListener() {
                        arguments[0] = hook.after(new MutableMessageEvent(arguments[0]), WSObject.url) || arguments[0]
                        userFunc.apply(eventThis, arguments)
                    }
                })(arguments[1])
            }
            return WSObject._addEventListener.apply(this, arguments)
        };

        Object.defineProperty(WSObject, 'onmessage', {
            'set': function () {
                var eventThis = this;
                var userFunc = arguments[0];
                var onMessageHandler = function () {
                    arguments[0] = hook.after(new MutableMessageEvent(arguments[0]), WSObject.url) || arguments[0]
                    userFunc.apply(eventThis, arguments)
                };
                WSObject._addEventListener.apply(this, ['message', onMessageHandler, false])
            }
        });

        return WSObject
    }
})();




console.log(hook);
hook.before = function (data, url, ws) {
    console.log(11111);
    // data = 'modified data while sending'
    console.log(data);
    // console.log(wsHook);
    // console.log(ws);
    // console.log(a);
    // a++;
    // console.log(a);
    // if (a<3) {
    //     ws.send('eeeeeeeee');
    // }
    return data;
};


hook.after = function (messageEvent, url) {
    console.log(33333);
    messageEvent.data = messageEvent.data + ' and receiving';
    console.log(messageEvent.data);
    return messageEvent
};


