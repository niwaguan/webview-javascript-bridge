part of webview_javascript_bridge;

typedef Resolver = FutureOr<bool> Function(
    BridgeMessage message, WebViewController controller);
typedef Handler = FutureOr<dynamic> Function(
    BridgeMessage message, WebViewController controller);

/// a message's handler shortcut
class ClosureMessageHandler implements BridgeJavascriptMessageHandler {
  final Resolver resolver;
  final Handler handler;

  ClosureMessageHandler({required this.resolver, required this.handler});

  @override
  FutureOr<bool> resolve(BridgeMessage message, WebViewController controller) {
    return resolver(message, controller);
  }

  @override
  FutureOr<dynamic>? handle(
      BridgeMessage message, WebViewController controller) {
    return handler(message, controller);
  }
}
