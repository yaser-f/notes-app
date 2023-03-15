import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api, { User } from '../data-access';

interface AuthContextType {
  user: User;
  refetch: () => any;
}

let AuthContext = React.createContext<AuthContextType>(null!);

export function useAuth() {
  return React.useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, refetch } = useQuery(['user', 'me'], api.getCurrentUser);

  return (
    <AuthContext.Provider
      value={{
        user: data?.user,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
}
export function RequireNoAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (auth.user) {
    return <Navigate to='/notes' state={{ from: location }} replace />;
  }

  return children;
}
