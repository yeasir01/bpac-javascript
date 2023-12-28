var port = null;
var lastMethod = {};
chrome.runtime.onConnect.addListener((portCS) => {
    if (portCS.name != "bpac") return;
    if (port != null) {
        port.disconnect();
        port = null;
    }
    portCS.onMessage.addListener((request) => {
        if (port == null) {
            port = chrome.runtime.connectNative("com.brother.bpac");
            port.onMessage.addListener((response) => {
                response.connect = true;
                portCS.postMessage(response);
                if (response.method == "IDocument::Close") {
                    port.disconnect();
                    port = null;
                }
            });
            port.onDisconnect.addListener(() => {
                port = null;
                const message = { method: lastMethod, connect: false };
                portCS.postMessage(message);
            });
        }
        lastMethod = request.method;
        port.postMessage(request);
        return true;
    });
});
chrome.runtime.onSuspend.addListener((request) => {
    if (port != null) {
        port.disconnect();
        port = null;
    }
});
