import { MerkleTree } from "./MerkleTree";
import { tap } from 'rxjs/operators';
// Example usage
const leaves = ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data8'];
const merkleTree = new MerkleTree(leaves);

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
