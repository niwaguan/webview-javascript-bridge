import Encoder from './encoder/encoder';
import JSONUriEncoder from './encoder/json-uri-encoder';
import JavaScriptMessage from './interface/java-script-message';
import WebViewMessage from './interface/webview-message';

type PromiseResolver = <T>(value: T | PromiseLike<T>) => void;

/// TODO: typing MessageHandler
/// i want to declare type:
/// declare type MessageHandler = <ParamsType, ReturnType>(params: ParamsType) => ReturnType;
/// but i got an error.
type MessageHandler = (params?: any) => any;

/// logger type
type Logger = (...args: any) => void;

export default class WebViewJavaScriptBridge {
  private callbackId: number;
  private callbacks: Map<string, PromiseResolver>;
  private handlers: Map<string, MessageHandler>;
  private encoder: Encoder;
  private logger?: Logger;
  constructor() {
    this.callbackId = 1;
    this.callbacks = new Map();
    this.handlers = new Map();
    this.encoder = new JSONUriEncoder();
  }

  /**
   * sending message to webview.
   * @returns webview's response
   */
  public sendMessage<Response>(message: JavaScriptMessage) {
    return new Promise<Response>((resolve, reject) => {
      if (!message.action || message.action.length <= 0) {
        reject('action is invalid');
        return;
      }
      const channel = message.channel || 'default';
      const channelImp = (window as any)[channel];
      if (channelImp === null || channelImp === undefined) {
        reject(`
        channel named "${channel}" not found in flutter. please add channel:
        late final _webviewController = WebViewController()
          ...
          ..addJavaScriptChannel(webviewJavaScriptBridgeChannel,
              onMessageReceived: _bridge.receiveMessage)
          ...
        `);
        return;
      }
      /// encode message
      const callbackId = this._pushCallback(resolve as PromiseResolver);
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

  /**
   * register a function for webview to call.
   * @param {string} id the function's id
   * @param {MessageHandler} handler the function's implements
   */
  public registerMessageHandler(id: string, handler: MessageHandler) {
    if (id === null || id === undefined) {
      return;
    }
    if (typeof handler === 'function') {
      this.handlers.set(id, handler);
    } else {
      this.unregisterMessageHandler(id);
    }
  }
  /**
   * unregister a function.
   * @param {string} id the function's id
   */
  public unregisterMessageHandler(id: string) {
    this.handlers.delete(id);
  }

  /**
   * set the message's encoder
   * @param encoder the encoder to use encode message
   */
  public setEncoder(encoder: Encoder) {
    this.encoder = encoder;
  }

  public setLogger(logger: Logger) {
    this.logger = logger;
  }

  /**
   * log in console
   * @param  {...any} args the log info
   * @returns void
   */
  private _log(...args: string[]) {
    this.logger?.call(this.logger, ...args);
  }

  /**
   * 记录一个函数并返回其对应的记录id
   * @param {PromiseResolver} cb 需要记录的函数
   */
  private _pushCallback(cb: PromiseResolver) {
    const id = this.callbackId++;
    const key = `cb_${id}`;
    this.callbacks.set(key, cb);
    return key;
  }

  /**
   * 删除id对应的函数
   * @param {string} id 函数的id
   */
  private _popCallback(id: string) {
    if (this.callbacks.has(id)) {
      const cb = this.callbacks.get(id);
      this.callbacks.delete(id);
      return cb;
    }
  }

  /**
   * 接收来自webview的消息
   * @param {string} message Object格式的消息.如{func: xxx, params: {a: 1, b: 2}}
   */
  private _receiveMessage(message: WebViewMessage) {
    this._log(`receive message, id: ${message.id}, callbackId: ${message.callbackId}, params:`, message.params);
    if (message.callbackId) {
      this._log('this message is a callback');
      const cb = this._popCallback(message.callbackId);
      if (cb) {
        cb(message.params);
        return true;
      }
      return false;
    }
    const key = message.id;
    if (key) {
      this._log('this message is a calling to javascript');
      /// 查找处理器并调用
      const func = this.handlers.get(key);
      if (typeof func !== 'function') {
        return `no handler for message: ${message.id}`;
      }
      let ret = func(message.params);
      if (typeof ret === 'object' && ret !== null) {
        ret = JSON.stringify(ret);
      }
      return ret;
    }
    throw 'message must have a id or callbackId.';
  }
}
