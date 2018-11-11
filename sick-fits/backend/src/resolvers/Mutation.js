//This is our Mutators/Setters/Resolvers Logic File

// initializing and importing bcrypt.js for hashing/salting user passwords
const bcrypt = require("bcryptjs");
// initializing and importing json web token library for user jwt sessions
const jwt = require("jsonwebtoken");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    // setup as a promise so if we want the item object to update properly we set createItem function as an async and await the item
    // alternatively we can just return the promise for item out the gate, but the sake of readability and reusability establishing it as a variable is better
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    console.log(item);

    return item;
  },

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
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id title }`);
    // 2. Check if they own that item, or have the permissions'
    // TODO
    // 3. Delete it 💥
    return ctx.db.mutation.deleteItem({ where }, info);
  },
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
          permissions: { set: ["USER"] }
        }
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
  }
};

module.exports = Mutations;
