part of webview_javascript_bridge;

/// a decoder for JavascriptMessage
abstract class Decoder {
  BridgeMessage decode(JavascriptMessage message);
}
