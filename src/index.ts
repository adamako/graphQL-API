const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    info: () => `This is the API of a HackerNews Clone`,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany();
    },
    link: async (parent, args, context) => {
      return await context.prisma.link.findUnique({
        where: {
          id: parseInt(args.id),
        },
      });
    },
  },
  Mutation: {
    post: async (parent, args, context) => {
      return context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
    },
    updateLink: async (parent, args, context) => {
      return await context.prisma.link.update({
        where: {
          id: parseInt(args.id),
        },
        data: {
          description: args.description,
          url: args.url,
        },
      });
    },

    deleteLink: async (parent, args, context) => {
      return await context.prisma.link.delete({
        where: {
          id: parseInt(args.id),
        },
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
