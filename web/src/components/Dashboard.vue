<template>
  <div class="dashboard">
    <div class="navbar-fixed">
      <nav>
        <div class="nav-wrapper">
          <router-link to="/tests" class="brand-logo center">Sprnkl</router-link>
          <ul class="left">
            <!-- <li><router-link to="/pids">P&IDs</router-link></li>
            <li><router-link to="/view-pid">View</router-link></li> -->
          </ul>
          <ul class="right">
            <li><a href="#" v-on:click="logout"><i class="material-icons right">exit_to_app</i></a></li>
          </ul>
        </div>
      </nav>
    </div>

    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Dashboard',
  data () {
    return {
      currentUser: firebase.auth().currentUser.email
    }
  },
  mounted () {
  },
  methods: {
    logout () {
      this.$root.stateIsLoading = true
      firebase.auth().signOut().then(() => {
        this.$router.replace('login')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/_variables.scss';

nav {
  background-color: $smt-green;
  height: 56px;
  line-height: 56px;
  .brand-logo {
    margin: auto 1rem;
    font-size: 1.8rem;
    font-family: Nunito;
    font-weight: bold;
  }
  i {
    height: 56px;
    line-height: 56px;
  }
}

.side-nav-toggle {
  display: none;
}

@media only screen and (max-width: 992px) {
  nav .brand-logo {
      margin: 0;
  }
}

@media only screen and (max-width : 768px) {
  .side-nav-toggle {
    display: block;
  }
}

@media only screen and (min-width: 769px) {
  .sidenav {
    transform: translateX(0%) !important
  }
}
</style>
