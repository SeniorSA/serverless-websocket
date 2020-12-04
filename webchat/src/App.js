import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TextField, Button } from '@material-ui/core';
import WebChat from "./WebChat";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      login: false
    };
  }

  login() {
    this.setState(state => ({userName: state.userName, login: true}));
  }

  renderChat() {
    return <WebChat
    userName={this.state.userName}
    ></WebChat>
  }

  updateValue(event) {
    this.setState(state => ({
      userName: event.target.value, login: state.login
    }));
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
          <TextField value={this.state.userName} onChange={evt => this.updateValue(evt)} id="userName" label="Apelido" variant="outlined"></TextField>
          <Button onClick={() => this.login()} variant="contained">Entrar</Button>
        </div>
      </header>
    </div>
    );
  }

  render() {
    if (this.state.login) {
      return this.renderChat();
    } else {
      return this.renderInitialPage();
    }
  }
  
}

export default App;
