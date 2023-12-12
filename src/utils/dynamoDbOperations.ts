import * as AWS from 'aws-sdk';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/*
 * Since CDK is used to provision the infrastructure, you don't need to include AWS configuration 
 * (AWS.config.update) in this part of your application. AWS SDK will automatically use the configuration 
 * and credentials defined by the CDK environment.
 */

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'MerkleTreeNodes';

// DynamoTreeNode interface
export interface DynamoTreeNode {
    index: number;
    leftIndex: number | null;  // Index of the left child
    rightIndex: number | null; // Index of the right child
    hash: string;
}

// Function to save a node, returning an observable
export function saveNode(node: DynamoTreeNode): Observable<void> {
    const params = {
        TableName: TABLE_NAME,
        Item: node,
    };

    return from(dynamoDb.put(params).promise()).pipe(
        map(() => console.log(`Node saved: ${node.index}`)),
        catchError(error => {
            console.error('Error saving node:', error);
            throw error;
        })
    );
}

// Function to retrieve a node by index, returning an observable
export function getNode(index: number): Observable<DynamoTreeNode | null> {
    const params = {
        TableName: TABLE_NAME,
        Key: { index },
    };

    return from(dynamoDb.get(params).promise()).pipe(
        map(result => result.Item as DynamoTreeNode),
        catchError(error => {
            console.error('Error retrieving node:', error);
            return [null]; // or throw error
        })
    );
}

// Example usage
const exampleNode: DynamoTreeNode = {
    index: 1,
    leftIndex: 0,
    rightIndex: 2,
    hash: 'some-hash-value'
};

// Save the node
saveNode(exampleNode).subscribe();

// Retrieve the node
getNode(1).subscribe(node => {
    if (node) {
        console.log(node);
    }
});
