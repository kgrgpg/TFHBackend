import * as AWS from 'aws-sdk';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


AWS.config.update({ region: 'eu-central-1' });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'MerkleTreeNodes';

// DynamoTreeNode interface
export interface DynamoTreeNode {
    index: number;
    leftIndex: number | null;  // Index of the left child
    rightIndex: number | null; // Index of the right child
    hash: string;
    data: string | null;             // Data of the node (only for leaf nodes)
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

// Retrieve the node
getNode(1).subscribe(node => {
    if (node) {
        console.log('Reading from DynamoDb');
        console.log(node);
    }
});
