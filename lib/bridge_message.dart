part of webview_javascript_bridge;

/// the message parsed from JavascriptMessage
class BridgeMessage {
  /// origin message
  final JavascriptMessage originMessage;

  /// channel name of JavascriptChannel
  final String channel;

  /// the message's action. from javascript's call `sendMessage({action: xxx})`
  final String action;

  /// the message's callback identifier
  final String? callbackId;

  /// the message's params. from javascript's call `sendMessage({params: xxx})`
  final dynamic params;

  BridgeMessage({
    required this.originMessage,
    required this.channel,
    required this.action,
    this.callbackId,
    this.params,
  });

  @override
  toString() {
    return "[BridgeMessage] channel: $channel, action: $action, params: $params, callbackId: $callbackId";
  }
}
