import * as AWS from 'aws-sdk';
import { from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Set the region
AWS.config.update({ region: 'eu-central-1' }); 

// Initialize AWS Lambda client
const lambda = new AWS.Lambda();

// Parameters for the Lambda invocation
const params: AWS.Lambda.InvocationRequest = {
    FunctionName: 'MerkleTreeLambdaFunction', // Name as declared in CDK code
    Payload: JSON.stringify({ queryStringParameters: { index: '1' } }),
};

// Convert the Lambda invocation to an Observable
const invokeLambda$ = from(lambda.invoke(params).promise());

invokeLambda$.pipe(
    map(response => {
        // Process successful response
        console.log(response);
        return response;
    }),
    catchError(error => {
        // Handle any errors
        console.error(error);
        throw error;
    })
).subscribe({
    next: (data) => console.log('Lambda invocation successful:', data),
    error: (err) => console.error('Lambda invocation failed:', err),
});
