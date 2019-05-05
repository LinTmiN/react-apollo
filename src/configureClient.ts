import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { AUTH_TOKEN } from "./constants";
import { onError } from "apollo-link-error";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors || networkError) {
    const messages = graphQLErrors?graphQLErrors
      .map(err => err.message)
      .join(",</br>"):networkError;
    alert(JSON.stringify(messages));
  }
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000"
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
});
const httplinkWithAuth = authLink.concat(httpLink);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  errorLink.concat(httplinkWithAuth)
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});
export default client