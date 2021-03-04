import getCmsManageApolloClient from "./getCmsManageApolloClient";
import { useQuery as baseUseQuery, useMutation as baseUseMutation } from "@apollo/react-hooks";

export const getApolloClient = getCmsManageApolloClient;

export const useQuery = (query, options = {}) => {
    return baseUseQuery(query, { ...options, client: getCmsManageApolloClient() });
};

export const useMutation = (mutation, options = {}) => {
    return baseUseMutation(mutation, { ...options, client: getCmsManageApolloClient() });
};
