part of webview_javascript_bridge;

/// require message format scheme://host?args=json
class JSONUriDecoder implements Decoder {
  const JSONUriDecoder();

  @override
  BridgeMessage decode(JavascriptMessage message) {
    final url = Uri.parse(message.message);
    if (url.hasQuery) {
      final argsJSON = url.queryParameters["args"];
      if (argsJSON != null) {
        final obj = json.decode(argsJSON) as Map<String, dynamic>;
        return BridgeMessage(
          originMessage: message,
          channel: obj["channel"] as String,
          action: obj["action"] as String,
          params: obj["params"],
          callbackId: obj["callbackId"] as String?,
        );
      }
    }
    throw "message format error";
  }
}
