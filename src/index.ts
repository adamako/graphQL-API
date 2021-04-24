const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `This is the API of a HackerNews Clone`,
    feed: () => links,
    idCount: () => idCount,
    link: (parent, args) => {
      let elementIndex = links.findIndex((link) => link.id === args.id);
      return links[elementIndex];
    },
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      let getLinkIndex = links.findIndex((link) => link.id === args.id);
      links[getLinkIndex].id = args.id;
      links[getLinkIndex].url = args.url;
      links[getLinkIndex].description = args.description;

      return links[getLinkIndex];
    },

    deleteLink: (parent, args) => {
      links = links.filter((link, index) => link.id != args.id);
      return links;
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
