import json
import boto3
import os

def handler(event, context):
  client = boto3.client('dynamodb')
  client.put_item(
    TableName=os.getenv('TABLE_NAME'),
    Item={
      'connectionId': {
        'S': event['requestContext'].get('connectionId')
      },
      'userName': {
        'S': 'undefined'
      }})
  return {
    'statusCode': 200,
    'body': json.dumps('Connected to the server!')
  }