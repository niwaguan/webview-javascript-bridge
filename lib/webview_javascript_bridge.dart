library webview_javascript_bridge;

import 'dart:async';
import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:webview_flutter/webview_flutter.dart';

part './bridge_message.dart';
part './closure_message_handler.dart';
part './decoder/decoder.dart';
part './decoder/json_decoder.dart';
part './decoder/json_uri_decoder.dart';
part './decoder/uri_decoder.dart';
part './message_handler.dart';
part './webview_javascript_bridge_mixin.dart';

/// An bridge for sending messages between WebView and JavaScript in flutter_webview.
class WebViewJavaScriptBridge {
  /// JavascriptMessage's parser
  final Decoder decoder;
  WebViewJavaScriptBridge({
    this.decoder = const JSONUriDecoder(),
  });

  /// all handlers
  final List<BridgeJavascriptMessageHandler> _handlers = [];
  addMessageHandler(BridgeJavascriptMessageHandler handler) {
    _handlers.add(handler);
  }

  WebViewController? _webViewController;
  updateWebViewController(WebViewController controller) {
    _webViewController = controller;
  }

  /// receive a message from JavaScript
  receiveMessage(JavascriptMessage message) async {
    assert(_webViewController != null,
        "message can not be handled without a WebViewController");
    bool handled = false;
    final bridgeMessage = decoder.decode(message);
    for (final handler in _handlers) {
      final canHandle =
          await handler.resolve(bridgeMessage, _webViewController!);
      if (!canHandle) {
        continue;
      }
      handled = true;
      final ret = await handler.handle(bridgeMessage, _webViewController!);
      if (bridgeMessage.callbackId != null &&
          bridgeMessage.callbackId!.isNotEmpty) {
        await _sendMessage(
          params: ret,
          callbackId: bridgeMessage.callbackId,
        );
      }
    }
    assert(handled == true, 'a message not handled. $bridgeMessage');
  }

  /// sending a message to JavaScript.
  Future<String?> sendMessage({required String function, Object? params}) {
    return _sendMessage(function: function, params: params);
  }

  /// 发送消息到Web
  /// [function] 方法标识。
  /// [params] 传递的参数
  Future<String?> _sendMessage(
      {String? function, Object? params, String? callbackId}) async {
    assert(_webViewController != null,
        "message can not send without a WebViewController");
    final Map<String, dynamic> message = {};
    if (function != null && function.isNotEmpty) {
      message["id"] = function;
    }
    if (params != null) {
      message["params"] = params;
    }
    if (callbackId != null) {
      message["callbackId"] = callbackId;
    }
    assert(
        message.keys.isNotEmpty, "a message must have callbackId or function");
    final jsonMessage = json.encode(message);

    /// json string
    final ret = await _webViewController?.runJavascriptReturningResult("""
        window.webViewJavaScriptBridge._receiveMessage($jsonMessage);
        """);
    return ret;
  }
}
