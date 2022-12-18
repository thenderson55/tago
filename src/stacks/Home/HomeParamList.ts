import {PhotoType} from '../../store/usePhotosStore';

export type HomeParamList = {
  Home: undefined;
  Graph: undefined;
  Settings: undefined;
  Map?: {newPhoto?: PhotoType};
};
