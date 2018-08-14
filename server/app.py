from flask import Flask, render_template
import datetime
import RPi.GPIO as GPIO

app = Flask(__name__)
GPIO.setmode(GPIO.BCM)

zones = [
    {"pin": 11, "name": "zone 1-4 (back tree)"},
    {"pin": 9, "name": "zone 2-6 (back garden)"},
    {"pin": 10, "name": "zone 3-3 (veg garden)"},
    {"pin": 24, "name": "zone 4-5 (broken)"},
    {"pin": 23, "name": "zone 5-2 (drip)"},
    {"pin": 4, "name": "zone 6-1 (overflow)"},
    {"pin": 14, "name": "zone 9"},
    {"pin": 18, "name": "zone 10"},
    {"pin": 15, "name": "zone 11"},
    {"pin": 3,"name": "zone 12"},
]

for zone in zones:
    GPIO.setup(zone['pin'], GPIO.OUT)
    GPIO.output(zone['pin'], GPIO.LOW)

@app.route("/")
def main():
    templateData = { 'zones': zones }
    return render_template('main.html', **templateData)

@app.route("/<changePin>/<action>")
def action(changePin, action):
    changePin = int(changePin)

    if action == "on":
        GPIO.output(changePin, GPIO.HIGH)
    if action == "off":
        GPIO.output(changePin, GPIO.LOW)
    templateData = {'zones': zones}
    return render_template('main.html', **templateData)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
