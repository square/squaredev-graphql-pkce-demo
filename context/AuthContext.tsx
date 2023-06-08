import React, {useContext, useState} from 'react';

interface IAuthContext {
  hasToken: boolean;
  setHasToken: (hasToken: boolean) => void;
}

const defaultContext: IAuthContext = {
  hasToken: false,
  setHasToken: () => {},
};

export const useIsAuthed = () => {
  const {hasToken, setHasToken} = useContext(AuthContext);
  return {hasToken, setHasToken};
};

export const AuthContext = React.createContext(defaultContext);

export default function AuthProvider({children}: {children: React.ReactNode}) {
  const [hasToken, setHasToken] = useState<boolean>(false);
  return (
    <AuthContext.Provider value={{hasToken, setHasToken}}>
      {children}
    </AuthContext.Provider>
  );
}
