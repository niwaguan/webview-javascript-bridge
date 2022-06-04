import Encoder from './encoder/encoder';
import JavaScriptMessage from './interface/java-script-message';
declare type MessageHandler = (params?: any) => any;
declare type Logger = (...args: any) => void;
export default class WebViewJavaScriptBridge {
    private callbackId;
    private callbacks;
    private handlers;
    private encoder;
    private logger?;
    constructor();
    sendMessage<Response>(message: JavaScriptMessage): Promise<Response>;
    registerMessageHandler(id: string, handler: MessageHandler): void;
    unregisterMessageHandler(id: string): void;
    setEncoder(encoder: Encoder): void;
    setLogger(logger: Logger): void;
    private _log;
    private _pushCallback;
    private _popCallback;
    private _receiveMessage;
}
export {};
