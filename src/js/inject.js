const s = document.createElement('script');
s.src = chrome.extension.getURL('hook.js');
document.documentElement.appendChild(s);