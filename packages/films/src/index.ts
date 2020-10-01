import { ApolloServer, gql } from 'apollo-server'
import { buildFederatedSchema } from '@apollo/federation'

import { films } from './data'
import JsonPlaceHolderAPI from './datasources/jsonPlaceHolder'

const port = 4002

const typeDefs = gql`
  type Film {
    id: ID!
    title: String
    actors: [Person]
    director: Person
  }

  extend type Person @key(fields: ["id"]) {
    id: ID! @external
    appearedIn: [Film]
    directed: [Film]
  }

  extend type Query {
    film: Film
    films: [Film]
  }
`

const resolvers = {
  Film: {
    actors(film) {
      return film.actors.map((actor) => ({ __typename: "Person", id: actor }));
    },
    director(film) {
      return { __typename: "Person", id: film.director };
    }
  },
  Person: {
    async appearedIn(person, { id }, { dataSources }) {
      const response = await dataSources.JSONPlaceholer.getMovie('1')
      console.log({ person, response })
      return films.filter((film) =>
        film.actors.find((actor) => actor === person.id)
      );
    },
    directed(person) {
      return films.filter((film) => film.director === person.id);
    }
  },
  Query: {
    film(_, { id }) {
      return films.find((film) => film.id === id);
    },
    films() {
      return films;
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  dataSources: () => ({
    JSONPlaceholer: new JsonPlaceHolderAPI()
  })
});

server.listen({ port }).then(({ url }) => {
  console.log(`Films service ready at ${url}`);
});
