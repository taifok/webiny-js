import React from "react";
import { useQuery } from "@apollo/react-hooks";
import trim from "lodash.trim";
import gql from "graphql-tag";

// Make sure the final path looks like `/xyz`. We don't want to run into situations where the prerendering engine is
// visiting `/xyz`, but delivery URL is forcing `/xyz/`. This ensures the path is standardized, and the GraphQL
// queries are the same on both sides.
const trimPath = (value: string) => {
    if (typeof value === "string") {
        return "/" + trim(value, "/");
    }
    return null;
};

const GET_LOCATION = gql`
    query GetLocation($slug: String!) {
        getLocation(where: { slug: $slug }) {
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

const Location = () => {
    const path = trimPath(location.pathname);

    // Here we get the page data for current URL, including its content.
    const { data } = useQuery(GET_LOCATION, {
        variables: {
            slug: path
        }
    });

    return (
        <div>
            <h1>{data?.getLocation?.data.name}</h1>
            <div>
                <p>{data?.getLocation?.data.description}</p>
            </div>
        </div>
    );
};

export default Location;
