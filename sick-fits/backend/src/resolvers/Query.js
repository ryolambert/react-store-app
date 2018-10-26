//where all of our database calls are going to be made
// Note: if the query is exactly the same within prisma and yoga with no custom logic needed you can just forward the query from yoga to prisma.

// Note: prisma-binding gives us the ability to query out database
const { forwardTo } = require('prisma-binding');

const Query = {
  //helpful in creating a quick mockup, can forward all the apis and work backwards
    items: forwardTo('db'),
  // async items(parent, args, ctx, info) {
  //   // A O.K. to return a promise from a resolver, smart enough to infer but for the sake of consistency, readability, etc. setting it in a variable
  //   // return ctx.db.query.item();
  //   console.log('Getter\' Items!!! 🐱‍🏍')
  //   const items = await ctx.db.query.items();
  //   return items;
  // },
};

module.exports = Query;
