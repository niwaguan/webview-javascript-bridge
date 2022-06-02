part of webview_javascript_bridge;

/// a handler for message
abstract class BridgeJavascriptMessageHandler {
  /// resolve this handler should handle a message or not
  FutureOr<bool> resolve(BridgeMessage message, WebViewController controller);

  /// A message's handler.
  ///
  /// ❗️Attention Please! About the method's return type, follow the guidelines below:
  /// A message call from JavaScript like this
  ///
  /// {@tool snippet}
  ///
  /// ```ts
  /// webViewJavaScriptBridge.sendMessage〈number〉()
  /// ```
  ///
  /// {@end-tool}
  ///
  /// Here is expected to get a  number type, so wo should return a number in this method.
  FutureOr<dynamic>? handle(
      BridgeMessage message, WebViewController controller);
}
