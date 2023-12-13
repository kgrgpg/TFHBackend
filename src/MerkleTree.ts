import { from, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreeNode } from './TreeNode';
import { queueScheduler } from 'rxjs';
import { Observable } from 'rxjs';
import { saveNode } from './services/dynamoDbOperations';

export class MerkleTree {
    root: TreeNode | null;

    constructor(leaves: string[]) {
        // The first leaf node index in a complete binary tree
        // will be at the position where the last level starts.
        // For 'n' leaves, it starts at 2^(depth-1) - 1, where depth = log2(n) rounded up
        const depth = Math.ceil(Math.log2(leaves.length + 1));
        const firstLeafIndex = Math.pow(2, depth - 1) - 1;
        const leafNodes = leaves.map((data, index) => 
            new TreeNode(null, null, data, firstLeafIndex + index));
        
        // Save all leaf nodes to DynamoDB
        leafNodes.forEach(leaf => saveNode(leaf.toDynamoNode()).subscribe({
            error: (err) => console.error('Error saving leaf node:', err)
        }));
        this.root = this.buildTree(leafNodes);
    }

    private buildTree(nodes: TreeNode[]): TreeNode | null {
        // If there is only one node, it is the root node
        if (nodes.length === 1) {
            return nodes[0];
        }

        const parentNodes = [];
        for (let i = 0; i < nodes.length; i += 2) {
            const left = nodes[i];
            const right = i + 1 < nodes.length ? nodes[i + 1] : null;

            // Calculate parent node's index
            const parentNodeIndex = Math.floor((left.index - 1) / 2);
            const parentNode = new TreeNode(left, right, '', parentNodeIndex);

            if (left) {
                left.index = 2 * parentNodeIndex + 1;
            }
            if (right) {
                right.index = 2 * parentNodeIndex + 2;
            }
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
