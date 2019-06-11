import 'package:flutter/material.dart';
import 'package:sprnkl_flutter/models/zone.dart';
import 'package:sprnkl_flutter/util/colors.dart';
import 'package:flutter_icons/flutter_icons.dart';

const PAD = 10.0;

class DetailsPage extends StatefulWidget {
  final Zone zone;

  const DetailsPage({Key key, @required this.zone}) : super(key: key);

  @override
  _DetailsPageState createState() => new _DetailsPageState();
}

class _DetailsPageState extends State<DetailsPage>
    with SingleTickerProviderStateMixin {
  final List<Tab> myTabs = <Tab>[
    Tab(
      icon: new Icon(Icons.home),
    ),
    Tab(
      icon: new Icon(Icons.rss_feed),
    ),
  ];

  TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(vsync: this, length: myTabs.length);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

//  Widget _buildRow(LogModel log) {
//    int timeago = log.date.difference(DateTime.now().toUtc()).inDays;
//    String timeagotext;
//
//    if (timeago == 0) {
//      timeagotext = "Today";
//    } else if (timeago == -1) {
//      timeagotext = "Yesterday";
//    } else {
//      timeagotext = (timeago * -1).toString() + "d ago";
//    }
//
//    String iconText;
//    Color iconColor;
//    String descriptionText;
//
//    if (log.imageurl.length != 0) {
//      iconText = "camera";
//      iconColor = blueColor;
//      descriptionText = "Added a picture";
//    } else if (log.duration.inHours != 0) {
//      iconText = "clock";
//      iconColor = purpleColor;
//      descriptionText = "Logged " + log.duration.inHours.toString() + " hours";
//    } else if (log.streak) {
//      iconText = "zap";
//      iconColor = orangeColor;
//      descriptionText = "Continued the streak";
//    } else {
//      iconText = "check-circle";
//      iconColor = accentColor;
//      descriptionText = "Completed";
//    }
//
//    return Padding(
//        padding: const EdgeInsets.symmetric(vertical: PAD * 2),
//        child: Column(
//          children: <Widget>[
//            Row(
//              children: <Widget>[
//                Container(
//                    child: Padding(
//                      padding: const EdgeInsets.only(right: PAD),
//                      child: Icon(
//                        Feather.getIconData(iconText),
//                        color: iconColor,
//                      ),
//                    )),
//                Expanded(
//                  child: Text(
//                    descriptionText,
//                    style: TextStyle(color: darkgreyColor),
//                  ),
//                ),
//                Container(
//                  child: Text(
//                    timeagotext,
//                    textAlign: TextAlign.right,
//                    style: TextStyle(
//                      color: hintColor,
//                    ),
//                  ),
//                )
//              ],
//            ),
//            log.imageurl.length != 0
//                ? Padding(
//                padding: const EdgeInsets.symmetric(vertical: PAD),
//                child: ClipRRect(
//                  borderRadius: BorderRadius.all(Radius.circular(PAD)),
//                  child: Image.network(log.imageurl),
//                ))
//                : new Container()
//          ],
//        ));
//  }

//  Widget _buildList() {
//    widget.goal.logs.sort((a, b) {
//      return (a.date.millisecondsSinceEpoch > b.date.millisecondsSinceEpoch)
//          ? -1
//          : ((a.date.millisecondsSinceEpoch < b.date.millisecondsSinceEpoch)
//          ? 1
//          : 0);
//    });
//
//    return ListView.builder(
//      itemCount: widget.goal.logs.length,
//      itemBuilder: (context, position) {
//        return _buildRow(widget.goal.logs[position]);
//      },
//    );
//  }

  Widget buildDashboard(BuildContext context) {
    bool isSwitched = true;

    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      children: <Widget>[
        Row(children: <Widget>[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: PAD * 2),
            child: Text(
              widget.zone.title,
              overflow: TextOverflow.ellipsis,
              maxLines: 2,
              style: new TextStyle(fontSize: 22.0, color: blackColor),
            ),
          ),
        ]),
//        widget.zone.imageUrl.length != 0 ?
//        Padding(
//          padding: const EdgeInsets.symmetric(vertical: PAD, horizontal: 2*PAD),
//          child: ClipRRect(
//            borderRadius: BorderRadius.all(Radius.circular(PAD)),
//            child: Image.network(widget.zone.imageUrl),
//          ))
//          : new Container(),
        Padding(
            padding: const EdgeInsets.all(PAD * 2),
            child: ClipRRect(
                borderRadius: BorderRadius.all(Radius.circular(PAD)),
                child: Container(
                    color: greyColor,
                    child: Column(
                      children: <Widget>[
                        Row(
                          children: <Widget>[
                            Text("Schedule"),
                            Switch(
                              value: isSwitched,
                              onChanged: (value) {
                                setState(() {
                                  isSwitched = value;
                                });
                              },
                              activeTrackColor: Colors.lightGreenAccent,
                              activeColor: Colors.green,
                            )
                          ],
                        )
                      ],
                    )))),
        Padding(
            padding: const EdgeInsets.all(PAD * 2),
            child: ClipRRect(
              borderRadius: BorderRadius.all(Radius.circular(PAD)),
              child: Container(
                height: 100,
                color: greyColor,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: <Widget>[
                    Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10.0),
                        child: Container(
                          height: 80,
                          child: Column(
                            children: <Widget>[
                              Padding(
                                  padding: const EdgeInsets.all(PAD),
                                  child: Row(
                                    children: <Widget>[
                                      Padding(
                                        padding:
                                            const EdgeInsets.only(right: PAD),
                                        child: Icon(
                                          Feather.getIconData("check-circle"),
                                          color: accentColor,
                                        ),
                                      ),
                                      Text(
                                        "Done",
                                        style: TextStyle(color: darkgreyColor),
                                      ),
                                    ],
                                  )),
                              Text(
                                widget.zone.status.toString(),
                                style: TextStyle(
                                    color: blackColor,
                                    fontFamily: 'RubikMono',
                                    fontSize: 25),
                              ),
                            ],
                          ),
                        )),
                    Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10.0),
                        child: Container(
                          height: 80,
                          child: Column(
                            children: <Widget>[
                              Padding(
                                  padding: const EdgeInsets.all(PAD),
                                  child: Row(
                                    children: <Widget>[
                                      Padding(
                                        padding:
                                            const EdgeInsets.only(right: PAD),
                                        child: Icon(
                                          Feather.getIconData("zap"),
                                          color: orangeColor,
                                        ),
                                      ),
                                      Text(
                                        "Streak",
                                        style: TextStyle(color: darkgreyColor),
                                      ),
                                    ],
                                  )),
                              Text(
                                widget.zone.pin.toString(),
                                style: TextStyle(
                                    color: blackColor,
                                    fontFamily: 'RubikMono',
                                    fontSize: 25),
                              ),
                            ],
                          ),
                        )),
                    Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10.0),
                        child: Container(
                          height: 80,
                          child: Column(
                            children: <Widget>[
                              Padding(
                                  padding: const EdgeInsets.all(PAD),
                                  child: Row(
                                    children: <Widget>[
                                      Padding(
                                        padding:
                                            const EdgeInsets.only(right: PAD),
                                        child: Icon(
                                          Feather.getIconData("clock"),
                                          color: purpleColor,
                                        ),
                                      ),
                                      Text(
                                        "Time",
                                        style: TextStyle(color: darkgreyColor),
                                      ),
                                    ],
                                  )),
                              Text(
                                widget.zone.pin.toString(),
                                style: TextStyle(
                                    color: blackColor,
                                    fontFamily: 'RubikMono',
                                    fontSize: 25),
                              ),
                            ],
                          ),
                        )),
                  ],
                ),
              ),
            )),
      ],
    );
  }

//
//  Widget buildLogs(BuildContext context) {
//
//  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0.0,
        backgroundColor: whiteColor,
        elevation: 0.0,
        leading: IconButton(
            splashColor: Colors.transparent,
            onPressed: () {
              Navigator.pop(context);
            },
            icon: Icon(
              Feather.getIconData("arrow-left"),
              color: blackColor,
            )),
        actions: <Widget>[
          IconButton(
              onPressed: () {
                debugPrint("toggling status");
              },
              splashColor: Colors.transparent,
              icon: Icon(
                Feather.getIconData("power"),
                color: widget.zone.status == 0 ? redColor : greenColor,
              )),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: IconButton(
                onPressed: () {},
                splashColor: Colors.transparent,
                icon: Icon(
                  Feather.getIconData("more-vertical"),
                  color: blackColor,
                )),
          ),
        ],
      ),
      body: buildDashboard(context),
      backgroundColor: whiteColor,
    );
  }
}
