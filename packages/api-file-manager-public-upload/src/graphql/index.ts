import { GraphQLSchemaPlugin } from "@webiny/handler-graphql/types";
import { ErrorResponse, Response } from "@webiny/handler-graphql/responses";
import getPresignedPostPayload from "./getPresignedPostPayload";
import { FileManagerContext } from "@webiny/api-file-manager/types";

export default () => {
    const plugin: GraphQLSchemaPlugin<FileManagerContext> = {
        type: "graphql-schema",
        name: "graphql-schema-api-file-manager-s3",
        schema: {
            typeDefs: /* GraphQL */ `
            input PublicPresignedPostPayloadInput {
                name: String!
                type: String!
                size: Int!
            }

            type GetPublicPresignedPostPayloadResponseDataFile {
                name: String
                type: String
                size: Int
                key: String
            }

            type GetPublicPresignedPostPayloadResponseData {
                # Contains data that is necessary for initiating a file upload.
                data: JSON
                file: UploadFileResponseDataFile
            }

            type GetPublicPresignedPostPayloadResponse {
                error: FileError
                data: GetPublicPresignedPostPayloadResponseData
            }

            extend type FmQuery {
                getPublicPresignedPostPayload(
                    data: PublicPresignedPostPayloadInput!
                ): GetPublicPresignedPostPayloadResponse
            }
        `,
            resolvers: {
                FmQuery: {
                    getPublicPresignedPostPayload: async (root, args) => {
                        try {
                            const { data } = args;
                            const response = await getPresignedPostPayload(data);

                            return new Response(response);
                        } catch (e) {
                            return new ErrorResponse({
                                message: e.message,
                                code: e.code,
                                data: e.data
                            });
                        }
                    }
                }
            }
        }
    };

    return plugin;

}
