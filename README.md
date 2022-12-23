A bridge for JavaScript communicate with [webview_flutter](https://pub.dev/packages/webview_flutter).

|             | Android        | iOS  |
| ----------- | -------------- | ---- |
| **Support** | SDK 19+ or 20+ | 9.0+ |

## Features

- handle message from JavaScript structured.
- send message to JavaScript easier.

## Usage

Before using this package, your need setup with Flutter and JavaScript.

### Flutter

First of all, add `webview_javascript_bridge` as a dependency in your pubspec.yaml file. Just run:

```dart
flutter pub add webview_javascript_bridge
```

And then create the bridge instance and init:

```dart
late final _bridge = WebViewJavaScriptBridge();
late WebViewController _webviewController = WebViewController()
  // your code
  ..addJavaScriptChannel(
    webviewJavaScriptBridgeChannel,
    onMessageReceived: _bridge.receiveMessage,
  )
  // your code


@override
void initState() {
  super.initState();
  // your code
  _bridge.updateWebViewController(_webviewController);
  // your code
}
```

Finally, don't forget add your message handler for JavaScript, such as Toaster:

```dart
@override
void initState() {
    super.initState();
    /// add handler
    _bridge.addMessageHandler(ClosureMessageHandler(
      resolver: (message, controller) => message.action == "toaster",
      handler: (message, controller) {
        // TODO: show the toaster
        print(message);
        return null;
      },
    ));
}
```

### JavaScript

First of all, install the package `webview-javascript-bridge`. Just run:

```yarn
yarn add webview-javascript-bridge
```

or with npm:

```npm
npm install webview-javascript-bridge
```

Next, import `webViewJavaScriptBridge` as your need:

```javascript
import webViewJavaScriptBridge from 'webview-javascript-bridge';
```

Finally, sending a message!

```javascript
async function sendingMessage() {
  let response = await webViewJavaScriptBridge.sendMessage({
    action: 'tester',
    params: 123456,
  });
  console.log("tester's response", response);
}
```

If your use TypeScript, go to example for more details.

## ❗️Tips

### 1. The imp of BridgeJavascriptMessageHandler in Flutter `must` return a `jsonable` type

```dart
_bridge.addMessageHandler(
  ClosureMessageHandler(
    resolver: (m, c) => m.action == "toaster",
    handler: (m, c) {
      // ❗️❗️❗️❗️
      return "this value will response to JavaScript, and it must be jsonable";
    },
  ),
);
```

### 2. You will get a exception, if a JavaScript function return `null` or `undefined`

```javascript
final ret = await _bridge.sendMessage(function:"aJavaScriptFunctionReturningNullOrUndefined");
////// ⬆️ will be empty string.

```
