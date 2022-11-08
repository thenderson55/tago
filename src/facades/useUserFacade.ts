import useUsersStore from '../store/useUserStore';

import shallow from 'zustand/shallow';

const useUserFacade = () => {
  const {user, loading, error, fetchUser, emailLogin} = useUsersStore(
    state => ({
      user: state.user,
      loading: state.loading,
      error: state.error,
      fetchUser: state.fetchUser,
      emailLogin: state.emailLogin,
    }),
    shallow,
  );

  return {user, loading, error, fetchUser, emailLogin};
};

export default useUserFacade;
