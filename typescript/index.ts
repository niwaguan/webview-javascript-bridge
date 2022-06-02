import WebViewJavaScriptBridge from './webview-javascript-bridge';
import UriEncoder from './encoder/uri-encoder';
import JSONEncoder from './encoder/json-encoder';
import JSONUriEncoder from './encoder/json-uri-encoder';

const webViewJavaScriptBridge = new WebViewJavaScriptBridge();
(window as any).webViewJavaScriptBridge = webViewJavaScriptBridge;
export default webViewJavaScriptBridge;
export { UriEncoder, JSONEncoder, JSONUriEncoder };
