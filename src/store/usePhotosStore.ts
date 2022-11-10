import create from 'zustand';

export type PhotoType = {
  id: number;
  title: string;
  location: number[];
  // TODO: Why below won't work?
  // location: [number, number];
  description: string;
  category: string;
  date: Date;
};

export interface PhotoState {
  photos: PhotoType[];
  loading: boolean;
  error: string;
  fetchPhotos: () => void;
  fetchPhoto: (id: number) => void;
  addPhoto: (input: PhotoType) => void;
  editPhoto: (input: PhotoType) => void;
  deletePhoto: (id: number) => void;
}

const initialState = {
  photos: [
    {
      id: 0,
      title: '',
      location: [1, 2],
      description: '',
      category: '',
      date: new Date(),
    },
  ],
  loading: false,
  error: '',
};

const usePhotosStore = create<PhotoState>(set => ({
  photos: initialState.photos,
  loading: initialState.loading,
  error: initialState.error,

  fetchPhotos: async () => {
    set(state => ({...state, loading: true}));
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      set(state => ({...state, photos: [...state.photos, res]}));
    } catch (error: any) {
      set(state => ({
        ...state,
        error: error.message,
      }));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  fetchPhoto: async id => {
    set(state => ({...state, loading: true}));
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/${id}`);
      const users = await res.json();
      set((state: PhotoState) => ({...state, error: '', users}));
    } catch (error: any) {
      set(state => ({
        ...state,
        error: error.message,
      }));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  addPhoto: async input => {
    set(state => ({...state, loading: true}));
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/${input}`);
      const users = await res.json();
      set(state => ({
        ...state,
        error: '',
        photos: [...state.photos, users],
      }));
    } catch (error: any) {
      set(state => ({
        ...state,
        error: error.message,
      }));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  editPhoto: async input => {
    set(state => ({...state, loading: true}));
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/${input}`);
      const users = await res.json();
      set(state => ({...state, error: '', users}));
    } catch (error: any) {
      set(state => ({
        ...state,
        error: error.message,
      }));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },

  deletePhoto: async id => {
    set(state => ({...state, loading: true}));
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/${id}`);
      const users = await res.json();
      set(state => ({...state, error: '', users}));
    } catch (error: any) {
      set(state => ({
        ...state,
        error: error.message,
      }));
    } finally {
      set(state => ({
        ...state,
        loading: false,
      }));
    }
  },
}));

export default usePhotosStore;
