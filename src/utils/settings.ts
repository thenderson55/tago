import firestore from '@react-native-firebase/firestore';

export const timeStamp = () => firestore.Timestamp.now().seconds;

export const categoryValues = {
  default: 'Want To Go',
  addNew: '+ Add New Category',
};
