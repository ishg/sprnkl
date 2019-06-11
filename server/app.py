from flask import Flask, jsonify, g, render_template
from flask_cors import CORS
from flask_restful import Resource, Api
from flask_restful.reqparse import RequestParser
import datetime
import json
import logging
logging.basicConfig()

from apscheduler.schedulers.background import BackgroundScheduler
scheduler = BackgroundScheduler({
    'apscheduler.timezone': 'America/Los_Angeles'
})
logging.getLogger('apscheduler').setLevel(logging.DEBUG)

cron_days = {'Su': 'sun', 'M': 'mon', 'T': 'tue',
             'W': 'wed', 'Th': 'thu', 'F': 'fri', 'Sa': 'sat'}

'''
import RPi.GPIO as GPIO
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
'''


zone_request_parser = RequestParser(bundle_errors=True)
zone_request_parser.add_argument(
    'id', type=int, required=True, help="Plaese enter a valid integer as 'id'")
zone_request_parser.add_argument(
    'pin', type=int, required=True, help="Please enter a valid integer as 'pin'", choices=(11, 9, 10, 24, 4, 23, 14, 18, 15, 3))
zone_request_parser.add_argument(
    'name', type=str, required=True, help="Please enter a valid name for the zone as 'name")
zone_request_parser.add_argument(
    'status', type=int, choices=(0, 1), help="Please enter a 0 or 1 for 'status'")

schedule_request_parser = RequestParser(bundle_errors=True)
schedule_request_parser.add_argument(
    'id', type=int, required=True, location='json', help="Plaese enter a valid integer as ID")
schedule_request_parser.add_argument(
    'days', type=list, required=True, location='json', help='Invalid list of days. Choose from one or more of ["M","T","W","Th","F","Sa","Su"]'
)
schedule_request_parser.add_argument(
    'duration', type=int, required=True, location='json', help="Please enter a valid integer for 'duration' in minutes."
)
schedule_request_parser.add_argument(
    'name', type=str, required=True, location='json', help="Please enter a 'name' for the schedule"
)
schedule_request_parser.add_argument(
    'hour', type=int, required=True, location='json', help="Please enter a valid int for 'hour'"
)
schedule_request_parser.add_argument(
    'minute', type=int, required=True, location='json', help="Please enter a valid int for 'minute'"
)
schedule_request_parser.add_argument(
    'zones', type=list, required=True, location='json', help="Please enter a valid list of zone ids"
)
schedule_request_parser.add_argument(
    'enabled', type=int, location='json', choices=(0, 1), help="Please enter a 0 or 1 for 'enabled'"
)


DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)
api = Api(app, prefix='/api/v1')

CORS(app, resources={r'/*': {'origins': '*'}})


def add_job(s):
  scheduler.add_job(
      lambda: turn_on_zones(s['zones']),
      'cron',
      day_of_week=str(map(lambda x: cron_days[x], s['days'])).replace(
          '[', '').replace(']', '').replace(' ', '').replace("'", ''),
      hour=s['hour'],
      minute=s['minute'],
      id='sched_{}_start'.format(s['id'])
  )

  start_date = datetime.datetime.now().replace(
      hour=s['hour'], minute=s['minute'])
  end_date = start_date + datetime.timedelta(minutes=s['duration'])

  scheduler.add_job(
      lambda: turn_off_zones(s['zones']),
      'cron',
      day_of_week=str(map(lambda x: cron_days[x], s['days'])).replace(
          '[', '').replace(']', '').replace(' ', '').replace("'", ''),
      hour=int(end_date.hour),
      minute=int(end_date.minute),
      id='sched_{}_end'.format(s['id'])
  )

# Initialize and add jobs from file to scheduler
with open('config.json') as infile:
  data = json.load(infile)
  if len(data['schedules']) > 0:
    for s in data['schedules']:
      add_job(s)
scheduler.start()


def update_job(s):
  pass


def delete_job(id):
  pass


@app.before_request
def getData():
  with open('config.json') as json_file:
    g.data = json.load(json_file)


@app.after_request
def putData(response):
  # for i in range(len(g.data['zones'])):
  #   g.data['zones'][i]['status'] = GPIO.input(g.data['zones'][i]['pin'])
  with open('config.json', 'w') as outfile:
    json.dump(g.data, outfile)
  return response


def sync():
  # for i in range(len(g.data['zones'])):
  #   g.data['zones'][i]['status'] = GPIO.input(g.data['zones'][i]['pin'])
  with open('config.json', 'w') as outfile:
    json.dump(g.data, outfile)


