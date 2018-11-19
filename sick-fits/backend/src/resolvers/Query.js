// * Where all of our database calls are going to be made
// ! The query is exactly the same within prisma and yoga with no custom logic needed you can just forward the query from yoga to prisma.

// ^ 📝: prisma-binding gives us the ability to query out database
const { forwardTo } = require('prisma-binding');

const Query = {
  // helpful in creating a quick mockup, can forward all the apis and work backwards
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  // * Me Method: pulls in user data created in our schema, defined here
  // ^ SYNTAX TIP: example(param1, param2, param3) ES6 shorthand for example: function(param1, param2, param3)
  me(parent, args, ctx, info) {
    // * Current User Check:
    // Pulls from the context request for user ID if there isn't a logged in User
    if (!ctx.request.userId) {
      // ! Returns null because users may not be logged in
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      // ^ 📝 info: is the query returned from the client-side
      // Passed in so our query just sends info we need as opposed to the entire user's info like every cart item, etc.
      info
    );
  },
};

module.exports = Query;
