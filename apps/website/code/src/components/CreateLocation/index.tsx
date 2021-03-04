import React from "react";
import gql from "graphql-tag";
import { Form } from "@webiny/form";
import { validation } from "@webiny/validation";
import { useMutation } from "../apollo/cms/manage";
import { useQuery } from "../apollo/cms/read";
import FileUploadButton from "./FileUploadButton";

// The API key you're using must have proper permissions in order to execute these.
// You should create an API key with least-privilege approach.
const CREATE_LOCATION = gql`
    mutation CreateLocation($data: LocationInput!) {
        createLocation(data: $data) {
            data {
                id
                name
                slug
                description
            }
            error {
                message
                code
                data
            }
        }
    }
`;

const GET_LOCATION_CONTENT_MODEL = gql`
    query GetContentModel($modelId: ID!) {
        getContentModel(modelId: $modelId) {
            data {
                fields {
                    id
                    fieldId
                    type
                    label
                    validation {
                        settings
                        name
                        message
                    }
                }
            }
        }
    }
`;

const DEFAULT_FORM_DATA = { name: "", slug: "" };

const CreateLocation = () => {
    const [update] = useMutation(CREATE_LOCATION);
    const getContentModelQuery = useQuery(GET_LOCATION_CONTENT_MODEL, {
        variables: { modelId: "location" }
    });

    const contentModelFields = getContentModelQuery?.data?.getContentModel?.data?.fields || [];
    console.log(
        "'validatedField' field: ",
        contentModelFields.find(item => item.fieldId === "validatedField")
    );

    return (
        <div>
            <div>
                <a href={"/locations/my-location-a"}>My Location A</a> |
                <a href={"/locations/my-location-b"}>My Location B</a> |
                <a href={"/locations/my-location-c"}>My Location C</a>
            </div>
            <br />
            <h1>Create a new location</h1>
            <div>
                <Form
                    data={DEFAULT_FORM_DATA}
                    onSubmit={async data => {
                        await update({ variables: { data } });
                    }}
                >
                    {({ Bind, submit }) => {
                        return (
                            <div>
                                <div>
                                    <Bind
                                        name={"name"}
                                        validators={validation.create("required")}
                                        beforeChange={(e, setValue) => setValue(e.target.value)}
                                    >
                                        <input type="text" placeholder={"Name"} />
                                    </Bind>
                                </div>

                                <div>
                                    <Bind
                                        name={"slug"}
                                        validators={validation.create("required")}
                                        beforeChange={(e, setValue) => setValue(e.target.value)}
                                    >
                                        <input type="text" placeholder={"Slug"} />
                                    </Bind>
                                </div>
                                <div>
                                    <Bind
                                        name={"description"}
                                        validators={validation.create("required")}
                                        beforeChange={(e, setValue) => setValue(e.target.value)}
                                    >
                                        <textarea placeholder={"Description"} />
                                    </Bind>
                                </div>
                                <div>
                                    <FileUploadButton />
                                </div>
                                <button onClick={submit}>Submit</button>
                            </div>
                        );
                    }}
                </Form>
            </div>
        </div>
    );
};

export default CreateLocation;
