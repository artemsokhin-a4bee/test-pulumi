import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as fs from 'fs'

// Create an S3 bucket
const myBucket = new aws.s3.Bucket('myBucket', {
  tags: {
    version: '0.1'
  }
})

// Upload a static txt file with the text "hello world" inside
const myBucketObject = new aws.s3.BucketObject('myBucketObject', {
  bucket: myBucket.id,
  key: 'hello-world.txt',
  content: 'hello world 1',
  contentType: 'text/plain',
  tags: {
    version: '0.1'
  }
})

// Export the bucket name and object URL
export const bucketName = myBucket.id
export const bucketObjectUrl = pulumi.interpolate`https://${myBucket.websiteDomain}/${myBucketObject.key}`
