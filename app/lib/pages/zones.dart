import 'package:flutter/material.dart';
import 'package:flutter_icons/flutter_icons.dart';

import 'package:sprnkl_flutter/util/colors.dart';

import 'package:sprnkl_flutter/models/zone.dart';

import 'package:sprnkl_flutter/pages/details.dart';

import 'package:flutter/services.dart';

import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;

const double PAD = 10.0;

enum Modal { CANCEL, SUBMIT }
enum Settings { ONE, TWO }

class ZonesPage extends StatefulWidget {
  @override
  _ZonesPageState createState() => new _ZonesPageState();
}

class _ZonesPageState extends State<ZonesPage>
    with SingleTickerProviderStateMixin {

  List<Zone> zones;

  @override
  void initState() {
    super.initState();
    _refresh();
  }

  @override
  void dispose() {
    super.dispose();
  }

  /* Constants and Variables */

  _refresh() {
    getZones().then((zs) async {
      debugPrint(zs.toString());
      setState(() {
        zones = zs;
      });
    });
  }

  Future<List<Zone>> getZones() async {

    //var url = "http://192.168.1.34:5000/api/status";
    var url = "http://430ac27c.ngrok.io/api/status";
    String username = 'sprnkl';
    String password = 'poptarts';
    String basicAuth =
        'Basic ' + base64Encode(utf8.encode('$username:$password'));

    var result;
    // Await the http get response, then decode the json-formatted responce.
    var response = await http.get(url, headers: {'authorization': basicAuth});
    if (response.statusCode == 200) {
      var jsonResponse = jsonDecode(response.body);
      debugPrint(jsonResponse.toString());
      result = jsonResponse;
    }

    return List.generate(result.length, (i) {
      return Zone(
          id: result[i]["id"],
          title: result[i]["name"],
          pin: result[i]["pin"],
          status: result[i]["status"]
      );
    });
  }


  bool sortCount = true;

  var shuffle = true;

  bool _sortflag = true;

  final _formKey = GlobalKey<FormState>();

  Widget _buildRow(Zone zone) {
    return Padding(
        padding: const EdgeInsets.only(bottom: PAD),
        child: new GestureDetector(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => DetailsPage(zone: zone)),
            );
          },
          child: Card(
            elevation: 2.0,
            child: Column(
              children: <Widget>[
//                Container(
//                    height: PAD,
//                    child: Padding(
//                        padding: const EdgeInsets.fromLTRB(0.0, 0.0, 0.0, 0.0),
//                        child: ClipRRect(
//                          borderRadius: BorderRadius.only(
//                              topLeft: Radius.circular(PAD),
//                              topRight: Radius.circular(PAD)),
//                          child: LinearProgressIndicator(
//                            value: 10 / 100.0,
//                            backgroundColor: accentLight,
//                            valueColor:
//                            AlwaysStoppedAnimation<Color>(accentColor),
//                          ),
//                        ))),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Expanded(
                      child: Padding(
                          padding: const EdgeInsets.all(PAD),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: <Widget>[
                              Text(
                                "${zone.title}",
                                overflow: TextOverflow.ellipsis,
                                style: new TextStyle(
                                    fontSize: 22.0, color: blackColor),
                              ),
                              Row(
                                children: <Widget>[
                                  Padding(
                                      padding:
                                      const EdgeInsets.only(right: PAD, top: 5.0),
                                      child: Icon(
                                        Feather.getIconData('clock'),
                                        color: darkgreyColor,
                                        size: 18,
                                      )),
                                ],
                              )
                            ],
                          )),
                    ),
                    Container(
                        width: 80.0,
                        padding: const EdgeInsets.all(PAD),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: <Widget>[
                            Padding(
                                padding:
                                const EdgeInsets.only(right: PAD),
                                child: ClipOval(
                                  child: Container(
                                    height: 50.0,
                                    color: zone.status == 0
                                        ? backgroundColor
                                        : accentColor,
                                    child: IconButton(
                                      iconSize: 25.0,
                                      splashColor: Colors.transparent,
                                      onPressed: () {
                                        setState(() {
                                          zone.status = (zone.status == 1 ? 0 : 1);
                                        });
                                      },
                                      icon: Icon(
                                        Feather.getIconData('power'),
                                        color: zone.status == 0
                                            ? redColor
                                            : whiteColor,
                                      ),
                                    ),
                                  ),
                                )),
                          ],
                        ))
                  ],
                ),
              ],
            ),
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(PAD)),
          ),
        ));
  }


  Widget _buildList() {
    if (!_sortflag) {
      zones.sort((a, b) {
        return (a.id > b.id)
            ? -1
            : ((a.id < b.id) ? 1 : 0);
      });
    } else {
      zones.sort((a, b) {
        return (a.id < b.id)
            ? -1
            : ((a.id > b.id) ? 1 : 0);
      });
    }

    return ListView.builder(
      itemCount: zones.length,
      itemBuilder: (context, position) {
        return _buildRow(zones[position]);
      },
    );
  }

  @override
  Widget build(BuildContext context) {

    if (zones == null ) {
      return Center (
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(whiteColor),
        )
      );
    } else {
      return new Scaffold(
          appBar: AppBar(
//            centerTitle: true,
            titleSpacing: 25.0,
            backgroundColor: primaryColor,
            title: Text("Sprinklers",
                style: TextStyle(
                    fontSize: 28.0,
                    fontWeight: FontWeight.bold,
                    color: whiteColor)),
            elevation: 0.0,
            actions: <Widget>[
              IconButton(
                icon: Icon(
                  Feather.getIconData("refresh-cw"),
                  color: whiteColor,
                ),
                onPressed: () {
                  _refresh();
                },
                splashColor: Colors.transparent,
              ),
              IconButton(
                icon: Icon(
                  Feather.getIconData(
                      _sortflag ? "chevrons-up" : "chevrons-down"),
                  color: whiteColor,
                ),
                onPressed: () {
                  setState(() {
                    _sortflag = !_sortflag;
                  });
                },
                splashColor: Colors.transparent,
              ),
              Padding(
                padding: const EdgeInsets.only(right: 10.0),
                child: PopupMenuButton(
                    offset: Offset(10.0, 12.0),
                    padding: EdgeInsets.all(0.0),
                    icon: Icon(
                      Feather.getIconData("more-vertical"),
                      color: whiteColor,
                    ),
                    itemBuilder: (BuildContext context) =>
                    <PopupMenuEntry<Settings>>[
                      const PopupMenuItem<Settings>(
                        value: Settings.ONE,
                        child: Text('Setting 1'),
                      ),
                      const PopupMenuItem<Settings>(
                        value: Settings.TWO,
                        child: Text('Setting 2'),
                      ),
                    ]),
              ),
            ],
          ),
          backgroundColor: primaryColor,
          body: Column(
            children: <Widget>[
              Expanded(
                  child: Padding(
                      padding: const EdgeInsets.fromLTRB(20.0, PAD, 20.0, 0.0),
                      child: _buildList()))
            ],
          ));
    }
  }
}
