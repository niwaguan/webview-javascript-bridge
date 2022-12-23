import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_javascript_bridge/webview_javascript_bridge.dart';

class BrowserPage extends StatefulWidget {
  const BrowserPage({Key? key}) : super(key: key);

  @override
  State<BrowserPage> createState() => _BrowserPageState();
}

class _BrowserPageState extends State<BrowserPage> {
  /// the bridge for webview and javascript
  late final WebViewJavaScriptBridge _bridge = WebViewJavaScriptBridge();

  /// the WebViewController
  late final _webviewController = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..setBackgroundColor(const Color(0x00000000))
    ..setNavigationDelegate(
      NavigationDelegate(
        onProgress: (int progress) {
          // Update loading bar.
        },
        onPageStarted: (String url) {},
        onPageFinished: (String url) {},
        onWebResourceError: (WebResourceError error) {},
        onNavigationRequest: (NavigationRequest request) {
          if (request.url.startsWith('https://www.youtube.com/')) {
            return NavigationDecision.prevent;
          }
          return NavigationDecision.navigate;
        },
      ),
    )
    ..addJavaScriptChannel(webviewJavaScriptBridgeChannel,
        onMessageReceived: _bridge.receiveMessage)
    ..loadRequest(Uri.parse('http://localhost:1077/'));

  @override
  void initState() {
    super.initState();
    _bridge.updateWebViewController(_webviewController);
    _bridge.addMessageHandler(ClosureMessageHandler(
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
                    final ret = await _bridge.sendMessage<Map<String, dynamic>>(
                        function: 'jsFunction');
                    print("got value: $ret");
                  },
                  child: const Text('call JavaScript'),
                ),
              ],
            ),
          ),
          Expanded(
            child: WebViewWidget(
              controller: _webviewController,
            ),
          )
        ],
      ),
    );
  }

  @override
  void reassemble() {
    super.reassemble();
    _reload();
  }

  _reload() {
    _webviewController.reload();
  }
}
