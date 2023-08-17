import { useRouter } from 'next/router';

import React, { useEffect, useRef } from 'react';
import keycloak from '@/common/config/keycloak';
import { setCredentials, useLoginMutation } from '@/modules/auth/auth';
import { OAuthParams } from '@/modules/auth/interface';
import { Loading } from '../components/Loading';
import { parseQuery } from '../utils/misc';
import { useDispatch } from 'react-redux';

export interface AuthContextValue {
  signInWithKeyCloak: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);
AuthContext.displayName = 'AuthContext';

export interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const oauthRef = useRef<OAuthParams | null>(null);
  const currentUrl = window.location.href;
  const isLoginPage = router.pathname === '/';

  const signInWithKeyCloak = () => {
    keycloak.init({
      onLoad: 'login-required',
      redirectUri: currentUrl,
      checkLoginIframe: false,
    });
  };

  useEffect(() => {
    const asPath = router.asPath;
    const [_, hash] = asPath.split('#');
    if (!oauthRef.current && isLoginPage && hash) {
      const params = parseQuery(hash) as OAuthParams;
      oauthRef.current = params;
      login(params)
        .unwrap()
        .then((payload) => {
          dispatch(
            setCredentials({
              permissions: payload.permissions,
              accessToken: payload.access_token,
              refreshToken: payload.refresh_token,
            })
          );

          router.push('/home');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        signInWithKeyCloak,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error(`useAuth must be used within an AuthProvider`);
  }
  return context;
};