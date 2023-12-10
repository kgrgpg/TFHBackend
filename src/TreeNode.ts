import { sha3_256 } from 'js-sha3';
import { BehaviorSubject } from 'rxjs';

export class TreeNode {
    left: TreeNode | null;
    right: TreeNode | null;
    hash: BehaviorSubject<string>;

    constructor(left: TreeNode | null, right: TreeNode | null, data: string = '') {
        this.left = left;
        this.right = right;
        this.hash = new BehaviorSubject(sha3_256(data));
    }

    updateHash() {
        const leftHash = this.left?.hash.value || '';
        const rightHash = this.right?.hash.value || '';
        this.hash.next(sha3_256(leftHash + rightHash));
        this.hash.subscribe(h=>console.log(h));
    }
}
