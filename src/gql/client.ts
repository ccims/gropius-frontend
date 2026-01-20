import { useAppStore } from "@/store/app";
import { GraphQLClient, RequestMiddleware } from "graphql-request";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { DocumentNode } from "graphql/language";
import { pushErrorMessage } from "@/util/withErrorMessage";

export function useClient() {
    const store = useAppStore();

    const requestMiddleware: RequestMiddleware = async (request) => {
        return {
            ...request,
            headers: {
                ...request.headers,
                Authorization: `Bearer ${await store.getAccessToken()}`
            }
        };
    };

    return new GraphQLClient("/api/graphql", {
        requestMiddleware
    });
}
type Variables = Record<string, unknown>;
type VariablesAndRequestHeadersArgs<V extends Variables> =
    V extends Record<any, never> ? [variables?: V] : [variables: V];
export async function request<TData, TVariables extends Variables = Variables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    ...variables: VariablesAndRequestHeadersArgs<TVariables>
) {
    try {
        return await useClient().request<TData, TVariables>(query, ...variables);
    } catch (error) {
        pushErrorMessage("Error in query");
        console.error(error);
        return undefined;
    }
}

export async function queryNode<
    TData extends { node?: any },
    DataType extends string,
    TVariables extends Variables = Variables
>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    type: DataType,
    ...variables: VariablesAndRequestHeadersArgs<TVariables>
): Promise<NodeReturnType<TData, DataType> | undefined> {
    try {
        const data = await useClient().request<TData, TVariables>(query, ...variables);
        const node = data.node
        if(!node || Object.keys(node).length <= 1) {
            return undefined;
        }
        return data.node as NodeReturnType<TData, DataType>;
    } catch (error) {
        pushErrorMessage("Error in query")
        console.error(error);
        return undefined;
    }
}

type NodeReturnType<TData extends { node?: any }, DataType extends string> = Extract<
    NonNullable<TData["node"]>,
    { __typename: DataType }
>;
