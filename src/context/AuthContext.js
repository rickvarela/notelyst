import { createContext, useState, useContext } from 'react';

const apiDomain = (path) => {
  const production = process.env.NODE_ENV === 'production';
  return production ? 'https://api.rickvarela.com' + path : path;
};

const Context = createContext();

export const Provider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoaded: false,
    authUser: null,
  });

  const checkAuth = () => {
    fetch(apiDomain('/api/checkAuth'))
      .then((res) => res.json())
      .then((data) => {
        if (data.authUser) {
          setAuthState({
            isLoaded: true,
            authUser: data.authUser,
          });
        } else {
          setAuthState({
            isLoaded: true,
            authUser: null,
          });
        }
      });
  };

  const login = (user, cb) => {
    fetch(apiDomain('/api/auth'), {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      cb();
    });
  };

  const signUp = (user, cb) => {
    fetch(apiDomain('/api/signup'), {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      cb();
    });
  };

  const signOut = () => {
    fetch(apiDomain('/api/delete'), {
      method: 'POST',
      credentials: 'include',
    }).then(() => {
      setAuthState((prevState) => ({
        ...prevState,
        authUser: null,
      }));
    });
  };

  const value = {
    authState,
    actions: {
      checkAuth,
      login,
      signUp,
      signOut,
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useAuth = () => useContext(Context);
