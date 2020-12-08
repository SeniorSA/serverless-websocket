import React from 'react';
import logo from './logo.png';
import senior from './senior.png'
import github from './github.png';
import './App.css';
import { TextField, Button, Container, Grid } from '@material-ui/core';
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
        <Container maxWidth="sm">
          <Grid container spacing={3}>
            <Grid item xs={9}>
              <TextField fullWidth size="small" value={this.state.userName} onChange={evt => this.updateValue(evt)} id="userName" label="Apelido" ></TextField>  
            </Grid>
            <Grid item xs={3}>
              <Button size="large" onClick={() => this.login()} color="primary" variant="outlined">Entrar</Button>
            </Grid>
            <Grid item xs={12}>
              <a href="https://github.com/SeniorSA/serverless-websocket"><img className="icons" src={github}/></a>
              <a href="https://senior.com.br"><img className="icons" src={senior}/></a>
            </Grid>
          </Grid>
        </Container>
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
