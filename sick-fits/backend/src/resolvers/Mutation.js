const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    // setup as a promise so if we want the item object to update properly we set createItem function as an async and await the item
    // alternatively we can just return the promise for item out the gate, but the sake of readability and reusability establishing it as a variable is better
    const item = await ctx.db.mutation.createItem({
      data: {
        ...args
      }
    }, info);

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
          id: args.id,
        },
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
  }
};

module.exports = Mutations;
