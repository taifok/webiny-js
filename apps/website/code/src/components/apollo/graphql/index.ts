import baseGetApolloClient from "./getApolloClient";
import { useQuery as baseUseQuery, useMutation as baseUseMutation } from "@apollo/react-hooks";

export const getApolloClient = baseGetApolloClient;

export const useQuery = (query, options = {}) => {
    return baseUseQuery(query, { ...options, client: getApolloClient() });
};

export const useMutation = (mutation, options = {}) => {
    return baseUseMutation(mutation, { ...options, client: getApolloClient() });
};
