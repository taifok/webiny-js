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

const LIST_LOCATIONS = gql`
    query ListLocations {
        listLocations {
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

const IS_PRERENDER = window["IS_PRERENDER"];

const Location = () => {
    const path = trimPath(window.location.pathname);

    // Here we get the page data for current URL, including its content.
    const getLocationQuery = useQuery(GET_LOCATION, {
        variables: {
            slug: path
        }
    });

    const listLocationsQuery = useQuery(LIST_LOCATIONS, {
        variables: {
            slug: path
        },
        skip: IS_PRERENDER || !getLocationQuery?.data?.getLocation?.data
    });

    const location = getLocationQuery?.data?.getLocation?.data;
    const locationsList = listLocationsQuery?.data?.listLocations?.data || [];

    if (!location) {
        return <span>Location not found.</span>;
    }

    return (
        <div>
            <h1>{location.name}</h1>
            <div>
                <p>{location.description}</p>
            </div>
            <br />
            <div>
                <hr />
                <h3>Locations</h3>
                <div>
                    {locationsList.map(item => {
                        return <div key={item.slug}>{item.name}</div>;
                    })}
                </div>
            </div>
        </div>
    );
};

export default Location;
