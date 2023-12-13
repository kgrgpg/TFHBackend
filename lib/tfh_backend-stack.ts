import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class TfhBackendStack extends cdk.Stack {
  public readonly CDKMerkleTreeTable: dynamodb.Table;
  public readonly merkleTreeLambda: lambda.Function;

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

    console.log('Creating retrieveNodeLambda');
    // Lambda Function
    this.merkleTreeLambda = new lambda.Function(this, 'MerkleTreeLambda', {
      functionName: 'MerkleTreeLambdaFunction',
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'retrieveNodeLambda.handler', 
      code: lambda.Code.fromAsset('./dist'), 
      environment: {
        TABLE_NAME: this.CDKMerkleTreeTable.tableName,
      },
      timeout: cdk.Duration.seconds(10),
    });
    console.log('retrieveNodeLambda Created');

    // Grant the Lambda function read access to the DynamoDB table
    this.CDKMerkleTreeTable.grantReadData(this.merkleTreeLambda);

  }
}
