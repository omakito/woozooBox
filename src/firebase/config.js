// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBoUJE4rKj7333YgOQRrt7clj_ZFEjhrKw',
  authDomain: 'woozoobox-6a1fc.firebaseapp.com',
  projectId: 'woozoobox-6a1fc',
  storageBucket: 'woozoobox-6a1fc.appspot.com',
  messagingSenderId: '260195267467',
  appId: '1:260195267467:web:f6af56566466e72111f58e',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
