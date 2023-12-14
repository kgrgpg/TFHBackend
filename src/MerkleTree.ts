import { from, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreeNode } from './TreeNode';
import { queueScheduler } from 'rxjs';
import { Observable } from 'rxjs';
import { deleteAllItems, listAllItems, saveNode } from './services/dynamoDbOperations';

// MerkleTree class to represent a binary Merkle tree
export class MerkleTree {
    root: TreeNode | null;

    constructor(leaves: string[]) {
        this.root = null;

        // Delete all the previous items stored in DynamoDB from previously created trees
        // Note that this might not be scalable if tree sizes are very large
        // For those scenarios, other strategies are discussed in README file under Architecture section
        deleteAllItems().subscribe({
            complete: () => {
                // The first leaf node index in a perfect binary tree
                // will be at the position where the last level starts.
                // For 'd' depth, it starts at 2^(d) - 1, where depth = log2(n) rounded up
                const depth = Math.ceil(Math.log2(leaves.length));
                console.log('Tree depth is:',depth);

                const firstLeafIndex = Math.pow(2, depth) - 1;
                console.log('First leaf index is:',firstLeafIndex);

                const lastLevelNodesCount = Math.pow(2,depth);
                console.log('Number of nodes in last level after filling with empty leaves (if required):',lastLevelNodesCount);

                const treeLeafNodes: TreeNode[] = [];

                // Fill the last level with empty data leaves to create a perfect binary tree
                for(let i=0; i<lastLevelNodesCount; i++)
                {
                    if(i<leaves.length)
                    {
                        treeLeafNodes.push(new TreeNode(null,null,leaves[i],firstLeafIndex+i));
                    }
                    else
                    {
                        treeLeafNodes.push(new TreeNode(null,null,'',firstLeafIndex+i));
                    }
                    
                }

                // Save all leaf nodes to DynamoDB
                treeLeafNodes.forEach(leaf => {
                    saveNode(leaf.toDynamoNode()).subscribe({
                        error: (err) => console.error(`Error saving leaf node: index=${leaf.index}, error=${err}`)
                    });
                });
                this.root = this.buildTree(treeLeafNodes);
            },
            error: (err) => console.error('Error deleting previous items:', err)
        });
    }

    // Private method to recursively build the tree from leaf nodes
    private buildTree(nodes: TreeNode[]): TreeNode | null {
        // If there is only one node, it is the root node
        if (nodes.length === 1) {
            return nodes[0];
        }

        const parentNodes = [];
        for (let i = 0; i < nodes.length; i += 2) {
            const left = nodes[i];
            const right = nodes[i + 1];

            // Calculate parent node's index
            // Note that we are only dealing with balanced tree,
            // since we have duplicated the last leaf if odd number of leaves
            const parentNodeIndex = Math.floor((left.index - 1) / 2);

            const parentNode = new TreeNode(left, right, '', parentNodeIndex);

            // Logic to update the hash...
            const leftHashObservable = left.hash.asObservable();
            const rightHashObservable = right ? right.hash.asObservable() : from([null]);

            zip(leftHashObservable, rightHashObservable).pipe(
                map(([leftHash, rightHash]) => {
                    parentNode.updateHash();
                })
            ).subscribe();

            // Save to DynamoDB while iterating here itself
            saveNode(parentNode.toDynamoNode()).subscribe({
                error: (err) => console.error('Error saving intermediate node:', err)
            });
            parentNodes.push(parentNode);
        }

        return this.buildTree(parentNodes);
    }

    // Method to retrieve all nodes in the tree as an Observable
    getAllNodes(): Observable<TreeNode> {
        return new Observable<TreeNode>(subscriber => {
            if (!this.root) {
                subscriber.complete();
                return;
            }

            const queue: TreeNode[] = [this.root];
            queueScheduler.schedule(function() {
                if (queue.length === 0) {
                    subscriber.complete();
                } else {
                    const node = queue.shift();
                    if(node)
                    {
                        subscriber.next(node);
                        if (node.left) queue.push(node.left);
                        if (node.right) queue.push(node.right);
                        this.schedule();
                    }
                }
            });
        });
    }
}
