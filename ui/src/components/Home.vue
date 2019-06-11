<template>
  <dashboard>

    <div id="new_modal" class="modal bottom-sheet">
      <div class="modal-content">
        <h4>New Schedule</h4>
        <div class="section">
          <div class="input-field col s12">
            <input v-validate="'required'" name="new_schedule_name" v-model="new_schedule.name" type="text">
            <label style="left: 0; margin-left: 0;" for="new_schedule_name">Schedule Name</label>
          </div>
        </div>
        <div class="section">
          <span>Schedule Zones</span>
          <div class="input-field">
            <select multiple id="new_schedule_zones" v-model="new_schedule.zones">
              <option value="" disabled selected>Choose your zone</option>
              <option v-for="(z, idx) in zones" :key="idx" :value="'new_schedule_zone_' + z.id">{{z.name}}</option>
            </select>
          </div>
        </div>
        <div class="section">
          <span>Watering Days</span>
          <div>
            <a style="margin-right:10px; margin-top: 10px;" v-for="(day, idx) in days" :key="idx" v-bind:class="{ 'day-btn-enabled': new_schedule.days.includes(day) }" class="day-btn btn-flat" v-on:click="updateNewScheduleDay(day)">{{day}}</a>
          </div>
        </div>
        <div class="section">
          <span>Watering Start Time</span>
          <span class="right">
            <input style="max-width: 100px" type="text" class="timepicker" v-model.lazy="new_schedule.time" id="new_schedule_time" >
            <i class="material-icons right" style="margin-left: 0px; margin-right: -5px; color: color: #50AE54;">chevron_right</i>
          </span>
        </div>
        <div class="section">
          <span>Watering Duration</span>
          <span class="right" style="color: #50AE54; font-weight: bold;">{{new_schedule.duration}} minute(s)</span>
          <input type="range" id="duration-slider" min="1" max="60" v-model="new_schedule.duration" />
        </div>
      </div>
      <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-red btn-flat">Cancel</a>
        <a href="#!" v-on:click="createSchedule()" class="waves-effect waves-green btn green">Save</a>
      </div>
    </div>

    <div class="row">
      <div class="col s12">
        <div class="card">
          <ul class="collection with-header">
            <li class="collection-header"><h4>Hobstone Sprinklers</h4></li>
            <li v-for="(zone, index) in zones" :key="index" class="collection-item">
            <div>{{zone.name}}

            <div class="switch right">
              <label>
                Off
                <input v-model="zone.status" type="checkbox" v-on:change="updateZone(zone)">
                <span class="lever"></span>
                On
              </label>
            </div>

            <!-- <a v-show="zone.status" :href="'/' + zone.pin + '/off'" class="secondary-content">
            <i class="material-icons red-text">power_off</i>
            </a>
            <a v-show="!zone.status" :href="'/'+zone.pin+ '/on'" class="secondary-content">
            <i class="material-icons green-text">power_settings_new</i></a> -->
            </div></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col s12">
        <div class="card">
            <ul class="collapsible collection with-header">
              <li class="collection-header" style="line-height: 35px;">
                <span style="font-size: 30px;">Schedules</span>
                <a href="#new_modal" class="btn green secondary-content modal-trigger"><i class="material-icons left">add</i>New</a>
              </li>
              <li v-for="(s, index) in schedules" :key="index">
                <div class="collapsible-header">
                  <i v-show="s.enabled" class="material-icons green-text">play_circle_outline</i>
                  <i v-show="!s.enabled" class="material-icons red-text">pause_circle_outline</i>
                  {{ s.name }}

                </div>
                <!--- NEW SECTION --->
                <div class="collapsible-body green lighten-5">
                  <div class="section">
                    <span>Enable Schedule</span>
                    <div class="switch right">
                      <label>
                        Off
                        <input v-model="s.enabled" type="checkbox">
                        <span class="lever"></span>
                        On
                      </label>
                    </div>
                  </div>
                  <div v-show="s.enabled">
                    <div class="section">
                      <span>Schedule Zones</span>
                      <p v-for="(z, idx) in zones" :key="idx">
                        <label style="color: black">
                          <input type="checkbox" :id="'schedule_' + s.id + '_zone_' + z.id" class="filled-in" :checked="s.zones.includes(z.id)" v-on:change="dirty(s)" />
                          <span>{{z.name}}</span>
                        </label>
                      </p>
                    </div>
                    <div class="section">
                      <span>Watering Days</span>
                      <div>
                        <a style="margin-right:10px; margin-top: 10px;" v-for="(day, idx) in days" :key="idx" v-bind:class="{ 'day-btn-enabled': s.days.includes(day) }" class="day-btn btn-flat" v-on:click="updateDay(s, day)">{{day}}</a>
                      </div>
                    </div>
                    <div class="section">
                      <span>Watering Start Time</span>
                      <span class="right">
                        <input type="text" class="timepicker" :id="'schedule_' +s.id+ '_time'" :value="renderTime(s.hour, s.minute)" v-on:change="dirty(s)">
                        <i class="material-icons right green-text" style="margin-left: 0px; margin-right: -5px; color: color: #50AE54;">chevron_right</i>
                      </span>
                    </div>
                    <div class="section">
                      <span>Watering Duration</span>
                      <span class="right" style="color: #50AE54; font-weight: bold;">{{s.duration}} minute(s)</span>
                      <input type="range" id="duration-slider" min="1" max="60" v-model="s.duration" v-on:change="dirty(s)" />
                    </div>
                  </div>
                  <div class="section">
                      <a href="#!" class="btn green right" style="right: 0" v-on:click="updateSchedule(s)"><i class="material-icons left">done</i>Save</a>
                      <a href="#!" class="btn-flat red-text modal-trigger" v-on:click="deleteSchedule(s.id)"><i class="material-icons left" >delete</i>Delete</a>
                    </div>
                </div>
              </li>
            </ul>
        </div>
      </div>
    </div>
  </dashboard>
