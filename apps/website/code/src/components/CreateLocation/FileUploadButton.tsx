// @ts-nocheck
import React, { useCallback } from "react";
import Files from "react-butterfiles";
import { getApolloClient } from "../apollo/graphql";
import gql from "graphql-tag";

const GET_PRE_SIGNED_POST_PAYLOAD = gql`
    query getPublicPreSignedPostPayload($data: PublicPresignedPostPayloadInput!) {
        fileManager {
            getPublicPresignedPostPayload(data: $data) {
                data {
                    data
                    file {
                        type
                        name
                        size
                        key
                    }
                }
                error {
                    message
                }
            }
        }
    }
`;

/**
 * Component renders a simple "Select file..." button which opens a file browser.
 * Once a valid file has been selected, the upload process will start.
 * @returns {*}
 * @constructor
 */
const FileUploadButton = () => {
    /**
     * Retrieve pre-signed POST data from a dedicated API endpoint.
     * @param selectedFile
     * @returns {Promise<any>}
     */
    const getPresignedPostData = useCallback(async file => {
        // 1. GET PreSignedPostPayload
        return getApolloClient().query({
            query: GET_PRE_SIGNED_POST_PAYLOAD,
            fetchPolicy: "no-cache",
            variables: {
                data: { size: file.size, name: file.name, type: file.type }
            }
        });
    }, []);

    /**
     * Upload file to S3 with previously received pre-signed POST data.
     * @param presignedPostData
     * @param file
     * @returns {Promise<any>}
     */
    const uploadFileToS3 = useCallback((presignedPostData, file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            Object.keys(presignedPostData.fields).forEach(key => {
                formData.append(key, presignedPostData.fields[key]);
            });
            // Actual file has to be appended last.
            formData.append("file", file);
            const xhr = new XMLHttpRequest();
            xhr.open("POST", presignedPostData.url, true);
            xhr.send(formData);
            xhr.onload = function() {
                this.status === 204 ? resolve() : reject(this.responseText);
            };
        });
    });

    return (
        <Files
            onSuccess={async ([selectedFile]) => {
                // Step 1 - get pre-signed POST data.
                const { data } = await getPresignedPostData(selectedFile);
                // Step 2 - upload the file to S3.
                try {
                    const { file } = selectedFile.src;
                    await uploadFileToS3(
                        data.fileManager.getPublicPresignedPostPayload.data.data,
                        file
                    );
                    console.log("File was successfully uploaded!");
                    console.log(
                        "File path:",
                        process.env.REACT_APP_API_URL +
                            "/files/" +
                            data.fileManager.getPublicPresignedPostPayload.data.file.key
                    );
                } catch (e) {
                    console.log("An error occurred!", e.message);
                }
            }}
        >
            {({ browseFiles }) => <button onClick={browseFiles}>Select file...</button>}
        </Files>
    );
};

export default FileUploadButton;
