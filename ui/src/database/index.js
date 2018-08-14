import Firebase from 'firebase'

var config = {
  apiKey: 'AIzaSyBx4jkHI52MNc6qUNG0JVhcK9niRXDOqsY',
  authDomain: 'sprnkl-ace51.firebaseapp.com',
  databaseURL: 'https://sprnkl-ace51.firebaseio.com',
  projectId: 'sprnkl-ace51',
  storageBucket: 'sprnkl-ace51.appspot.com',
  messagingSenderId: '826325417518'
}

const firebaseApp = Firebase.initializeApp(config)

export const db = firebaseApp.database()
export default firebaseApp
