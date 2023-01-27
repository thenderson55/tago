import {PhotoType} from '../../store/usePhotosStore';

export type HomeParamList = {
  Home: undefined;
  Graph: undefined;
  Privacy: undefined;
  Support: undefined;
  Map?: {newPhoto?: boolean; photo?: PhotoType};
};
