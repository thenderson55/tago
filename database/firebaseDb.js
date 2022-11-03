import * as firebase from 'firebase';

// Is this needed if using @react-native-firebase/firestore??
// Can get some infor from prject settings tabs

const firebaseConfig = {
  apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  authDomain: 'reactnativefirebase-00000.firebaseapp.com',
  databaseURL: 'https://reactnativefirebase-00000.firebaseio.com',
  projectId: 'reactnativefirebase-00000',
  storageBucket: 'reactnativefirebase-00000.appspot.com',
  messagingSenderId: '000000000000000',
  appId: '1:000000000000000:web:000000000000000',
};
firebase.initializeApp(firebaseConfig);
firebase.firestore();
export default firebase;
