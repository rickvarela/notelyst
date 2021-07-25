import { createContext, useState, useContext } from 'react';

const Context = createContext();

export const Provider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoaded: false,
    authUser: null,
  });

  const checkAuth = () => {
    fetch('/api/checkAuth')
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
    fetch('api/auth', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      cb();
    });
  };

  const signUp = (user, cb) => {
    fetch('/api/signup', {
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
    fetch('/api/delete', {
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
