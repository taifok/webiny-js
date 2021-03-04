import React from "react";
import gql from "graphql-tag";
import { Form } from "@webiny/form";
import { validation } from "@webiny/validation";
import { useMutation } from "../apollo/cms/manage";
import FileUploadButton from "./FileUploadButton";

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

const DEFAULT_FORM_DATA = { name: "", slug: "" };

const CreateLocation = () => {
    const [update] = useMutation(CREATE_LOCATION);

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
