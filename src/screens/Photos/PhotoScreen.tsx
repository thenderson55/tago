import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import Moment from 'react-moment';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalEditPhoto from '../../components/Modals/ModalEditPhoto';
import {PhotosParamList} from '../../stacks/Photos/PhotosParamList';
// import {PhotoType} from '../../store/usePhotosStore';
import theme from '../../theme';

// type Props = {
//   item: PhotoType;
// };

function PhotoScreen() {
  const route: RouteProp<PhotosParamList, 'Photo'> = useRoute();
  const {item} = route.params;
  // Need to do this to trigger the rerneder from the update modal and formik
  const [currentPhoto, setCurrentPhoto] = useState(item);
  const [modalEditPhoto, setModalEditPhoto] = useState(false);
  const modalEditPhotoClose = () => {
    // clearErrors();
    setModalEditPhoto(false);
  };
  const modalEditPhotoOpen = () => {
    // clearErrors();
    setModalEditPhoto(true);
  };

  return (
    <View style={styles.container}>
      {currentPhoto && (
        <ScrollView contentContainerStyle={styles.scroll}>
          <ModalEditPhoto
            photo={currentPhoto}
            modalBool={modalEditPhoto}
            modalClose={modalEditPhotoClose}
            setCurrentPhoto={setCurrentPhoto}
          />
          <View>
            <FastImage
              style={styles.image}
              source={{
                uri: currentPhoto.url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Category: {currentPhoto.category}</Text>
            {currentPhoto.title && (
              <Text style={styles.text}>Title: {currentPhoto.title}</Text>
            )}

            {currentPhoto.description && (
              <Text style={styles.text}>
                Description: {currentPhoto.description}
              </Text>
            )}
            <View style={styles.dateWrapper}>
              <Text style={styles.text}>Created: </Text>
              <Moment
                unix
                style={styles.text}
                element={Text}
                date={currentPhoto.created}
                format="DD/MM/YYYY"
              />
            </View>
          </View>
          <View style={styles.editButton}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => modalEditPhotoOpen()}>
              <Ionicons
                name={'create-outline'}
                size={50}
                color={theme.colors.black}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.white,
    // paddingBottom: 50,
  },
  image: {
    width: '100%',
    height: (Dimensions.get('window').height / 10) * 4,
    overflow: 'hidden',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  text: {
    color: theme.colors.black,
    fontSize: theme.fontSizes.medium,
    marginBottom: 10,
  },
  dateWrapper: {
    flexDirection: 'row',
  },
  editButton: {
    position: 'absolute',
    bottom: '7%',
    right: '7%',
  },
});

export default PhotoScreen;
