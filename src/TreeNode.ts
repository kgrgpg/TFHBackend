import { sha3_256 } from 'js-sha3';
import { BehaviorSubject } from 'rxjs';
import { DynamoTreeNode } from './services/dynamoDbOperations';

// TreeNode class represents a node in a Merkle Tree
export class TreeNode {
    left: TreeNode | null;
    right: TreeNode | null;
    hash: BehaviorSubject<string>; // Reactive variable to store node's hash
    data: string | null;
    index: number;

    constructor(left: TreeNode | null, right: TreeNode | null, data: string = '', index: number) {
        this.left = left;
        this.right = right;
        this.hash = new BehaviorSubject(sha3_256(data));
        this.data = data;
        this.index = index;
    }

    // Method to update the hash based on children's hashes
    updateHash() {
        const leftHash = this.left?.hash.value || '';
        const rightHash = this.right?.hash.value || '';
        this.hash.next(sha3_256(leftHash + rightHash));
    }

    printTreeNode(){
        console.log("Left: " + this.left + " Right: " + this.right + " Hash: " + this.hash + " Index: " + this.index);
    }

    // Simple function to convert a TreeNode to a DynamoTreeNode
    toDynamoNode(): DynamoTreeNode {
        const dynamoNode = {
            index: this.index,
            leftIndex: this.left ? this.left.index : null,
            rightIndex: this.right ? this.right.index : null,
            hash: this.hash.value,
            data: this.data,
        };
        return dynamoNode;
    }

    // Simple function to check if a TreeNode is a leaf node
    isLeaf() {
        return !this.left && !this.right;
    }
}
