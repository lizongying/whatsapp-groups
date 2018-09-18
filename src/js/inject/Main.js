// Main
// Actual interception

var readConfirmationsHookEnabled = true;
var presenceUpdatesHookEnabled = true;
var safetyDelay = 0;
var WAdebugMode = false;
var isInitializing = true;
var exceptionsList = [];
var blinkingChats = {};
var chats = {};
var blockedChats = {};

wsHook.before = function(originalData, url, WSObject)
{
	// console.log(WSObject);
	var payload = WACrypto.parseWebSocketPayload(originalData);
	var tag = payload.tag;
	var data = payload.data;
	
	return new Promise(function(resolve, reject)
	{
		if (!(data instanceof ArrayBuffer))
		{
			if (WAdebugMode) console.log("[Out] Sent message with tag '" + tag +"':");
			if (data != "" && WAdebugMode) console.log(data);
			resolve(originalData);
		}
		else
		{
			WACrypto.decryptWithWebCrypto(data).then(function(decrypted)
			{
				if (decrypted == null) resolve(originalData);
				if (WAdebugMode) console.log("[Out] Sent binary with tag '" + tag + "' (" + decrypted.byteLength + " bytes, decrypted): ");
				
				var nodeParser = new NodeParser();
				var node = nodeParser.readNode(new NodeBinaryReader(decrypted));

                if (WAdebugMode) console.log(node);
				if (isInitializing)
				{
					isInitializing = false;
					console.log("WhatsIncognito: Interception is working.");
					document.dispatchEvent(new CustomEvent('isInterceptionWorking', {detail: true}));
				}
				
				var isAllowed = handler.handleSentNode(node, tag);
				if (isAllowed) resolve(originalData);
				else resolve(null);
			});
		}
	});
}

wsHook.after = function(messageEvent, url) 
{
	var payload = WACrypto.parseWebSocketPayload(messageEvent.data);
	var tag = payload.tag;
	var data = payload.data;
	
    if (!(data instanceof ArrayBuffer))
	{
    	if (WAdebugMode) console.log("[In] Received message with tag '" + tag +"':");
		if (data != "" && WAdebugMode)
			console.log(data);
	}
	else
	{
		 WACrypto.decryptWithWebCrypto(data).then(function(decrypted)
		 {		 
			 if (WAdebugMode) console.log("[In] Received binary with tag '" + tag + "' (" +  decrypted.byteLength + " bytes, decrypted)): ");
			 
			 var nodeParser = new NodeParser();
			 var node = nodeParser.readNode(new NodeBinaryReader(decrypted));
			 if (WAdebugMode) console.log(node);
			 handler.handleReceivedNode(node);
		 });
	}
}


document.addEventListener('wwwww', function (e) {
    console.log(222);
    console.log(e);
    var startNode = ["query","invite","55ETwi217XsLeTZvgfm7rD"];
    // var startNode = ["action","invite","2uf9q3KTBEFAG6J3VxHHC3"];
    // WACrypto.sendNode(startNode);});
	console.log(wsHook);
	wsHook._send(startNode);
	console.log('1111111');
})

document.addEventListener('onIncognitoOptionsClosed', function(e)
{	
	console.log('onIncognitoOptionsClosed');
});



var handler = {};

(function() {
	
var messages = [];
var isScrappingMessages = false;
var epoch = 8;

handler.scrapMessages = function(jid, index, count)
{
	messages = [];
	var startNode = ["query",{"type":"message","kind":"before","jid":jid,"count":count.toString(),"index":index,"owner":"true","epoch":(epoch++).toString()},null];
	WACrypto.sendNode(startNode);
	isScrappingMessages = true;
}

handler.handleSentNode = function(node, tag)
{
	try
	{
		if (nodeReader.tag(node) == "action")
		{
			var arr = node[2];
			if (Array.isArray(arr))
			{
				for (var n = arr.length, o = 0; o < n; o++) 
				{
					var action = arr[o][0];
					var data = arr[o][1];
					var isException = exceptionsList.includes(data.jid+data.index);
					var shouldBlock = (readConfirmationsHookEnabled && action === "read" && !isException) || (presenceUpdatesHookEnabled && action === "presence" && data["type"] === "available");
					if (shouldBlock)
					{
						console.log("WhatsIncognito: --- Blocking " + action.toUpperCase() + " action! ---");
						switch (action)
						{
							case "read":
								document.dispatchEvent(new CustomEvent('onReadConfirmationBlocked', {
									detail: data["jid"]
								}));
								var messageEvent = new MutableMessageEvent({data: tag + ",{\"status\": 403}"});
								wsHook.onMessage(messageEvent);
							break;
							case "presence":
								var messageEvent = new MutableMessageEvent({data: tag + ",{\"status\": 200}"});
								wsHook.onMessage(messageEvent);
							break;
						}

						return false;
					}
					if (isException)
					{
						// exceptions are one-time operation
						console.log("WhatsIncognito: --- Allowing " + action.toUpperCase() + " action ---");
						exceptionsList.remove(exceptionsList.indexOf(data.jid+data.index));
					}
				}
			}
		}
	}
	catch (exception)
	{
		console.error("WhatsIncognito: Allowing WA packet due to exception:");
		console.error(exception);
		return true;
	}
	
	return true;
}

handler.handleReceivedNode = function(e)
{
	var t = [], o = nodeReader.children(e);
	if ("response" === nodeReader.tag(e) && ("message" === nodeReader.attr("type", e) || "star" === nodeReader.attr("type", e) 
	    || "search" === nodeReader.attr("type", e) || "media_message" === nodeReader.attr("type", e))) 
	{
		if (Array.isArray(o)) 
		{
			var a, i = o.length;
			for (a = 0; a < i; a++) 
			{
				var d = handleMessage(o[a], "response");
				d && t.push(d)
			}
		}
		"search" === nodeReader.attr("type", e) && (t = 
		{
			eof: "true" === nodeReader.attr("last", e),
			messages: t
		})
		
		if (WAdebugMode) console.log("Got messages! (count: " +t.length+" )");
		if (isScrappingMessages)
		{
			isScrappingMessages = false;
			messages = t.concat(messages)
			if (WAdebugMode) console.log(JSON.parse(JSON.stringify(messages)));
			//handler.scrapMessages(t[0].key.remoteJid, t[0].key.id, 50);
		}
	}
}

function handleMessage(e, t)
{
	switch (nodeReader.tag(e)) 
	{
		case "message":
			return messageTypes.WebMessageInfo.parse(nodeReader.children(e));
		case "groups_v2":
		case "broadcast":
		case "notification":
		case "call_log":
		case "security":
			return e;
		default:
			return null;
	}
}

var nodeReader = 
{
	tag: function(e) { return e && e[0] },
	attr: function(e, t) { return t && t[1] ? t[1][e] : void 0},
	attrs: function(e) { return e[1]},
	child: function s(e, t) {
		var r = t[2];
		if (Array.isArray(r))
			for (var n = r.length, o = 0; o < n; o++) {
				var s = r[o];
				if (Array.isArray(s) && s[0] === e)
					return s
			}
	},
	children: function(e) 
	{
		return e && e[2]
	},
	dataStr: function(e) 
	{
		if (!e) return "";
		var t = e[2];
		return "string" == typeof t ? t : t instanceof ArrayBuffer ? new BinaryReader(t).readString(t.byteLength) : void 0
	}
}

})();