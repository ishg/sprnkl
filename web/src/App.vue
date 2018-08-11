<template>
  <div id="app">
    <loader v-if="$root.stateIsLoading"></loader>
    <router-view/>
  </div>
</template>

<script>
import Loader from './util/Loader'
export default {
  name: 'App',
  components: { Loader }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,600|Nunito:300,400,700|Source+Sans+Pro:400,600,700');
@import './assets/styles/_variables.scss';
#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  height: 100%;
}

body {
  min-height: 100%;
  background-color: #e1f5fe;
  // background-color: #ffffff;
  // background-image: linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%);
  // background-color: #c3cbdc;
  // background-image: linear-gradient(147deg, #c3cbdc 0%, #edf1f4 74%);
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.page-wrapper {
  min-height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  margin-bottom: 0px;
  background-color: #4d5dfb;
  background-image: linear-gradient(315deg, #4d5dfb 0%, #08c8f6 74%);
}

.pulse::before {
  -webkit-animation: pulse-animation 2s ease-out infinite;
  animation: pulse-animation 2s ease-out infinite;
}

.timepicker-digital-display {
  background-color: #50AE54 !important;
}
.timepicker-canvas-bg {
  fill: #50AE54;
}
.timepicker-canvas-bearing {
  fill: #50AE54;
}
.timepicker-canvas line {
  stroke: #50AE54;
}
.timepicker-close {
  color: #50AE54;
}

input[type=range]::-webkit-slider-thumb {
  background-color: #50AE54;
}
input[type=range]::-moz-range-thumb {
  background-color: #50AE54;
}
input[type=range]::-ms-thumb {
  background-color: #50AE54;
}

/***** These are to edit the thumb and the text inside the thumb *****/
input[type=range] + .thumb {
  background-color: #dedede;
}
input[type=range] + .thumb.active .value {
  color: #50AE54;
}

[type="radio"]:checked+span:after, [type="radio"].with-gap:checked+span:before, [type="radio"].with-gap:checked+span:after {
  border: 2px solid #50AE54;
}
[type="radio"]:checked+span:after, [type="radio"].with-gap:checked+span:after {
    background-color: #50AE54;
}
.switch label input[type=checkbox]:checked+.lever:after {
  background-color: #50AE54;
}
.switch label input[type=checkbox]:checked+.lever {
  background-color: #c8e6c9;
}

[type="radio"]:not(:checked)+span, [type="radio"]:checked+span {
  padding-left: 25px;
}
</style>
