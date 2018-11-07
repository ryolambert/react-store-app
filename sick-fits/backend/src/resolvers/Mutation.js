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
        wehre: {
          id: args.id,
        },
      },
      info
    );
  },
};

module.exports = mutations;
