/// a message received from webview.
export default interface WebViewMessage {
  id?: string;
  params?: any;
  callbackId?: string;
}
