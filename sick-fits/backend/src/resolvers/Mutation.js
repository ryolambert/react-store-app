const mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    // setup as a promise so if we want the item object to update properly we set createItem function as an async and await the item
    // alternatively we can just return the promise for item out the gate, but the sake of readibility and reusability establishing it as a variable is better
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info);

    return item;
  }
  // createDog(parent, args, ctx, info) {
  //   // DO NOT DO THIS IN PRODUCTION, just testing around the logic and params
  //   global.dogs = global.dogs || [];
  //   // creates the dog here line below is just seeing if the mutation is taking
  //   const newDog = { name: args.name };
  //   global.dogs.push(newDog);
  //   return newDog;
  //   // console.log(args);
    
  // },
};

module.exports = mutations;
