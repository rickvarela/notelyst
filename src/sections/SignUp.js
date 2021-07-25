import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

import { SiteHeader } from '../components/SiteHeader';
import { $Form } from '../components/$Form';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const $SignUp = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const SignUp = () => {
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
  });
  const history = useHistory();
  const { actions } = useAuth();

  const handelInputChange = (event) => {
    const { value, name } = event.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handelSubmit = (event) => {
    event.preventDefault();
    actions.signUp(input, () => {
      history.push('/');
    });
  };

  return (
    <$SignUp>
      <SiteHeader />
      <$Form onSubmit={handelSubmit}>
        <h2>Create a new account</h2>
        <label>UserName</label>
        <input
          type='text'
          name='username'
          placeholder='Enter Username'
          value={input.username}
          onChange={handelInputChange}
          required
        />
        <label>Email</label>
        <input
          type='text'
          name='email'
          placeholder='Enter Email'
          value={input.email}
          onChange={handelInputChange}
          required
        />
        <label>Password</label>
        <input
          type='text'
          name='password'
          placeholder='Enter Password'
          value={input.password}
          onChange={handelInputChange}
          required
        />
        <input type='submit' />
      </$Form>
    </$SignUp>
  );
};
