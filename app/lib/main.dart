import 'package:flutter/material.dart';

import 'package:sprnkl_flutter/util/colors.dart';

import 'package:sprnkl_flutter/pages/zones.dart';

void main() => runApp(SprnklApp());

class SprnklApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sprnkl',
      theme: ThemeData(
        fontFamily: 'Rubik',
        primaryColor: primaryColor,
        scaffoldBackgroundColor: primaryColor,
        hintColor: hintColor,
      ),
      home: Scaffold(
        backgroundColor: primaryColor,
        body: ZonesPage(),
      ),
    );
  }
}
