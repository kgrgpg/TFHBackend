# Welcome to TFH Binary Merkle Tree assignment project

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
<summary><i>(Click to expand) Key Aspects</i></summary>

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


### Reactive Extensions (Rx) Usage

This project uses Reactive Extensions as one of the important components in its architecture.
Even though we have chosen to implement the static binary merkle tree, it can lay the foundation of migrating this codebase to dynamic merkle tree with later iterations if required.

<details>
<summary><i>(Click to expand) When considering the implementation of a binary Merkle tree with Reactive Extensions (Rx), the relevance and differences between a static and dynamic tree are important to understand:</i></summary>

1. **Static Merkle Tree Implementation:**
   - **Relevance of Rx:** In a static Merkle tree, where the structure and data do not change after initialization, the use of Rx might be limited. Reactive programming shines in scenarios where there's a need to react to changes, handle streams of data, or manage asynchronous tasks.
   - **Potential Use Cases:** Even in a static tree, Rx might be useful for the initial construction, especially if the tree is built from a stream of data inputs or in an asynchronous context. However, once the tree is built, Rx's advantages are less pronounced.

2. **Dynamic Merkle Tree Implementation:**
   - **Relevance of Rx:** A dynamic Merkle tree, where nodes can be added, removed, or modified, aligns more closely with the strengths of Rx. Rx can effectively handle events such as node changes, and updates to the tree's structure.
   - **Event-Driven Nature:** With a dynamic tree, Rx can be used to create a responsive system that updates the tree's hashes and rebalances itself in response to changes in real-time. Rx's ability to handle asynchronous and event-driven operations makes it well-suited for this.
   - **Concurrency and Error Handling:** Rx provides robust tools for concurrency management and error handling, which are essential in a dynamic environment where multiple operations might occur simultaneously.

In summary, while Reactive Extensions can be applied to both static and dynamic binary Merkle tree implementations, their advantages are more pronounced in a dynamic context. For a static tree, unless the construction process itself is asynchronous or based on a data stream, the benefits of Rx might not justify its complexity. In contrast, a dynamic tree can leverage Rx's full potential for handling real-time updates, asynchronous processing, and event-driven architecture.
</details>

Reactive Extensions are also relevant to the additional functionalities of node retrieval and API interaction in the following ways:

<details>
<summary><i>(Click to expand) More utility</i></summary>
1. **Handling Asynchronous Requests:** For the node retrieval function, Rx can manage asynchronous operations efficiently. If the retrieval process involves complex computations or database interactions, Rx can handle these tasks without blocking the main thread, improving the responsiveness of your application.

2. **Streamlining API Responses:** In the context of the API route for node retrieval, Rx can be used to handle incoming API requests as a stream of events. This approach allows for more reactive and efficient processing of requests, especially if there are high volumes of concurrent requests.

3. **Error Handling in API Interactions:** Rx provides robust mechanisms for error handling which can be particularly useful in API interactions. It allows you to gracefully handle and respond to various error conditions that might occur during the node retrieval process.

4. **Real-time Data Streaming:** If your application requires real-time updates or streaming of tree data (in case of a dynamic tree), Rx can facilitate this by treating data as a continuous stream. This is beneficial for applications where the state of the Merkle tree needs to be monitored or streamed to clients in real-time.

5. **Combining Multiple Data Sources:** If the node retrieval function needs to combine data from multiple sources (e.g., different databases or services), Rx can merge these data streams efficiently and provide a cohesive response.

6. **Throttling and Debouncing:** In cases where your API might receive a high volume of requests in a short time, Rx can help in implementing throttling or debouncing strategies to manage the load effectively.

In summary, while Reactive Extensions may not directly influence the core logic of building and managing a Merkle tree, they can significantly enhance the performance, responsiveness, and robustness of the functionalities surrounding node retrieval and API interaction. Rx's ability to handle asynchronous operations, manage data streams, and provide sophisticated error handling makes it a powerful tool

</details>

### Storage Options for Binary Merkle Tree in AWS
#### Amazon DynamoDB
- **Pros**:
  - Fully-managed NoSQL database, ideal for flexible data models.
  - Fast performance with single-digit millisecond response times.
  - Automatic scaling for large data and traffic.
  - AWS Lambda integration for serverless architectures.
- **Cons**:
  - Requires NoSQL design pattern knowledge.
  - Potentially expensive for write-heavy applications.
- **Suitability for Merkle Tree**:
  - Great for fast, consistent access to tree nodes.
  - Limited complex querying compared to SQL databases.

#### Amazon Redis (ElastiCache)
- **Pros**:
  - In-memory data store with low latency, perfect for real-time access.
  - Supports complex data structures, beneficial for tree structures.
  - Scalable and high-performance.
- **Cons**:
  - Expensive for large data sets (in-memory storage).
  - Persistence requires additional configuration.
- **Suitability for Merkle Tree**:
  - Ideal for high-performance applications needing in-memory access.
  - Needs extra persistence setup.

#### Amazon S3
- **Pros**:
  - Durable, scalable, and secure object storage.
  - Ideal for large unstructured data.
  - Cost-effective and integrates well with AWS services.
- **Cons**:
  - Not suited for transactional data or fast access needs.
  - Better for static files than dynamic data.
- **Suitability for Merkle Tree**:
  - Good for infrequently changing trees and cost-effective storage.

#### Amazon RDS
- **Pros**:
  - Supports various database engines (MySQL, PostgreSQL, etc.).
  - Automated backups, patching, and scalability.
- **Cons**:
  - More complex than NoSQL solutions.
  - Potentially higher cost for high throughput.
- **Suitability for Merkle Tree**:
  - Good for complex querying or existing SQL expertise.

#### Recommendation:
- **DynamoDB** for scalability, performance, and AWS integration.
- **Redis** for high-speed access

## DynamoDb and AWS Lambda for storage and node retrieval

#### Using DynamoDB for Storage

- **Distributed Storage:** Storing the binary Merkle tree in DynamoDB means the tree is distributed across a database, not stored in-memory in its entirety.
- **Selective Loading:** When you retrieve a node using a Lambda function, you're only loading the specific node's data (its depth, offset, and value) into memory, not the entire tree.

#### Implications of the Approach

1. **Efficient Retrieval:** By storing the tree in DynamoDB and retrieving nodes on-demand via Lambda, you achieve efficient and scalable data access. You avoid the overhead of loading the entire tree into memory, especially beneficial for large trees.

2. **Statelessness:** AWS Lambda functions are stateless. Therefore, each function invocation can retrieve just the necessary data from DynamoDB without relying on a previously loaded state. This aligns well with serverless architecture principles.

3. **Consistency with Assignment Flexibility:** The assignment's mention of "loading the entire tree to memory" suggests a flexibility in approach. While you're technically not loading the entire tree into memory, your approach is consistent with the goal of efficiently handling data retrieval, which is a key aspect of the challenge.

4. **Scalability and Performance:** The chosen approach (DynamoDB for storage and Lambda for retrieval) is likely more scalable and performant compared to loading the entire tree into memory, particularly for large datasets or when dealing with high request volumes.

#### Conclusion

Your implementation strategy, using DynamoDB for storage and Lambda for on-demand retrieval, is a practical and efficient approach that aligns with the assignment's flexibility in handling the Merkle tree. It offers scalability, efficiency, and aligns with cloud-native development practices. While it differs from loading the entire tree into memory, it effectively addresses the challenge's objectives.
