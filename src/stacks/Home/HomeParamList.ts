import {PhotoType} from '../../store/usePhotosStore';

export type HomeParamList = {
  Home: undefined;
  Graph: undefined;
  Account: undefined;
  Map?: {newPhoto?: PhotoType};
};
