import * as AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk';
import { debug } from 'console';
import { from, Observable } from 'rxjs';
import { catchError, map, switchMap, toArray } from 'rxjs/operators';


AWS.config.update({ region: 'eu-central-1' }); // Configure AWS SDK

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'MerkleTreeNodes'; // DynamoDB table name

// DynamoTreeNode interface
export interface DynamoTreeNode {
    index: number;
    leftIndex: number | null;  // Index of the left child
    rightIndex: number | null; // Index of the right child
    hash: string;
    data: string | null; // Data of the node (only for leaf nodes)
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

// Function to list all items in the table and return an observable
export function listAllItems(): Observable<DynamoDB.DocumentClient.AttributeMap[]> {
    const params: DynamoDB.DocumentClient.ScanInput = {
        TableName: TABLE_NAME,
    };

    return from(dynamoDb.scan(params).promise()).pipe(
        switchMap(result => {
            const items = result.Items || [];
            if (result.LastEvaluatedKey) {
                return listAllItems().pipe(
                    map(moreItems => items.concat(moreItems))
                );
            } else {
                return [items];
            }
        }),
        catchError(error => {
            console.error('Error listing items:', error);
            return [[]]; // Return empty array in case of error
        })
    );
}

// Function to delete an item and return an observable
function deleteItem(index: number): Observable<void> {
    const params: DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: TABLE_NAME,
        Key: { index },
    };

    return from(dynamoDb.delete(params).promise()).pipe(
        map(() => { 
            // Log here if required 
        }),
        catchError(error => {
            console.error('Error deleting item:', error);
            throw error;
        })
    );
}

// Function to delete all items in the table
export function deleteAllItems(): Observable<void> {
    return listAllItems().pipe(
        switchMap(items => from(items)),
        switchMap(item => deleteItem(item.index)),
        toArray(),
        map(() => console.log('All items deleted'))
    );
}
