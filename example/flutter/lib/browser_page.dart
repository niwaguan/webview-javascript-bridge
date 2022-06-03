import 'dart:async';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_javascript_bridge/webview_javascript_bridge.dart';

class BrowserPage extends StatefulWidget {
  const BrowserPage({Key? key}) : super(key: key);

  @override
  State<BrowserPage> createState() => _BrowserPageState();
}

class _BrowserPageState extends State<BrowserPage>
    with WebViewJavaScriptBridgeMixin {
  final _webviewController = Completer<WebViewController>();

  @override
  void initState() {
    super.initState();
    bridge.addMessageHandler(ClosureMessageHandler(
      resolver: (message, controller) => message.action == "tester",
      handler: (message, controller) {
        print(message);
        return null;
      },
    ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('WebView'),
        actions: [
          IconButton(
            onPressed: _reload,
            icon: const Icon(Icons.refresh_outlined),
          ),
        ],
      ),
      body: Column(
        children: [
          SizedBox(
            height: 44,
            child: Wrap(
              children: [
                TextButton(
                  onPressed: () async {
                    final ret =
                        await bridge.sendMessage(function: 'jsFunction');
                    print("got value: $ret");
                  },
                  child: const Text('call JavaScript'),
                ),
              ],
            ),
          ),
          Expanded(
            child: WebView(
              initialUrl: "http://localhost:1077/",
              // initialUrl: "https://www.baidu.com",
              javascriptMode: JavascriptMode.unrestricted,
              javascriptChannels: {
                channelForBridge,
              },
              onWebViewCreated: (controller) {
                _webviewController.complete(controller);
                bridge.updateWebViewController(controller);
              },
              onWebResourceError: (e) {
                print(e);
              },
              onProgress: (progress) {
                print('loading ${progress.toString()}');
              },
            ),
          )
        ],
      ),
    );
  }

  @override
  void reassemble() {
    _reload();
  }

  _reload() {
    _webviewController.future.then((value) => value.reload());
  }
}
