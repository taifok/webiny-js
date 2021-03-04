# api-file-manager-public-upload

A package that adds a simple, public, file-upload GraphQL fields.

The upload process relies on the [pre-signed POST Payload](https://www.webiny.com/blog/upload-files-to-aws-s3-using-pre-signed-post-data-and-a-lambda-function-7a9fb06d56c1) approach.

Ultimately, we're using File Manager to store the files - simply because a couple of out-of-the box features it provides, mainly image optimizations / transformations.
