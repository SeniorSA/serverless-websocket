import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Container, Grid, Typography, TextField, Button } from '@material-ui/core';
import { config } from './config';

let client = null;

class WebChat extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: "",
      messages: ""
    }
    this.usersList = [];
    this.actions = {
      message: this.onMessage.bind(this),
      newUser: this.onNewUser.bind(this),
      userExit: this.onUserExit.bind(this),
      list: this.onList.bind(this)
    };
  }

  connect() {
    client = new W3CWebSocket(config.websocketAddress);
    client.onopen = () => {
      console.log('Connected to Websocket');
      client.send(JSON.stringify({action: 'register', userName: this.props.userName}));      
      client.send(JSON.stringify({action: 'list'}));
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.action) {
        this.actions[data.action](data);
      }
    };
    client.onclose = (() => this.connect());
  }

  onMessage(data) {
    this.setState(state => {
      let messages = "";
      if (!state.messages) {
        messages = `${data.sender}: ${data.message}`;
      } else {
        messages = state.messages + `\n${data.sender}: ${data.message}`;
      }
      return {message: state.message, messages: messages};
    });
  }

  sendMessage(text) {
    this.setState(state => {
      let messages = "";
      if (!state.messages) {
        messages = `Você: ${text}`;
      } else {
        messages = state.messages + `\nVocê: ${text}`;
      }
      return {message: "", messages: messages};
    });
    client.send(JSON.stringify({
      action: 'message', 
      sender: this.props.userName,
      receivers: this.usersList,
      message: text
    }));
  }

  onNewUser(data) {
    if (this.usersList) {
      this.usersList.push({'userName': data.userName, 'connectionId': data.connectionId});
    }
  }

  onUserExit(data) {
    if (this.usersList) {
      this.usersList = this.usersList.filter(item => data.userName !== item.userName);
    }
  }

  onList(data) {
    this.usersList = data.users;
  }

  componentDidMount() {
    this.connect();
  }

  onWriteMessage(event) {
    this.setState(state => ({message: event.target.value, messages: state.messages}));
  }

  render() {
    return (
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography align="center" variant="body1">
              Você está online como {this.props.userName}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField autoFocus={false} multiline variant="outlined" fullWidth value={this.state.messages} rows={20} rowsMax={20} id="messages"></TextField>
          </Grid>
          <Grid item xs={10}>
            <TextField fullWidth autoFocus={true} value={this.state.message} onChange={event => this.onWriteMessage(event)} id="text" placeholder="Digite sua mensagem aqui..." variant="outlined"></TextField>
          </Grid>
          <Grid item xs={2}>
            <Button fullWidth size="large" disableElevation onClick={() => this.sendMessage(this.state.message)} variant="contained" color="primary">Enviar</Button>
          </Grid>
        </Grid>
      </Container>
    );
  }

}

export default WebChat;