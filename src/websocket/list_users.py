import json
import boto3
import os
from lib.scan_table import scan

def handler(event, context):
  # Get the connection Id from the user
  connectionId=event['requestContext'].get('connectionId')

  # Get the list of users connected
  connections_list = scan(os.getenv('TABLE_NAME'))

  # Filter the users connected, removing the requester
  connections_filtered = list(filter(lambda item: (item['connectionId'] != connectionId), connections_list))
  
  users_list = list(map(lambda item: ({'userName': item['userName'], 'connectionId': item['connectionId']}), connections_filtered))

  output = {'action': 'list', 'users': users_list}

  # Returns the users connected
  return {
    'statusCode': 200,
    'body': json.dumps(output)
  }
