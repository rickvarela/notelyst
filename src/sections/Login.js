import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

import { SiteHeader } from '../components/SiteHeader';
import { $Form } from '../components/$Form';

const $Login = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Login = () => {
  const history = useHistory();
  const [input, setInput] = useState({
    username: '',
    password: '',
  });
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
    actions.login(input, () => {
      history.push('/');
    });
  };
  return (
    <$Login>
      <SiteHeader />
      <$Form onSubmit={handelSubmit}>
        <h2>Login</h2>
        <label>UserName</label>
        <input
          type='text'
          name='username'
          placeholder='Enter Username'
          value={input.username}
          onChange={handelInputChange}
          required
        />
        <label>Password</label>
        <input
          type='password'
          name='password'
          placeholder='Enter Username'
          value={input.password}
          onChange={handelInputChange}
          required
        />
        <input type='submit' value='submit' />
      </$Form>
    </$Login>
  );
};
