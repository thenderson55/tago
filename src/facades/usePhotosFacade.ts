import usePhotosStore, {PhotoState} from '../store/usePhotosStore';
import shallow from 'zustand/shallow';

const usePhotosFacade = () => {
  const {
    photo,
    loading,
    upLoading,
    transferProgress,
    error,
    fetchPhotos,
    fetchPhoto,
    addPhoto,
    editPhoto,
    deletePhoto,
  } = usePhotosStore(
    (state: PhotoState) => ({
      photo: state.photos,
      loading: state.loading,
      upLoading: state.upLoading,
      transferProgress: state.transferProgress,
      error: state.error,
      fetchPhotos: state.fetchPhotos,
      fetchPhoto: state.fetchPhoto,
      addPhoto: state.addPhoto,
      editPhoto: state.editPhoto,
      deletePhoto: state.deletePhoto,
    }),
    shallow,
  );

  return {
    photo,
    loading,
    upLoading,
    transferProgress,
    error,
    fetchPhotos,
    fetchPhoto,
    addPhoto,
    editPhoto,
    deletePhoto,
  };
};

export default usePhotosFacade;
