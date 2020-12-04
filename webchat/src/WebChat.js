import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Container, Grid, TextareaAutosize, TextField, Button, Icon } from '@material-ui/core';
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
      let messages = state.messages
      if (!messages) {
        messages = `${data.sender}: ${data.message}`;
      } else {
        messages += `\n${data.sender}: ${data.message}`;
      }
      return {message: state.message, messages: messages}
    });
  }

  sendMessage(text) {
    this.setState(state => ({message: "", messages: state.messages}));
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
            <TextareaAutosize styles={{width: "100%"}} value={this.state.messages} rowsMin={20} rowsMax={20} id="messages"></TextareaAutosize>
          </Grid>
          <Grid item xs={9}>
            <TextField styles={{width: "100%"}} value={this.state.message} onChange={event => this.onWriteMessage(event)} id="text" placeholder="Digite sua mensagem aqui..." variant="outlined"></TextField>
          </Grid>
          <Grid item xs={3}>
            <Button onClick={() => this.sendMessage(this.state.message)} endIcon={<Icon>send</Icon>} variant="contained" color="primary"></Button>
          </Grid>
        </Grid>
      </Container>
    );
  }

}

export default WebChat;