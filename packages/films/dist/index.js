var __defineProperty = Object.defineProperty;
var __hasOwnProperty = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => {
  return __defineProperty(target, "__esModule", {value: true});
};
var __exportStar = (target, module2) => {
  __markAsModule(target);
  if (typeof module2 === "object" || typeof module2 === "function") {
    for (let key in module2)
      if (!__hasOwnProperty.call(target, key) && key !== "default")
        __defineProperty(target, key, {get: () => module2[key], enumerable: true});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defineProperty({}, "default", {value: module2, enumerable: true}), module2);
};
const apollo_server = __toModule(require("apollo-server"));
const federation = __toModule(require("@apollo/federation"));
const data = __toModule(require("./data"));
const jsonPlaceHolder = __toModule(require("./datasources/jsonPlaceHolder"));
const port = 4002;
const typeDefs = apollo_server.gql`
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
`;
const resolvers = {
  Film: {
    actors(film) {
      return film.actors.map((actor) => ({__typename: "Person", id: actor}));
    },
    director(film) {
      return {__typename: "Person", id: film.director};
    }
  },
  Person: {
    async appearedIn(person, {id}, {dataSources}) {
      const response = await dataSources.JSONPlaceholer.getMovie("1");
      console.log({person, response});
      return data.films.filter((film) => film.actors.find((actor) => actor === person.id));
    },
    directed(person) {
      return data.films.filter((film) => film.director === person.id);
    }
  },
  Query: {
    film(_, {id}) {
      return data.films.find((film) => film.id === id);
    },
    films() {
      return data.films;
    }
  }
};
const server = new apollo_server.ApolloServer({
  schema: federation.buildFederatedSchema([{typeDefs, resolvers}]),
  dataSources: () => ({
    JSONPlaceholer: new jsonPlaceHolder.default()
  })
});
server.listen({port}).then(({url}) => {
  console.log(`Films service ready at ${url}`);
});
