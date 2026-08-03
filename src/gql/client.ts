import { useAppStore } from "@/store/app";
import { GraphQLClient, type RequestMiddleware } from "graphql-request";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { DocumentNode } from "graphql/language";
import { pushErrorMessage } from "@/util/withErrorMessage";

export function useClient() {
    const store = useAppStore();

    const requestMiddleware: RequestMiddleware = async (request) => {
        // request.headers is a Headers instance in graphql-request 7; spreading it into an
        // object literal yields {} and drops Content-Type, which the API rejects.
        const headers = new Headers(request.headers);
        headers.set("Authorization", `Bearer ${await store.getAccessToken()}`);
        return { ...request, headers };
    };

    // graphql-request 7 resolves the endpoint with `new URL(url)`, which rejects a bare path,
    // so the origin has to be applied here rather than left to fetch.
    return new GraphQLClient(new URL("/api/graphql", window.location.origin).toString(), {
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
        return requestThrow(query, ...variables);
    } catch (error) {
        pushErrorMessage("Error in query");
        console.error(error);
        return undefined;
    }
}

export async function requestThrow<TData, TVariables extends Variables = Variables>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    ...variables: VariablesAndRequestHeadersArgs<TVariables>
) {
    return await useClient().request<TData, TVariables>(query, ...variables);
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
        const node = data.node;
        if (!node) {
            return undefined;
        }
        return data.node as NodeReturnType<TData, DataType>;
    } catch (error) {
        pushErrorMessage("Error in query");
        console.error(error);
        return undefined;
    }
}

export async function queryNodeThrow<
    TData extends { node?: any },
    DataType extends string,
    TVariables extends Variables = Variables
>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    type: DataType,
    ...variables: VariablesAndRequestHeadersArgs<TVariables>
): Promise<NodeReturnType<TData, DataType>> {
    const data = await requestThrow(query, ...variables);
    const node = data.node;
    if (!node) {
        throw new Error("Node not found");
    }
    return data.node as NodeReturnType<TData, DataType>;
}

type NodeReturnType<TData extends { node?: any }, DataType extends string> = Extract<
    NonNullable<TData["node"]>,
    { __typename?: DataType }
>;

export type { NodeReturnType };
