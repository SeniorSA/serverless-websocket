import json
import boto3
import os
from lib.scan_table import scan

def handler(event, context):
  connectionId=event['requestContext'].get('connectionId')

  connections_list = scan(os.getenv('TABLE_NAME'))

  connections_filtered = list(filter(lambda item: (item['connectionId'] != connectionId), connections_list))
  
  users_list = list(map(lambda item: ({'userName': item['userName'], 'connectionId': item['connectionId']}), connections_filtered))

  output = {'action': 'list', 'users': users_list}

  return {
    'statusCode': 200,
    'body': json.dumps(output)
  }
