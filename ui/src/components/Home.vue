<template>
  <dashboard>
    <div class="row">
      <div class="col s12">
        <ul class="collapsible popout">
          <li v-for="(zone, index) in zones" :key="index ">
            <div class="collapsible-header">
              <i class="material-icons" v-if="zone.schedule ">schedule</i>
              <i class="material-icons" v-else>block</i>
              {{ zone.name }}
            </div>
            <div class="collapsible-body">
              <div class="section">
                <span>Schedule</span>
                <div class="switch right">
                  <label>
                    Off
                    <input v-model="zone.schedule" type="checkbox">
                    <span class="lever"></span>
                    On
                  </label>
                </div>
              </div>
              <div v-show="zone.schedule">
                <div class="section">
                  <span>Watering Frequency</span>
                  <div class="right">
                    <label>
                      <input class="with-gap" name="frequency" type="radio" value="Weekly" v-model="zone.frequency" v-on:change="dirty(zone)" />
                      <span>Weekly</span>
                    </label>
                    <label>
                      <input class="with-gap" name="frequency" type="radio" value="Daily" v-model="zone.frequency" v-on:change="dirty(zone)" />
                      <span>Daily</span>
                    </label>
                  </div>
                </div>
                <div class="section" v-show="zone.frequency == 'Weekly'">
                  <span>Watering Days</span>
                  <div>
                    <a style="margin-right:10px; margin-top: 10px;" v-for="(day, idx) in days" :key="idx" v-bind:class="{ 'day-btn-enabled': zone.days.includes(day) }" class="day-btn btn-flat" v-on:click="updateDay(zone, day)">{{day}}</a>
                  </div>
                </div>
                <div class="section">
                  <span>Watering Start Time</span>
                  <span class="right">
                    <input type="text" v-model="zone.startTime" class="timepicker browser-default" v-on:change="dirty(zone)">
                    <i class="material-icons right" style="margin-left: 0px; margin-right: -5px; color: color: #50AE54;">chevron_right</i>
                  </span>
                </div>
                <div class="section">
                  <span>Watering Duration</span>
                  <span class="right" style="color: #50AE54; font-weight: bold;">{{zone.duration}} minute(s)</span>
                  <input type="range" id="duration-slider" min="1" max="60" v-model="zone.duration" v-on:change="dirty(zone)" />
                </div>
                <div class="section">
                  <span>Weather Sense</span>
                  <div class="switch right">
                    <label>
                      Off
                      <input v-model="zone.rainsense" type="checkbox" v-on:change="dirty(zone)">
                      <span class="lever"></span>
                      On
                    </label>
                  </div>
                </div>
                <div class="section">
                  <a href="#" class="btn green" v-bind:class="{disabled: !zone.dirty}" style="right: 0" v-on:click="updateZone(zone)">Save</a>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </dashboard>
</template>

<script>
/* global M */
import Dashboard from '@/components/Dashboard'
import moment from 'moment'

export default {
  name: 'Home',
  components: { Dashboard },
  data () {
    return {
      days: ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'],
      zones: [{
        dirty: false,
        name: 'Zone 1',
        running: false,
        schedule: true,
        rainsense: false,
        frequency: 'Weekly',
        days: ['M', 'Sa', 'W'],
        startTime: moment().format('hh:mm a'),
        duration: 10
      }]
    }
  },
  mounted () {
    this.initM()
  },
  methods: {
    initM () {
      let elem = document.querySelectorAll('.collapsible')
      M.Collapsible.init(elem)
      let options = {
        defaultTime: 'now'
      }
      var elems = document.querySelectorAll('.timepicker');
      var instances = M.Timepicker.init(elems, options);
    },
    updateZone (zone) {
      zone.dirty = false
    },
    dirty (zone) {
      zone.dirty = true
    },
    updateDay (zone, day) {
      if (zone.days.includes(day)) {
        zone.days.splice(zone.days.indexOf(day), 1)
      } else {
        zone.days.push(day)
      }
      zone.dirty = true
    },
    resetZone (zone) {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/_variables.scss';
.collapsible-body{
  background-color: $grey-lighter;
  padding: 0;

  .section {
    background-color: white;
    padding: 10px 20px;
    margin-top: 5px;
  }
}

.day-btn {
  background-color: $grey-lighter;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
  text-transform: capitalize;
  padding: 0 8px;
  margin-right: 5px;
}

.day-btn-enabled {
  background-color: #50AE54;
  color: white;
}

label {
  margin-left: 10px;
}

.timepicker {
  text-align: right;
  color: #50AE54;
  font-weight: bold;

  &:focus {
    outline: none;
  }
}
</style>
