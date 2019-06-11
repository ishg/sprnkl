// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from './database'
import VeeValidate from 'vee-validate'

Vue.config.productionTip = false
Vue.use(VeeValidate, {
  errorBagName: 'valErr'
})

let app

firebase.auth().onAuthStateChanged(function () {
  if (!app) {
    // app = new Vue({
    //   el: '#app',
    //   router,
    //   components: { App },
    //   template: '<App />',
    //   data () {
    //     return {
    //       stateIsLoading: false
    //     }
    //   }
    // })
    app = new Vue({ 
      el: '#app', 
      router, 
      render: h => h(App),
      template: '<App />',
      data () {
        return {
          stateIsLoading: false
        }
      }
    })
  }
})
