import { MerkleTree } from "./MerkleTree";
import { tap } from 'rxjs/operators';
import { getNode } from "./services/dynamoDbOperations";

// Example usage
const leaves = ['first', 'data2', '45', 'dfdf', 'last', 'wfwd','dfwwf','3rf3ef','3fe3d','3e3r4r','98hh'];
const merkleTree = new MerkleTree(leaves);

// This loads all the nodes from the local memory
merkleTree.root?.hash.subscribe(hash => {
    console.log('Root Hash:', hash);

    // Using RxJS to print all tree nodes
    merkleTree.getAllNodes().pipe(
        tap(node => {
            const content = node.isLeaf() ? `Data: ${node.data}` : `Hash: ${node.hash.value}`;
            console.log(`Node Index: ${node.index}, ${content}`);
        })
    ).subscribe();
});

// Retrieve the node from DynamoDB
const index = 1; //Enter the index of required node to be retrieved
getNode(index).subscribe(node => {
    if (node) {
        console.log('Reading from DynamoDb');
        console.log(node);
    }
});
