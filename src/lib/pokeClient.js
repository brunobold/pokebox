import { ApolloClient, InMemoryCache } from "@apollo/client";

const pokeApiClient = new ApolloClient({
  uri: "https://beta.pokeapi.co/graphql/v1beta",
  cache: new InMemoryCache(),
});

export default pokeApiClient;
