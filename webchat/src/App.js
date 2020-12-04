import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TextField, Button } from '@material-ui/core';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: localStorage.getItem('username') || ""
    };
  }

  setUsername(username) {
    localStorage.setItem('username', username);
    this.setState(state => ({username: username}));
  }

  renderChat() {

  }

  renderInitialPage()  {
    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Serverless Webchat
        </p>
        <div>
          <TextField id="username" label="Apelido" variant="outlined"></TextField>
          <Button variant="conained">Entrar</Button>
        </div>
      </header>
    </div>
    );
  }

  render() {
    if (this.state.username) {
      return this.renderChat();
    } else {
      return this.renderInitialPage();
    }
  }
  
}

export default App;
