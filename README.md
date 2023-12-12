# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## Architecture

### Use of Static vs Dynamic Merkle tree

For this project, static binary merkle tree implemention is prioritized instead of the dynamic one. This is due to the added complexity introduced by a dynmamic tree. Transitioning from a static to a dynamic binary Merkle tree implementation involves several additional considerations and modifications. While a static tree is initialized once and remains unchanged, a dynamic tree allows for updates, such as adding, modifying, or deleting nodes, which in turn affect the hashes and the structure of the tree. Here are the key aspects you would need to address for a dynamic implementation:

<details>
<summary>Click to expand key aspects</summary>

1. **Node Insertion and Deletion:** In a dynamic tree, you'll need methods to insert and delete nodes. This includes updating parent nodes and possibly rebalancing the tree to maintain its properties.

2. **Hash Recalculation:** Whenever a node is added, removed, or modified, the hashes of the affected nodes and their ancestors up to the root need to be recalculated to maintain the integrity of the tree.

3. **Tree Balancing:** A dynamic Merkle tree should ideally be balanced to ensure optimal performance, especially for search operations. This may require implementing a self-balancing binary tree algorithm (like AVL or Red-Black Tree).

4. **Concurrency Handling:** If the tree is accessed and modified by multiple processes concurrently, mechanisms to handle concurrency (like locks or transactional operations) are necessary to prevent data corruption.

5. **Persistent Storage Synchronization:** In a dynamic context, changes to the tree should be consistently reflected in the persistent storage (e.g., a database), which may require additional logic for synchronization and transaction management.

6. **API Adaptation:** Your API will need to handle not just retrieval, but also the addition, modification, and deletion of nodes. This means more endpoints and possibly more complex request and response structures.

7. **Error Handling and Validation:** More complex operations in a dynamic tree introduce additional scenarios for errors and invalid states, requiring robust error handling and validation logic.

8. **Efficiency Considerations:** Dynamic operations can be more computationally intensive, especially if the tree is large. Efficient algorithms for insertion, deletion, and hashing are crucial.

</details>

In summary, while a static and dynamic binary Merkle tree share fundamental characteristics, making the tree dynamic introduces significant complexity and requires additional code and architectural considerations. The amount of additional work will depend on the specific requirements of your implementation, such as how often the tree is updated, the size of the tree, and the required performance characteristics.
