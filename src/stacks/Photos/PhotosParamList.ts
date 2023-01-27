import {PhotoType} from '../../store/usePhotosStore';

export type PhotosParamList = {
  Photo: {item: PhotoType};
  Map: {photo: PhotoType};
  PhotosList: undefined;
};
