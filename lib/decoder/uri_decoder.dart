part of webview_javascript_bridge;

/// require message format scheme://channel/target?args=jsonstring
class UriDecoder implements Decoder {
  const UriDecoder();

  @override
  BridgeMessage decode(JavascriptMessage message) {
    final url = Uri.parse(message.message);
    final channel = url.host;
    final target = url.path;
    Map<String, dynamic>? args;
    String? callbackId;
    if (url.hasQuery) {
      final argsJSON = url.queryParameters["args"];
      if (argsJSON != null) {
        // url.queryParameters已经进行过decode，无需再次进行
        // final decoded = Uri.decodeComponent(query);
        args = json.decode(argsJSON) as Map<String, dynamic>?;
      }
      callbackId = url.queryParameters["callbackId"];
    }
    return BridgeMessage(
      channel: channel,
      action: target,
      params: args,
      callbackId: callbackId,
      originMessage: message,
    );
  }
}
