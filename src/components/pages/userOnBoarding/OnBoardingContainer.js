import React, { useState } from 'react';
<<<<<<< HEAD
import GroomerProfile from '../componentProgress/GroomerProfile';

=======
import { useEffect } from 'react';
import { connect } from 'react-redux';
>>>>>>> 9856b961907e02fbfc031b5306282bc50563f81e
import { useHistory } from 'react-router-dom';
import { updateUser, fetchLoggedInUser } from '../../../state/actions';

<<<<<<< HEAD

const OnBoardingContainer = () => {
  let history = useHistory();
=======
const OnBoardingContainer = props => {
  let windowAuthState = window.localStorage.getItem('okta-token-storage');
  let AuthInfo = JSON.parse(windowAuthState);

  const AuthState = {
    accessToken: AuthInfo.accessToken.accessToken,
    idToken: AuthInfo.idToken.idToken,
  };

  const UserInfo = {
    sub: AuthInfo.idToken.claims.sub,
  };
>>>>>>> 9856b961907e02fbfc031b5306282bc50563f81e

  const [role, setRole] = useState({
    role: 'new',
  });

  useEffect(() => {
    if (props.userInfo && props.authState) {
      props.fetchLoggedInUser(props.userInfo, props.authState);
    } else if (!props.userInfo && !props.authState) {
      props.fetchLoggedInUser(UserInfo, AuthState);
    }
  }, []);

  let history = useHistory();

  const handleChange = e => {
    const formData = {
      ...role,
      [e.target.name]: e.target.value,
    };
    setRole(formData);
  };

  const onSubmit = e => {
    e.preventDefault();
    if (role.role === 'client' || 'groomer') {
      const updatedUserProfile = {
        ...props.loggedInUserData,
        role: role.role,
      };
      props.updateUser(updatedUserProfile, props.authState);
      if (role.role === 'client') {
        return history.push('/onboardingClient');
      } else if (role.role === 'groomer') {
        return history.push('/onboardingGroomer');
      }
    }
    const updatedUserProfile = {
      ...props.loggedInUserData,
      role: 'new',
    };
    props.updateUser(updatedUserProfile, props.authState);
    return history.push('/');
  };

  return (
    <div>
      <h1>Welcome To Express Groomer!</h1>
      <h2>Let's Get Started</h2>

      <GroomerProfile/>

      <div>
        <form onSubmit={onSubmit}>
          <label>
            <select
              placeholder="role"
              type="text"
              name="role"
              value={role.role}
              onChange={handleChange}
            >
              <option value="new">Choose Account Type</option>
              <option value="groomer">Groomer</option>
              <option value="client">Client</option>
            </select>
          </label>
        </form>
        <button onClick={onSubmit}>Continue</button>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    handle_role: state.handle_role,
    loggedInUserData: state.loggedInUserData,
    authState: state.authState,
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps, {
  updateUser,
  fetchLoggedInUser,
})(OnBoardingContainer);
