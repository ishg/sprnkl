<template>
  <div class="row page-wrapper valign-wrapper">
    <div class="col s12 m6 l4 offset-l4 offset-m3">
      <div class="card auth-page">
        <div class="card-content">
          <div class="center">
            <img style="max-width: 40%; margin-bottom: 20px;" src="../assets/images/logo-plant.png"/>
            <h2 style="margin-top: 0; font-weight: bold; font-family: Nunito">Sprnkl</h2>
          </div>
          <form id="loginForm" @submit.prevent="validateBeforeLogin">
            <div id="login" class="auth-form">
              <div class="row">
                <div class="input-field col s12">
                  <input :class="{'val-error': valErr.has('email')}" v-model="email" name="email" type="email" v-validate="'required|email'">
                  <span v-show="valErr.has('email')" class="red-text">{{ valErr.first('email') }}</span>
                  <label for="email">Email</label>
                </div>
                <div class="input-field col s12">
                  <input v-model="password" name="password" type="password" v-validate="'required'">
                  <span v-show="valErr.has('password')" class="red-text">{{ valErr.first('password') }}</span>
                  <label for="password">Password</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s12">
                  <button type="submit" class="btn waves-effect waves-light green" style="width: 100%;">Login</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import swal from 'sweetalert'

// const emailREG = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  mounted () {
  },
  methods: {
    validateBeforeLogin () {
      console.log(this.valErr)
      this.$validator.validateAll().then((result) => {
        this.$root.stateIsLoading = true
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
          this.$router.replace('pids')
        }, (err) => {
          this.$root.stateIsLoading = false
          let errMessage = ''
          switch (err.code) {
            case 'auth/user-not-found':
              errMessage = 'User not found'
              break
            case 'auth/wrong-password':
              errMessage = 'Wrong password'
              break
            default:
              break
          }
          swal({
            title: 'Authentication error!',
            text: errMessage,
            icon: 'error',
            button: {
              text: 'OK',
              value: true,
              className: 'btn-flat green white-text waves-effect waves-light',
              closeModal: true,
              visible: true
            }
          })
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/_variables.scss';

.auth-page {
  margin-top: 3rem;
  .logo {
    text-align: center;
    padding-top: 20px;
    img {
      width: 200px;
      transform: rotate(0.5turn);
    }
    h4 {
      color: #7e57c2;
      margin: 0;
    }
  }
  h1{
    padding-top: 30px;
  }
}
.auth-error {
  text-align: center;
  .chip {
    color: $white;
    background-color: $red;
  }
}

</style>
