//where all of our database calls are going to be made
const Query = {
  dogs(parent, args, ctx, info) {
    global.dogs = global.dogs || [];
    return global.dogs;
    // return [{name: 'Kota'}, {name: 'Emi'}];
  },
};

module.exports = Query;
