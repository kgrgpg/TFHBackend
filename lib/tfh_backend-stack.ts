import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class TfhBackendStack extends cdk.Stack {
  public readonly CDKMerkleTreeTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    console.log('Creating DynamoDB table for Merkle Tree Nodes...');
    // Define the DynamoDB table for Merkle Tree Nodes
    this.CDKMerkleTreeTable = new dynamodb.Table(this, 'CDKMerkleTreeTable', {
      partitionKey: { name: 'index', type: dynamodb.AttributeType.NUMBER },
      tableName: 'MerkleTreeNodes',
      // other configurations like billing mode, encryption, etc.
    });
    console.log('DynamoDB table for Merkle Tree Nodes created.');
  }
}
