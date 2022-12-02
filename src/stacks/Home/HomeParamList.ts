import {PhotoType} from '../../store/usePhotosStore';

export type HomeParamList = {
  Home: undefined;
  Graph: undefined;
  Map: {newPhoto?: PhotoType};
};
