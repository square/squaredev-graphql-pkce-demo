import React, {createContext, useReducer, useContext, ReactNode} from 'react';

type LoginState = {
  isLoading: boolean;
  isSignout: boolean;
  userToken: string | null;
};

type LoginAction = {
  type: 'RESTORE_TOKEN' | 'SIGN_IN' | 'SIGN_OUT';
  token: string | null;
};

type LoginContextType = {
  state: LoginState;
  dispatch: React.Dispatch<LoginAction>;
};

const LoginContext = createContext<LoginContextType>({
  state: {
    isLoading: true,
    isSignout: false,
    userToken: null,
  },
  dispatch: () => null,
});

const loginReducer = (state: LoginState, action: LoginAction): LoginState => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        userToken: action.token,
      };

    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        userToken: null,
      };
  }
};

const LoginProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [state, dispatch] = useReducer(loginReducer, {
    isLoading: true,
    isSignout: false,
    userToken: null,
  });
  return (
    <LoginContext.Provider value={{state, dispatch}}>
      {children}
    </LoginContext.Provider>
  );
};

const useLogin = () => {
  const {state, dispatch} = useContext(LoginContext);
  return {state, dispatch};
};

export {LoginProvider, useLogin};
