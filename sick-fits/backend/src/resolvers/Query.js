const Query = {
  dogs(parent, args, ctx, info) {
    return [{name: 'Kota'}, {name: 'Emi'}];
  },
};

module.exports = Query;
