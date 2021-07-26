import styled from 'styled-components';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';


import { NoteLystApp } from './sections/NoteLystApp';
import { SignUp } from './sections/SignUp';
import { Login } from './sections/Login';

const $App = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  font-family: 'Nunito', sans-serif;
`;

function App() {
  return (
    <$App>
      <Router>
        <Switch>
          <Route path='/' exact>
            <NoteLystApp />
          </Route>
          <Route path='/signup'>
            <SignUp />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
        </Switch>
      </Router>
    </$App>
  );
}

export default App;
