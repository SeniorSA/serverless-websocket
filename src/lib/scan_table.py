import json
import boto3

def scan(table_name):
  dynamodb = boto3.resource('dynamodb')
  connections = dynamodb.Table(table_name)
  done = False
  start_key = None
  scan_kwargs = {}
  connections_list = []

  while not done:
    if start_key:
      scan_kwargs['ExclusiveStartKey'] = start_key
    response  = connections.scan(**scan_kwargs)
    connections_list += response.get('Items', [])
    start_key = response.get('LastEvaluatedKey', None)
    done = start_key is None

  return connections_list