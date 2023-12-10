import { from, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreeNode } from './TreeNode';

export class MerkleTree {
    root: TreeNode | null;

    constructor(leaves: string[]) {
        const leafNodes = leaves.map(data => new TreeNode(null, null, data));
        this.root = this.buildTree(leafNodes);
    }

    private buildTree(nodes: TreeNode[]): TreeNode | null {
        if (nodes.length === 1) {
            return nodes[0];
        }

        const pairs = [];
        for (let i = 0; i < nodes.length; i += 2) {
            pairs.push({ left: nodes[i], right: i + 1 < nodes.length ? nodes[i + 1] : null });
        }

        const parentNodes = pairs.map(pair => {
            const parentNode = new TreeNode(pair.left, pair.right);

            // Assuming both left and right nodes have a hash observable property
            const leftHashObservable = pair.left.hash.asObservable();
            const rightHashObservable = pair.right ? pair.right.hash.asObservable() : from([null]);

            zip(leftHashObservable, rightHashObservable).pipe(
                map(([leftHash, rightHash]) => {
                    parentNode.updateHash();
                })
            ).subscribe();

            return parentNode;
        });

        return this.buildTree(parentNodes);
    }
}
