import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { from, firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = 'MerkleTreeNodes';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const index = parseInt(event.queryStringParameters?.index ?? '0');

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

            const depth = Math.floor(Math.log2(index + 1));
            const offset = index - Math.pow(2, depth) + 1;

            return {
                statusCode: 200,
                body: JSON.stringify({
                    index: node.index,
                    depth,
                    offset,
                    value: node.hash,
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