</template>

<script>
/* global M */
import Dashboard from '@/components/Dashboard'
import moment from 'moment'
import axios from 'axios'
import swal from 'sweetalert'

export default {
  name: 'Home',
  components: { Dashboard },
  data () {
    return {
      api: {
        basepath: 'http://localhost:5000/api/v1'
      },
      meta: {
        time_now: moment().format('LT')
      },
      zones: [],
      schedules: [],
      days: ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'],
      new_schedule: {
        name: '',
        time: moment().format('LT'),
        duration: 10,
        zones: [],
        days: [],
      }
    }
  },
  mounted () {
    const vm = this
    vm.getData()
    setTimeout(function() {
      vm.initM()
    }, 3000)
  },
  methods: {

    // HELPER METHODS
    
    renderTime(h, m) {
      if (h < 10) {
        h = String(0) + String (h)
      }
      return moment(String(h) + String(m), 'HHmm').format('LT')
    },
    initM () {
      var elems = document.querySelectorAll('.collapsible');
      M.Collapsible.init(elems);

      let options = {
        defaultTime: 'now'
      }

      elems = document.querySelectorAll('.timepicker');
      M.Timepicker.init(elems, options);

      elems = document.querySelectorAll('select');
      M.FormSelect.init(elems);

      elems = document.querySelectorAll('.modal');
      M.Modal.init(elems);

    },

    dirty (schedule) {
      schedule.dirty = true
    },
    updateDay (zone, day) {
      if (zone.days.includes(day)) {
        zone.days.splice(zone.days.indexOf(day), 1)
      } else {
        zone.days.push(day)
      }
      zone.dirty = true
    },
    updateNewScheduleDay (day) {
      if (this.new_schedule.days.includes(day)) {
        this.new_schedule.days.splice(this.new_schedule.days.indexOf(day), 1)
      } else {
        this.new_schedule.days.push(day)
      }
    },
    nextId(collection) {
      var max = 0
      for (var i = 0; i < collection.length; i++) {
        if (collection[i].id > max) {
          max = collection[i].id
        }
      }
      return max + 1
    },
    resetForm() {
      this.new_schedule = {
        name: '',
        time: moment().format('LT'),
        duration: 10,
        zones: [],
        days: [],
      }
    },

    // API METHODS 

    getData() {
      const vm = this
      axios.get(vm.api.basepath + '/zones').then((res) => {
        vm.zones = res.data
        axios.get(vm.api.basepath + '/schedules').then((res) => {
          vm.schedules = res.data
          vm.initM()
        }) 
      })
    },

    // CRUD METHODS

    updateZone(z) {
      const vm = this
      z.status = z.status ? 1 : 0
      axios.put(vm.api.basepath + '/zones/' + z.id, z).then((res) => {
        console.log(res)
        vm.getData()
      }).catch((error) => {
        console.log(error)
        swal("Oops!", "Something went wrong. Please try again.", "error")
      })
    },



    createSchedule() {
      const vm = this
      var errors = []
      if (vm.new_schedule.name == '') {
        errors.push('Enter valid schedule name\n')
      }
      if (vm.new_schedule.zones.length == 0) {
        errors.push('Choose zones to schedule\n')
      }
      if (vm.new_schedule.days.length == 0) {
        errors.push('Choose days to run schedule')
      }
      if (errors.length > 0) {
        swal("Invalid inputs", String(errors).replace(/,/g, ''), "error");
      } else {
        var schedule = {
          id: vm.nextId(vm.schedules),
          name: vm.new_schedule.name,
          hour: moment(vm.new_schedule.time, 'hh:mm A').hour(),
          minute: moment(vm.new_schedule.time, 'hh:mm A').minute(),
          enabled: 1,
          days: vm.new_schedule.days,
          zones: vm.new_schedule.zones.map(x => parseInt(x.split('_').pop())),
          duration: vm.new_schedule.duration,
        }
        axios.post(vm.api.basepath + '/schedules', schedule).then((res) => {
          console.log(res)
          vm.getData()
        }).catch((error) => {
          console.log(error)
          swal("Oops!", "Something went wrong. Please try again.", "error")
        })
        vm.resetForm()
      }
    },
    updateSchedule(s) {
      const vm = this
      var zs = []
      for (var i = 0; i < vm.zones.length; i++) {
        console.log($('#schedule_' + s.id +'_zone_' + vm.zones[i].id).is(':checked'))
        if ($('#schedule_' + s.id +'_zone_' + vm.zones[i].id).is(':checked')){
          zs.push(vm.zones[i].id)
        }
      }
      s.zones = zs
      s.hour = moment($('#schedule_' + s.id + '_time').val(), 'hh:mm A').hour()
      s.minute = moment($('#schedule_' + s.id + '_time').val(), 'hh:mm A').minute()
      s.enabled = s.enabled ? 1 : 0

      var errors = []
      if (s.zones.length == 0) {
        errors.push('Choose zones to schedule\n')
      }
      if (s.days.length == 0) {
        errors.push('Choose days to run schedule')
      }
      if (errors.length > 0) {
        swal("Invalid inputs", String(errors).replace(/,/g, ''), "error");
      } else {
        axios.put(vm.api.basepath + '/schedules/' + s.id, s).then((res) => {
          console.log(res)
          vm.getData()
        }).catch((error) => {
          console.log(error)
          swal("Oops!", "Something went wrong. Please try again.", "error")
        })
      }
    },
    deleteSchedule(id) {
      const vm = this
      swal({
        title: "Are you sure?",
        text: "Do you want to delete this schedule?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          axios.delete(vm.api.basepath + '/schedules/' + id).then((res) => {
            console.log(res)
            vm.getData()
          }).catch((error) => {
            console.log(error)
            swal("Oops!", "Something went wrong. Please try again.", "error")  
          })
          swal("Schedule deleted", {
            icon: "success",
          });
        }
      });
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/_variables.scss';
@import '../assets/styles/_overrides.scss';
@import '../assets/styles/_forms.scss';
.collapsible-body{
  background-color: $grey-lighter;
  padding: 0;

  .section {
    padding: 10px 20px;
    border-bottom: 8px solid white;
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
  max-width: 100px;
  height: 1.5rem !important;
  line-height: 1.5rem;
  border-bottom: none !important;
  font-size: 14px !important;

  &:focus {
    outline: none;
    box-shadow: none !important;
  }
}

.modal.bottom-sheet {
  top: 0;
  height: 100%;
  max-height: 100%;
}

.swal-text {
  text-align: center !important;
}

[type="checkbox"].filled-in:checked + label:after {
  border: 2px solid $green;
  background-color: $green;
}

[type="checkbox"]:checked + label:before {
  border-right: 2px solid $green;
  border-bottom: 2px solid $green;
}
</style>
