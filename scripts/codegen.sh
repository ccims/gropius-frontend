#!/usr/bin/env bash
#
# Regenerates src/gql from the API schema.
#
# Introspection is rejected by an authenticated backend, so this needs an api-public started with
# GROPIUS_API_PUBLIC_DEBUG_NO_AUTHENTICATION=true. If one already answers on the codegen port it is
# used as is, otherwise a throwaway one is started from the testing compose file and removed again.
# The services it depends on, like neo4j, are left running.
#
# Arguments are passed on to graphql-codegen, so `npm run codegen -- --watch` keeps regenerating
# while the backend stays up.
set -euo pipefail

cd "$(dirname "$0")/.."

# has to match the schema URL in codegen.ts
PORT=8082
CONTAINER=gropius-codegen-api
COMPOSE_FILE=../docker-compose-testing.yaml

api_is_up() {
    curl -sf -m 2 -o /dev/null "http://localhost:$PORT/health"
}

started_api=false
cleanup() {
    if [ "$started_api" = true ]; then
        echo "Removing the codegen API..."
        docker rm -f "$CONTAINER" > /dev/null 2>&1 || true
    fi
}
trap cleanup EXIT

if api_is_up; then
    echo "Using the API already listening on port $PORT."
else
    if [ ! -f "$COMPOSE_FILE" ]; then
        echo "No API on port $PORT, and $COMPOSE_FILE does not exist." >&2
        echo "Clone the frontend as part of the gropius superrepository, or start an api-public" >&2
        echo "with GROPIUS_API_PUBLIC_DEBUG_NO_AUTHENTICATION=true on port $PORT yourself." >&2
        exit 1
    fi

    echo "Starting an api-public without authentication on port $PORT (the first run builds it)..."
    if ! docker compose -f "$COMPOSE_FILE" run --rm -d --name "$CONTAINER" -p "$PORT:8080" \
        -e GROPIUS_API_PUBLIC_DEBUG_NO_AUTHENTICATION=true api-public > /dev/null; then
        echo >&2
        echo "Could not start the codegen API. Its dependencies bind the ports of the testing stack," >&2
        echo "so this fails if you already run a database of your own on them. In that case start an" >&2
        echo "api-public with GROPIUS_API_PUBLIC_DEBUG_NO_AUTHENTICATION=true on port $PORT yourself," >&2
        echo "against whatever database you use - this script picks up one that already listens there." >&2
        exit 1
    fi
    started_api=true

    printf "Waiting for it to answer"
    for _ in $(seq 90); do
        if api_is_up; then break; fi
        printf "."
        sleep 2
    done
    printf "\n"

    if ! api_is_up; then
        echo "The API did not come up, its log follows:" >&2
        docker logs "$CONTAINER" >&2 || true
        exit 1
    fi
fi

npx graphql-codegen --config codegen.ts "$@"
