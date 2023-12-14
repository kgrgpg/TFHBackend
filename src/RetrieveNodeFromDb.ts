import { getNode } from "./services/dynamoDbOperations";

// Retrieve the node from DynamoDB
const index = 1; //Enter the index of required node to be retrieved
getNode(index).subscribe(node => {
    if (node) {
        console.log('Reading from DynamoDb');
        console.log(node);
    }
});
