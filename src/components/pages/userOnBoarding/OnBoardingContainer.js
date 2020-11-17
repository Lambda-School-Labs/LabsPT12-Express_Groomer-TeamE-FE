import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  updateUser,
  fetchLoggedInUser,
  createBusiness,
} from '../../../state/actions';

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

  const [role, setRole] = useState({
    role: 'new',
  });

  useEffect(() => {
    props.fetchLoggedInUser(UserInfo, AuthState);
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
      const businessData = {
        user_id: props.loggedInUserData.id,
        name: '',
        banner_photo: '',
        address: '',
        ratings: '',
        description: '',
        phone: '',
        availability: '',
      };
      props.updateUser(updatedUserProfile, AuthState);
      if (role.role === 'client') {
        return history.push('/onboardingClient');
      } else if (role.role === 'groomer') {
        props.createBusiness(businessData, AuthState);
        return history.push(`/onboardingGroomer/${props.loggedInUserData.id}`);
      }
    }
    const updatedUserProfile = {
      ...props.loggedInUserData,
      role: 'new',
    };
    props.updateUser(updatedUserProfile, AuthState);
    return history.push('/');
  };
  return (
    <div>
      <h1>Welcome To Express Groomer!</h1>
      <h2>Let's Get Started</h2>

      <div>
        <form onSubmit={onSubmit}>
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
    loggedInUserBusinesses: state.loggedInUserBusinesses,
  };
};

export default connect(mapStateToProps, {
  updateUser,
  fetchLoggedInUser,
  createBusiness,
})(OnBoardingContainer);
