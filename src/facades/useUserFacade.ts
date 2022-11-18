import useUsersStore, {UserState} from '../store/useUserStore';

import shallow from 'zustand/shallow';

// SHALLOW

// Object pick, re-renders the component when either state.nuts or state.honey change
// const { nuts, honey } = useStore(
//   (state) => ({ nuts: state.nuts, honey: state.honey }),
//   shallow
// )

// Array pick, re-renders the component when either state.nuts or state.honey change
// const [nuts, honey] = useStore((state) => [state.nuts, state.honey], shallow)

// Mapped picks, re-renders the component when state.treats changes in order, count or keys
// const treats = useStore((state) => Object.keys(state.treats), shallow)

const useUserFacade = () => {
  const {user, loading, error, setUser, fetchUser, addUser} = useUsersStore(
    (state: UserState) => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
      setUser: state.setUser,
      fetchUser: state.fetchUser,
      addUser: state.addUser,
    }),
    shallow,
  );

  return {user, loading, error, setUser, fetchUser, addUser};
};

export default useUserFacade;
