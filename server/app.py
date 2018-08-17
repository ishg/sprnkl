from flask import Flask, render_template
import datetime
import RPi.GPIO as GPIO

app = Flask(__name__)
GPIO.setmode(GPIO.BCM)

zones = [
    {"pin": 11, "name": "zone 1-4 (back tree)", "status": 0},
    {"pin": 9, "name": "zone 2-6 (back garden)", "status": 0},
    {"pin": 10, "name": "zone 3-3 (veg garden)", "status": 0},
    {"pin": 24, "name": "zone 4-5 (broken)", "status": 0},
    {"pin": 23, "name": "zone 5-2 (drip)", "status": 0},
    {"pin": 4, "name": "zone 6-1 (overflow)", "status": 0},
    {"pin": 14, "name": "zone 9 (front lawn right)", "status": 0},
    {"pin": 18, "name": "zone 10 (front lawn left)", "status": 0},
    {"pin": 15, "name": "zone 11 (front kyaaris)", "status": 0},
    {"pin": 3,"name": "zone 12 (front kyaaris)", "status": 0},
]

for zone in zones:
    GPIO.setup(zone['pin'], GPIO.OUT)
    GPIO.output(zone['pin'], GPIO.LOW)

@app.route("/")
def main():
    for zone in zones:
	zone["status"] = GPIO.input(zone["pin"])
    #print zones
    templateData = { 'zones': zones }
    return render_template('main.html', **templateData)

@app.route("/<changePin>/<action>")
def action(changePin, action):
    changePin = int(changePin)

    if action == "on":
        GPIO.output(changePin, GPIO.HIGH)
    if action == "off":
        GPIO.output(changePin, GPIO.LOW)
    for zone in zones:
	zone["status"] = GPIO.input(zone["pin"])
    #print zones
    templateData = {'zones': zones}
    return render_template('main.html', **templateData)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
