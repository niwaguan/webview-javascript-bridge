/// a message send to webview
export default interface JavaScriptMessage {
  /// message's identifier. WebView can use it to resolve if the message can be handled or not.
  action: string;
  /// which channel used to deliver the message.
  channel?: string;
  /// any jsonable params
  params?: any;
}
