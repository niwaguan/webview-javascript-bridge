part of webview_javascript_bridge;

/// require message format {channel: xx, action: xx, params: xx, callbackId: xxx}
class JSONDecoder implements Decoder {
  const JSONDecoder();

  @override
  BridgeMessage decode(JavascriptMessage message) {
    final decoded = json.decode(message.message) as Map<String, dynamic>;
    return BridgeMessage(
      originMessage: message,
      channel: decoded["channel"] as String,
      action: decoded["action"] as String,
      params: decoded["params"],
      callbackId: decoded["callbackId"] as String?,
    );
  }
}
