import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:mobile/browser_page.dart';

class NavigatorPage extends StatelessWidget {
  const NavigatorPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: CupertinoButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (BuildContext context) {
                  return const BrowserPage();
                }),
              );
            },
            child: const Text('Go to Browser')),
      ),
    );
  }
}
