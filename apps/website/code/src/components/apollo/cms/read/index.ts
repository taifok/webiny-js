import getCmsReadApolloClient from "./getCmsReadApolloClient";
import { useQuery as baseUseQuery, useMutation as baseUseMutation } from "@apollo/react-hooks";

export const getApolloClient = getCmsReadApolloClient;

export const useQuery = (query, options = {}) => {
    return baseUseQuery(query, { ...options, client: getCmsReadApolloClient() });
};

export const useMutation = (mutation, options = {}) => {
    return baseUseMutation(mutation, { ...options, client: getCmsReadApolloClient() });
};
