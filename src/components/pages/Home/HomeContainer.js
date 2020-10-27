import React, { useState, useEffect, useMemo, useReducer } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import './HomeContainer.css';
import { reducer, initialState } from '../../../state/reducers/index';

import RenderHomePage from './RenderHomePage';

const HomeContainer = ({ LoadingComponent }) => {
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [memoAuthService] = useMemo(() => [authService], []);

  useEffect(() => {
    let isSubscribed = true;

    memoAuthService
      .getUser()
      .then(info => {
        // if user is authenticated we can use the authService to snag some user info.
        // isSubscribed is a boolean toggle that we're using to clean up our useEffect.
        if (isSubscribed) {
          setUserInfo(info);
        }
      })
      .catch(err => {
        isSubscribed = false;
        return setUserInfo(null);
      });
    return () => (isSubscribed = false);
  }, [memoAuthService]);

  return (
    <div className="AppContainer">
      {authState.isAuthenticated && !userInfo && (
        <LoadingComponent message="Fetching user profile..." />
      )}
      {authState.isAuthenticated && userInfo && (
        <RenderHomePage
          userInfo={userInfo}
          authService={authService}
          authState={authState}
        />
      )}
    </div>
  );
};

export default HomeContainer;
