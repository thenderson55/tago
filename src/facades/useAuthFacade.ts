import useAuthStore, {AuthState} from '../store/useAuthStore';
import shallow from 'zustand/shallow';

const useAuthFacade = () => {
  const {loading, error, emailLogin, emailSignUp, onGoogleButtonPress} =
    useAuthStore(
      (state: AuthState) => ({
        loading: state.loading,
        error: state.error,
        emailLogin: state.emailLogin,
        emailSignUp: state.emailSignUp,
        onGoogleButtonPress: state.onGoogleButtonPress,
      }),
      shallow,
    );

  return {
    loading,
    error,
    emailLogin,
    emailSignUp,
    onGoogleButtonPress,
  };
};

export default useAuthFacade;
