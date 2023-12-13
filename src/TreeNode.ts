import { sha3_256 } from 'js-sha3';
import { BehaviorSubject } from 'rxjs';
import { DynamoTreeNode } from './services/dynamoDbOperations';

export class TreeNode {
    left: TreeNode | null;
    right: TreeNode | null;
    hash: BehaviorSubject<string>;
    data: string | null;
    index: number;

    constructor(left: TreeNode | null, right: TreeNode | null, data: string = '', index: number) {
        this.left = left;
        this.right = right;
        this.hash = new BehaviorSubject(sha3_256(data));
        this.data = data;
        this.index = index;
    }

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
        return {
            index: this.index,
            leftIndex: this.left ? this.left.index : null,
            rightIndex: this.right ? this.right.index : null,
            hash: this.hash.value,
            data: this.data,
        };
    }

    // Simple function to check if a TreeNode is a leaf node
    isLeaf() {
        return !this.left && !this.right;
    }
}
