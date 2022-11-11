import firestore from '@react-native-firebase/firestore';

export const timeStamp = firestore.Timestamp.now().seconds;
