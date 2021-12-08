import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
import "firebase/compat/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDBMdmTSnakMB8nF7656UO1sDTK0J0ch3g",
  authDomain: "project-tracker-nti.firebaseapp.com",
  databaseURL: "https://project-tracker-nti-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project-tracker-nti",
  storageBucket: "project-tracker-nti.appspot.com",
  messagingSenderId: "40830624695",
  appId: "1:40830624695:web:2fa51b5fcf66950736be32",
  measurementId: "G-92PM70NW8T"
};
// const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// })
const app = firebase.initializeApp(firebaseConfig)
const firestore = app.firestore()
export const database = {
  projects: firestore.collection("projects"),
  users: firestore.collection("users"),
  formatDoc: doc => {
    return { key: doc.id, ...doc.data() }
  },
  getCurrentTimestamp: firebase.firestore.FieldValue.serverTimestamp,
}
export const storage = app.storage()

export const auth = app.auth()
export default app