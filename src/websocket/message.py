import json
import boto3
import os

def handler(event, context):
  body = json.loads(event['body'])

  receivers = body.get('receivers', None)
  message = body.get('message', None)
  sender = body.get('sender', None)
  if receivers and message and sender:

    endpoint_api = os.getenv('WEBSOCKET_ADDRESS')   
    apigateway_client = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint_api)

    
    for receiver in receivers:
      apigateway_client.post_to_connection(ConnectionId=receiver['connectionId'], Data=json.dumps({'action': 'message', 'sender': sender, 'receiver': receiver, 'message': message}))
    
    return {
      'statusCode': 200,
      'body': json.dumps('Message sent successfully')
    }
  return {
    'statusCode': 400,
    'body': json.dumps('Receiver, sender and message are mandatory fields')
  }