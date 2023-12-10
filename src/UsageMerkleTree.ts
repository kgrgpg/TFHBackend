import { MerkleTree } from "./MerkleTree";
// Example usage
const leaves = ['data1', 'data2', 'data3', 'data4'];
const merkleTree = new MerkleTree(leaves);

merkleTree.root?.hash.subscribe(hash => console.log('Root Hash:', hash));
