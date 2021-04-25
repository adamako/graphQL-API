const { APP_SECRET } = require("../utils");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const post = async (parent, args, context, info) => {
  const { userId } = context;

  return context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
};

const updateLink = async (parent, args, context) => {
  return await context.prisma.link.update({
    where: {
      id: parseInt(args.id),
    },
    data: {
      description: args.description,
      url: args.url,
    },
  });
};

const deleteLink = async (parent, args, context) => {
  return await context.prisma.link.delete({
    where: {
      id: parseInt(args.id),
    },
  });
};

const signup = async (parent, args, context) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

const login = async (parent, args, context) => {
  const user = await context.prisma.user.findUnique({
    where: {
      email: args.email,
    },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

module.exports = {
  signup,
  login,
  updateLink,
  deleteLink,
  post,
};
