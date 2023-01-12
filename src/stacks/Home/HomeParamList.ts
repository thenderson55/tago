import {PhotoType} from '../../store/usePhotosStore';

export type HomeParamList = {
  Home: undefined;
  Graph: undefined;
  Account: undefined;
  Privacy: undefined;
  Support: undefined;
  Map?: {newPhoto?: PhotoType};
};
