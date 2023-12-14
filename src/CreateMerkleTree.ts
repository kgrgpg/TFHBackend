import { MerkleTree } from "./MerkleTree";
import { tap } from 'rxjs/operators';

// Example usage
const leaves = ['first', 'data2', '45', 'dfdf', 'last', 'wfwd','dfwwf','3rf3ef','3fe3d','3e3r4r','98hh'];
const merkleTree = new MerkleTree(leaves);
