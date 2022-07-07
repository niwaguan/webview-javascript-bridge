class JSONUriEncoder {
    constructor(scheme = "webviewjsbridge", host = "stormyang.cn") {
        this.scheme = scheme;
        this.host = host;
    }
    encode(args) {
        const message = {
            channel: args.channel,
            action: args.action,
            params: args.params,
            callbackId: args.callbackId,
        };
        return `${this.scheme}://${this.host}?args=${encodeURIComponent(JSON.stringify(message))}`;
    }
}

class WebViewJavaScriptBridge {
    constructor() {
        this.callbackId = 1;
        this.callbacks = new Map();
        this.handlers = new Map();
        this.encoder = new JSONUriEncoder();
    }
    sendMessage(message) {
        return new Promise((resolve, reject) => {
            if (!message.action || message.action.length <= 0) {
                reject('action is invalid');
                return;
            }
            const channel = message.channel || 'default';
            const channelImp = window[channel];
            if (channelImp === null || channelImp === undefined) {
                reject(`
        channel named "${channel}" not found in flutter. please add channel:
        WebView(
          url: ...,
          ...
          javascriptChannels: {
            JavascriptChannel(
              name: "${channel}",
              onMessageReceived: (message) {
                (instance of WebViewFlutterJavaScriptBridge).parseJavascriptMessage(message);
              },
            ),
          },
        )
        `);
                return;
            }
            const callbackId = this._pushCallback(resolve);
            const encoded = this.encoder.encode({
                channel,
                action: message.action,
                params: message.params,
                callbackId,
            });
            if (!encoded) {
                reject(`Unable build message. (channel: ${channel}, action: ${message.action}, params: ${message.params})`);
                return;
            }
            this._log('sending message:', encoded);
            channelImp.postMessage(encoded);
        });
    }
    registerMessageHandler(id, handler) {
        if (id === null || id === undefined) {
            return;
        }
        if (typeof handler === 'function') {
            this.handlers.set(id, handler);
        }
        else {
            this.unregisterMessageHandler(id);
        }
    }
    unregisterMessageHandler(id) {
        this.handlers.delete(id);
    }
    setEncoder(encoder) {
        this.encoder = encoder;
    }
    setLogger(logger) {
        this.logger = logger;
    }
    _log(...args) {
        var _a;
        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.call(this.logger, ...args);
    }
    _pushCallback(cb) {
        const id = this.callbackId++;
        const key = `cb_${id}`;
        this.callbacks.set(key, cb);
        return key;
    }
    _popCallback(id) {
        if (this.callbacks.has(id)) {
            const cb = this.callbacks.get(id);
            this.callbacks.delete(id);
            return cb;
        }
    }
    _receiveMessage(message) {
        this._log(`receive message, id: ${message.id}, callbackId: ${message.callbackId}, params:`, message.params);
        if (message.callbackId) {
            const cb = this._popCallback(message.callbackId);
            if (cb) {
                cb(message.params);
            }
            return;
        }
        const key = message.id;
        if (key) {
            const func = this.handlers.get(key);
            if (typeof func !== 'function') {
                return `no handler for message: ${message.id}`;
            }
            const ret = func(message.params);
            return ret ? JSON.stringify(ret) : ret;
        }
    }
}

class UriEncoder {
    constructor(scheme = 'webviewjsbridge') {
        this.scheme = scheme;
    }
    encode(args) {
        let message = `${this.scheme}://${args.channel}/${args.action}`;
        const query = [];
        if (args.params) {
            const argsJSON = encodeURIComponent(JSON.stringify(args.params));
            query.push({ key: 'args', value: argsJSON });
        }
        if (args.callbackId) {
            query.push({ key: 'callbackId', value: args.callbackId });
        }
        if (query.length > 0) {
            message += '?';
            message += query.map((pair) => `${pair.key}=${pair.value}`).join('&');
        }
        return message;
    }
}

class JSONEncoder {
    encode(args) {
        const message = {
            channel: args.channel,
            action: args.action,
            params: args.params,
            callbackId: args.callbackId,
        };
        return JSON.stringify(message);
    }
}

const webViewJavaScriptBridge = new WebViewJavaScriptBridge();
window.webViewJavaScriptBridge = webViewJavaScriptBridge;

export { JSONEncoder, JSONUriEncoder, UriEncoder, webViewJavaScriptBridge as default };
//# sourceMappingURL=index.esm.js.map
