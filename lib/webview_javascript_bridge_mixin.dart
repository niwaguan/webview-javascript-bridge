part of webview_javascript_bridge;

mixin WebViewJavaScriptBridgeMixin<T extends StatefulWidget> on State<T> {
  /// the bridge for webview and javascript
  late final WebViewJavaScriptBridge bridge = WebViewJavaScriptBridge();

  /// the dependency channel for bridge
  late final JavascriptChannel channelForBridge = JavascriptChannel(
    onMessageReceived: (JavascriptMessage message) {
      bridge.receiveMessage(message);
    },
    name: 'default',
  );
}
