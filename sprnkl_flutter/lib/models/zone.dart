class Zone {
  int id;
  String title;
  int status;
  int pin;
  String frequency = "daily";
  var days = [];
  Zone({this.id, this.title, this.status, this.pin});
}