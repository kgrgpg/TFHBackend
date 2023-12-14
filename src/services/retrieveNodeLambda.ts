import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { from, firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = 'MerkleTreeNodes';

// Lambda handler to retrieve a node by index
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Extract index from query parameters
    const index = parseInt(event.queryStringParameters?.index ?? '0');

    // Perform DynamoDB operation to retrieve node
    const response$ = from(dynamoDb.get({
        TableName: TABLE_NAME,
        Key: { index },
    }).promise()).pipe(
        map(response => {
            const node = response.Item;
            if (!node) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: 'Node not found' }),
                };
            }

            // Calculate depth and offset
            // Note that if there are too many calls to the functions,
            // Then it might be better to store depth and offset in DynamoDb itself
            // Check README Architecture for details
            const depth = Math.floor(Math.log2(index + 1));
            const offset = index - Math.pow(2, depth) + 1;

            
            // Return formatted resonse
            return {
                statusCode: 200,
                body: JSON.stringify({
                    index: node.index,
                    depth,
                    offset,
                    hash: node.hash,
                    data: node.data
                }),
            };
        }),
        catchError(error => {
            console.error(error);
            return [{
                statusCode: 500,
                body: JSON.stringify({ message: error.message || 'Internal Server Error' }),
            }];
        })
    );

    return firstValueFrom(response$);
};
