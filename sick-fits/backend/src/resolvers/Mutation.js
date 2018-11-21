// !! This is our Mutators/Setters/Resolvers Logic File

// * Library imports
// initializing and importing bcrypt.js for hashing/salting user passwords
const bcrypt = require('bcryptjs');
// initializing and importing json web token library for user jwt sessions
const jwt = require('jsonwebtoken');
// initializing and importing crypto library function randomBytes (crypto- built in module in node)
const { randomBytes } = require('crypto');
// initializing and importing promisify utility to convert randomBytes from a callback to a promise for better compatibility as an async module
const { promisify } = require('util');

const Mutations = {
  // * CreateItem Resolver
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    // setup as a promise so if we want the item object to update properly we set createItem function as an async and await the item
    // alternatively we can just return the promise for item out the gate, but the sake of readability and reusability establishing it as a variable is better
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info
    );

    console.log(item);

    return item;
  },

  // * UpdateItem Resolver
  updateItem(parent, args, ctx, info) {
    // First we take a copy of the updates
    const updates = { ...args };
    // Then remove the ID from the updates
    delete updates.id;
    // Finally, we run the update
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info
    );
  },

  // * DeleteItem Resolver
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id title }`);
    // 2. Check if they own that item, or have the permissions'
    // TODO
    // 3. Delete it 💥
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  // * SignUp Resolver
  async signup(parent, args, ctx, info) {
    // 1️⃣. Sets user email input to lowercase
    args.email = args.email.toLowerCase();
    /* 2️⃣. Hash/Salt user password using a one-way hash (Using bcrypt.js)
      Example Hash: 
      On Signup Password: hash('password123') -> 3mj4h23j42khj23h4k2342134jkhvjkdf
      On Signin Password: hash('password123') === 3mj4h23j42khj23h4k2342134jkhvjkdf
    */
    // ‼ signup is an asynchronous function and as such needs to be awaited
    // bcrypt.hash(password input (string), salting length (int))
    const password = await bcrypt.hash(args.password, 10);
    // 3️⃣. Creating user in the database
    // createUser function pulled from our prisma.graphQl generated file
    // createUser(passing in data, passing info(So we know what data to return to the client))
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          // Passing in a spread op for args then overwriting password
          //   name: args.name,
          //   email: args.email,
          ...args,
          password,
          // Setting permissions, but because we are reaching out to an external enum(enumerator) we cannot just set it as:
          // permissions: ['USER']
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    // 4️⃣. Creating the JSON Web Token(JWT) for the user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 5️⃣. Setting the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie calc
    });
    // 6️⃣. Lastly, return user to the browser
    return user;
  },

  // * SignIn Resolver
  async signin(parent, { email, password }, ctx, info) {
    // 1️⃣. Verify if there is a user with inputted email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2️⃣. Verify if that password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error(`Invalid Password!`);
    }
    // 3️⃣. Generate the JWT token for user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // 4️⃣. Set the cookie with token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie calc
    });
    // 5️⃣. Return the user
    return user;
  },

  // * SignOut Resolver
  signout(parent, args, ctx, info) {
    // ^ cookieParser library method from our express middleware setup in index.js
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },

  // * ResetRequest Resolver
  async resetRequest(parent, args, ctx, info) {
    // 1️⃣. Verify if user is real
    const user = await ctx.db.query.user({ where: { email: args.email } });
    // If no user is found display error message
    if (!user) {
      throw new Error(`No such user found for email ${args.email}`);
    }
    // 2️⃣. Set reset token and expiry on that user
    // Calling randomBytes setting its length to 20 return the buffer as a hex string wrapped as an awaited converted promise by promisify
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hr from now expiry
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    });
    // ! Development troubleshooting to verify our reset is working 
    // ! 👇 TAKE OUT IN PRODUCTION
    // console.log(res);
    return { message: 'Thanks!' };
    // 3️⃣. Email them reset token
  },

  // * ResetPassword Resolver
  async resetPassword(parent, args, ctx, info) {
    // 1️⃣. Verify if password matches stored user password
    if (args.password !== args.confirmPassword) {
      throw new Error(`Your passwords don't match! 🙈`);
    }
    // 2️⃣. Verify valid reset token

    // 3️⃣. Verify if token is expired
    // ? You can use user and set the datamodel.prisma as @unique for our token, but instead using users query because it has a far more robust input queries on UsersWhereInput
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
    // 4️⃣. Hash new password
    const password = await bcrypt.hash(args.password, 10);
    // 5️⃣. Save new password to the user and remove old reset token fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // 6️⃣. Generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // 7️⃣. Set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // 8️⃣. Return the new user
    return updatedUser;
    // 9️⃣. Beer yoself 🍻
  },
};

module.exports = Mutations;
