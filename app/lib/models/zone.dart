class Zone {
  int id;
  String title;
  int status;
  int pin;
  String frequency = "daily";
  var days = [];
  String imageUrl = "https://via.placeholder.com/500";
  Zone({this.id, this.title, this.status, this.pin});
}