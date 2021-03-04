import uniqueId from "uniqid";
import sanitizeFilename from "sanitize-filename";
import S3 from "aws-sdk/clients/s3";

const S3_BUCKET = process.env.S3_BUCKET;
const UPLOAD_MAX_FILE_SIZE_DEFAULT = 26214400; // 25MB

export default async (data) => {
    const contentType = data.type;
    if (!contentType) {
        throw Error(`File's content type could not be resolved.`);
    }

    // File can be checked additionally using:
    // https://www.npmjs.com/package/file-type
    let key = sanitizeFilename(data.name);
    if (key) {
        key = uniqueId() + "-" + key;
    }
    if (data.keyPrefix) {
        key = `${sanitizeFilename(data.keyPrefix)}-${key}`;
    }

    // Replace all whitespace.
    key = key.replace(/\s/g, "");

    const uploadMinFileSize = 0;
    const uploadMaxFileSize = UPLOAD_MAX_FILE_SIZE_DEFAULT

    const params = {
        Expires: 60,
        Bucket: S3_BUCKET,
        Conditions: [["content-length-range", uploadMinFileSize, uploadMaxFileSize]], // 0 Bytes - 25MB
        Fields: {
            "Content-Type": contentType,
            key
        }
    };

    if (params.Fields.key.startsWith("/")) {
        params.Fields.key = params.Fields.key.substr(1);
    }

    const s3 = new S3();
    const payload = s3.createPresignedPost(params);

    return {
        data: payload,
        file: {
            name: key,
            key,
            type: contentType,
            size: data.size
        }
    };
};
