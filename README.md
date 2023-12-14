# Welcome to TFH Binary Merkle Tree assignment project

The pdf to the [TFH Binary Merkle Tree assignment can be found here](./App_backend__Take-home_exercise.pdf)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Install Node.js (version 14.x or later) from [Node.js Downloads](https://nodejs.org/en/download/).
- **AWS CLI**: Install the AWS Command Line Interface (CLI) following the instructions at [AWS CLI Installation](https://aws.amazon.com/cli/).
- **AWS Account**: If you don't have an AWS account, create one at [AWS Management Console](https://aws.amazon.com/console/).
- **AWS Configuration**: Configure AWS CLI with your credentials and default region. You can follow [Configuring the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).

## Setting up

1. Navigate to the project directory and run `npm install` to install the necessary Node.js packages.
2. Ensure that your AWS CLI is configured with your AWS account credentials. Run `aws configure` and enter your `AWS Access Key ID`, `AWS Secret Access Key`, and default region.
3. Compile typescript to js and create dist folder using `npm run build`
4. you can deploy the application stack to your AWS account using `npx cdk deploy`.

## Running the application after setting up

### Creating the Binary Merkle Tree and storing it in DynamoDb
1. Open src/UsageMerkleTree.ts
2. Edit `const leaves = ['data1', 'data2', 'data3', 'data4', 'data5', 'data6', 'data7', 'data8'];` accordingly for the leaves
3. Save file and `npm run build`
4. `node src/UsageMerkleTree.js`
5. Check the console for log

### Direct retrieval of node from the tree saved in DynamoDb
1. Open src/UsageMerkleTree.ts
2. Edit `const index = 1; //Enter the index of required node to be retrieved`
3. Save file and `npm run build`
4. `node src/UsageMerkleTree.js`
5. Check the console for log

### Programmatic Retrieval of node via Lambda function invocation
1. Open src/services/invokeLambda.ts
2. Edit `Payload: JSON.stringify({ queryStringParameters: { index: '8' } }),`. Change the index to the required one
3. Save file and `npm run build`
4. `node src/services/invokeLambda.js`
5. Check the console for log

### Testing the API Gateway REST Service with Lambda Function

1. Deploy Your CDK Stack:
   - Ensure your CDK stack is deployed. Run `cdk deploy` from your project's root directory.
   - The CDK CLI will output the URL of the deployed API Gateway after successful deployment.

2. Get the API Gateway URL:
   - Note the URL endpoint of your API Gateway provided by CDK CLI. It should look like: `https://<api-id>.execute-api.eu-central-1.amazonaws.com/prod/`.

3. Testing the GET Method:
   - Construct the URL for testing by appending the resource path (`node`) and query parameter for the index.
   - Example for index `1`: `https://<api-id>.execute-api.eu-central-1.amazonaws.com/prod/node?index=1`.

4. Use a Web Browser or HTTP Client:
   - Enter the full URL in a web browser to send a GET request to your API Gateway.
   - Alternatively, use an HTTP client like Postman or `curl` in the terminal.

5. Example `curl` Command:
   - To test with `curl`, use:
     ```bash
     curl "https://<api-id>.execute-api.eu-central-1.amazonaws.com/prod/node?index=1"
     ```
   - Replace `<api-id>` with your actual API ID.

6. Check the Response:
   - The response from the API will display the node details like index, depth, offset, and value/hash.

7. Troubleshoot if Necessary:
   - Check the Lambda function logs in AWS CloudWatch for debugging if you encounter issues.
   - Ensure proper permissions for Lambda to access DynamoDB and correct setup of API Gateway integration.
  
8. Remember to redeploy your CDK stack after any changes to your Lambda function or API Gateway configuration.

### Additional commands 
* `npm run test`    perform the jest unit tests
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

### Troubleshooting Guide

* Deployment Issues: If you encounter issues during deployment with CDK, ensure that your AWS CLI is configured correctly and that you have the necessary permissions in your AWS account.

* Runtime Errors: For any runtime errors, check the logs in AWS CloudWatch associated with your Lambda functions for detailed error messages.

* Connectivity Issues: Ensure that your AWS services are in the same region and that there are no network ACLs or security groups blocking communication.

* Lambda Timeouts: If Lambda functions timeout, consider increasing the timeout duration in your CDK script.


## Architecture

## Use of Static vs Dynamic Merkle tree

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


## Reactive Extensions (Rx) Usage

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

## Storage Options for Binary Merkle Tree in AWS
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

3. **Consistency with Assignment Flexibility:** The assignment's mention of "loading the entire tree to memory" suggests a flexibility in approach. While technically not loading the entire tree into memory, the approach is consistent with the goal of efficiently handling data retrieval, which is a key aspect of the challenge.

4. **Scalability and Performance:** The chosen approach (DynamoDB for storage and Lambda for retrieval) is likely more scalable and performant compared to loading the entire tree into memory, particularly for large datasets or when dealing with high request volumes.

#### Conclusion

Using DynamoDB for storage and Lambda for on-demand retrieval, is a practical and efficient approach that aligns with the assignment's flexibility in handling the Merkle tree. It offers scalability, efficiency, and aligns with cloud-native development practices. While it differs from loading the entire tree into memory, it effectively addresses the challenge's objectives.

## Calculating Depth and Offset in a Binary Merkle Tree

Given just the index of a node in a binary Merkle tree, it is possible to calculate the depth and offset of the node. Here's how you can do it:

### Depth Calculation

- The depth of a node in a binary tree is the number of edges from the node to the tree's root node.
- In a complete binary tree, all levels except possibly the last are completely filled, and all nodes are as far left as possible.
- You can calculate the depth by finding the greatest integer `d` where `2^d <= index + 1`. This is because in a complete binary tree, a node at index `i` (0-indexed) will be at a depth where the total number of nodes in all upper levels is less than or equal to `i`.

### Offset Calculation

- The offset of a node at a particular depth is its position relative to the leftmost node at that depth.
- To find the offset, you can subtract the total number of nodes in all previous levels from the index. The formula for the total number of nodes up to depth `d` in a complete binary tree is `2^d - 1`. 
- So, the offset can be calculated as `index - (2^depth - 1)`.

## Decision: Storing Depth and Offset in DynamoDB vs Calculating on the Fly

When deciding whether to calculate the depth and offset on the fly or store them as properties in each tree node in DynamoDB for a binary Merkle tree, consider the following factors:

### Frequency of Access

- **Frequent Access**: If depth and offset are frequently needed, storing them might improve performance.
- **Rare Usage**: If these values are seldom used, calculating them on demand could be more efficient for storage.

### Performance Considerations

- **Computational Load**: Calculating depth and offset is simple but could be a bottleneck in high-throughput scenarios.
- **Storage vs. Computation**: Storing these values increases storage requirements but reduces computational load during retrieval.

### Storage Costs and Optimization

- **Increased Storage**: Additional properties increase the storage requirement, impacting costs in databases like DynamoDB.
- **Optimization**: Calculating values on the fly can be cost-effective but trades off against computational efficiency.

### Complexity and Maintenance

- **Increased Complexity**: More properties in each node lead to increased complexity and data management.
- **Simpler Model**: Storing fewer properties (only index, left, right, hash) simplifies the data model but may require additional computation.

### Application-Specific Needs

- **Real-Time Performance**: If real-time response is critical, pre-storing depth and offset might be beneficial.
- **Storage Limits and Cost Sensitivity**: If there are strict limits on storage or cost, calculating on demand is preferable.

**Recommendation**:

- **Store Values**: If depth and offset are used frequently or if quick response time is critical.
- **Calculate on Demand**: If storage optimization is important and depth and offset are not accessed frequently.

The decision should be based on balancing storage efficiency, computational load, and the specific needs of your application. Performance testing in your specific scenario may also provide insights for the best approach.

## > Since we are calling the same DynamoDB each time we build the tree, should we ensure that the old entries are deleted?

Yes, ensuring that old entries are deleted or updated appropriately when you rebuild the tree is an important consideration, especially to maintain the integrity and consistency of your data in DynamoDB. Here are a few approaches you can take:

1. **Overwrite Existing Entries**:
   - If the structure of your Merkle tree remains consistent (i.e., the indices of the nodes do not change), you can simply overwrite existing entries with new data. This is the simplest approach and works well if you're sure the tree structure won't change.

2. **Delete All Entries Before Rebuilding**:
   - To start afresh each time you build the tree, you can first delete all existing entries in the DynamoDB table. This can be done by scanning the table to get all items and then deleting them. However, this approach may not be efficient for large tables due to the cost and time associated with scanning and deleting each item.

3. **Versioning or Timestamps**:
   - Implement a versioning system where each node also stores a version number or timestamp. When you rebuild the tree, increment the version or update the timestamp. This way, you can identify which nodes are outdated. This approach is more complex but allows for more flexible data management.

4. **Use a Different Table or Partition**:
   - Consider using a different DynamoDB table or a different partition key for each rebuild. This way, each tree is isolated, and you can easily clear out an entire tree without affecting others.

5. **Soft Deletes**:
   - Implement a "soft delete" mechanism where you mark entries as deleted without actually removing them from the table. Later, you can filter out these marked entries in your application logic.

6. **TTL (Time To Live)**:
   - DynamoDB supports TTL (Time To Live) settings on items. You can set a TTL value for each item, after which DynamoDB automatically deletes the item. This could be useful if your application logic allows for a delay in the cleanup process.

When choosing a strategy, consider factors like the size of your data, frequency of tree rebuilding, cost implications, and how your application uses the data. Also, always ensure that your approach aligns with best practices for DynamoDB usage to optimize performance and cost.

Deciding whether to use a different DynamoDB table or a different partition key for each rebuild of your Merkle tree, and whether to handle this at the AWS CDK level or the application level, depends on your specific requirements and the architecture of your system. Here are considerations for both approaches:

### Using Different Tables - CDK Level:
1. **CDK Approach**: 
   - In this approach, you would define multiple DynamoDB tables in your CDK stack, each intended for a separate version of your Merkle tree.
   - This method is suitable if you plan to rebuild your trees infrequently and the number of versions is relatively small or manageable.
   - CDK will handle the infrastructure setup, but your application code must be aware of which table to interact with for each rebuild.

2. **Application-Level Logic**:
   - Your application must include logic to determine which table to write to or read from. This might involve configuration files, environment variables, or other mechanisms to select the appropriate table.

### Using Different Partition Keys - Application Level:
1. **Single Table with Multiple Partitions**: 
   - Here, you use a single DynamoDB table with a composite primary key, where one part of the key is a partition key that changes with each rebuild.
   - This approach is handled at the application level. Your CDK setup remains the same with a single DynamoDB table.

2. **Partition Key Strategy**:
   - You could use a version identifier or a timestamp as part of your partition key to segregate different tree builds.
   - For example, your primary key could be a combination of `treeVersion` (partition key) and `nodeIndex` (sort key).

3. **Flexibility**:
   - This method offers more flexibility and is suitable for scenarios where trees are rebuilt frequently or the number of versions is dynamic and potentially large.
   - It keeps the infrastructure simple while providing a straightforward way to isolate and manage different versions of the tree within the same table.

### Choosing the Right Approach:
- **Scalability and Management**: Consider the scalability of each approach. Multiple tables can become challenging to manage as the number increases, whereas using partition keys in a single table is more scalable but requires careful query design to avoid inefficient scans.
- **Cost Implications**: Multiple tables might lead to higher costs, especially if they are under-utilized. A single table with multiple partitions can be more cost-effective.
- **Simplicity vs. Flexibility**: Multiple tables are simpler in terms of data isolation but less flexible. A single table with different partitions is more flexible but requires more complex query logic.

In summary, whether to use different tables or partition keys, and whether to manage this at the CDK level or the application level, depends on the frequency of rebuilds, the number of tree versions, cost considerations, and how you prefer to manage your infrastructure and application logic.
