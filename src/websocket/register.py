import json
import boto3
import os
from lib.scan_table import scan

def handler(event, context):
  connectionId=event['requestContext'].get('connectionId')

  body = json.loads(event['body'])

  if 'userName' in body:
    userName = body['userName']
    client = boto3.client('dynamodb')
    client.update_item(
      TableName=os.getenv('TABLE_NAME'),
      Key={'connectionId': {'S': connectionId}},
      UpdateExpression='SET userName = :userName',
      ExpressionAttributeValues={
        ':userName': {
          'S': userName
        }
      })

    endpoint_api = os.getenv('WEBSOCKET_ADDRESS')   
    apigateway_client = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint_api)

    connections_list = scan(os.getenv('TABLE_NAME'))

    for connection in connections_list:
      if (connection['connectionId'] != connectionId):
        apigateway_client.post_to_connection(ConnectionId=connection['connectionId'], Data=json.dumps({'action': 'newUser', 'userName': userName, 'connectionId': connectionId}))

    return {
      'statusCode': 200,
      'body': json.dumps('Successfully registered')
    }
  return {
    'statusCode': 400,
    'body': json.dumps('User name not found')
  }