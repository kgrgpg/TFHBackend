import { sha3_256 } from 'js-sha3';
import { BehaviorSubject } from 'rxjs';

export class TreeNode {
    left: TreeNode | null;
    right: TreeNode | null;
    hash: BehaviorSubject<string>;
    index: number;

    constructor(left: TreeNode | null, right: TreeNode | null, data: string = '', index: number) {
        this.left = left;
        this.right = right;
        this.hash = new BehaviorSubject(sha3_256(data));
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
}