def turn_on_zones(zones):
  data = {}
  with open('config.json') as json_file:
    data = json.load(json_file)
  for idx in zones:
    pin = next((x for x in data['zones'] if x['id'] == idx))['pin']
    #   GPIO.output(zone['pin'], GPIO.HIGH)
    print 'Turning on Zone {} on pin {}'.format(idx, pin)
  sync()


def turn_off_zones(zones):
  with open('config.json') as json_file:
    data = json.load(json_file)
  for idx in zones:
    pin = next((x for x in data['zones'] if x['id'] == idx))['pin']
    #   GPIO.output(zone['pin'], GPIO.LOW)
    print 'Turning off Zone {} on pin {}'.format(idx, pin)
  sync()

# This is for IFTTT Google Assitant actions


class Action(Resource):

  def post(self, tag, action):
    zones = []
    for z in g.data['zones']:
      if z['tag'] == tag:
        zones.append(z['id'])
    if action == 'on':
      turn_on_zones(zones)
    elif action == 'off':
      turn_off_zones(zones)
    return {"msg": "Turned {} {} sprinklers".format(action, tag)}


class ZoneCollection(Resource):

  def get(self):
    return g.data['zones']

  # def post(self):
  #   # TODO: Check dupication
  #   args = zone_request_parser.parse_args()
  #   g.data['zones'].append(args)
  #   with open('config.json', 'w') as outfile:
  #     json.dump(g.data, outfile)
  #   return {'msg': 'Zone added', 'zone_data': args}


class Zone(Resource):

  def get(self, id):
    return next((x for x in g.data['zones'] if x['id'] == id), {
        'error': 'Zone ID {} not found. Please enter a valid Zone ID'.format(id)
    })

  def put(self, id):
    # NOTE: Currently Put is only used to toggle
    args = zone_request_parser.parse_args()
    index = [x for x, y in enumerate(g.data['zones']) if y['id'] == id]
    if len(index) == 0:
      return {'error': 'Zone id {} not found. Please enter a valid Zone ID'.format(id)}
    else:
      index = index[0]
      g.data['zones'][index] = args
      if args.status == 1:
        turn_on_zones([args['id']])
      else:
        turn_off_zones([args['id']])
      return {'msg': 'Toggled zone id {}'.format(id)}

  # def delete(self, id):
  #   args = zone_request_parser.parse_args()
  #   index = [x for x, y in enumerate(g.data['zones']) if y['id'] == id]
  #   if len(index) == 0:
  #     return {'error': 'Zone id {} not found. Please enter a valid Zone ID'.format(id)}
  #   else:
  #     index = index[0]
  #     g.data['zones'].pop(index)
  #     return {'msg': 'Delete zone id {}'.format(id)}


class ScheduleCollection(Resource):

  def get(self):
    return g.data['schedules']

  def post(self):
    # TODO: Check dupication
    args = schedule_request_parser.parse_args()
    g.data['schedules'].append(args)

    # TODO: Add to scheduler
    add_job(args)
    return {"msg": "Schedule added", "schedule_data": args}


class Schedule(Resource):

  def get(self, id):
    return next((x for x in g.data['schedules'] if x['id'] == id), {
        'error': 'Schedule ID not found. Please enter a valid ID'
    })

  def put(self, id):
    args = schedule_request_parser.parse_args()
    index = [x for x, y in enumerate(g.data['schedules']) if y['id'] == id]
    if len(index) == 0:
      return {'error': 'Schedule id {} not found. Please enter a valid Schedule ID'.format(id)}
    else:
      index = index[0]
      g.data['schedules'][index] = args
      return {'msg': 'Updated schedule id {}'.format(id)}

  def delete(self, id):
    index = [x for x, y in enumerate(g.data['schedules']) if y['id'] == id]
    if len(index) == 0:
      return {'error': 'Zone id {} not found. Please enter a valid Zone ID'.format(id)}
    else:
      index = index[0]
      g.data['schedules'].pop(index)
      return {'msg': 'Deleted schedule id {}'.format(id)}


api.add_resource(ZoneCollection, '/zones')
api.add_resource(Zone, '/zones/<int:id>')
api.add_resource(ScheduleCollection, '/schedules')
api.add_resource(Schedule, '/schedules/<int:id>')
api.add_resource(Action, '/actions/<tag>/<action>')

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5000, debug=DEBUG)
