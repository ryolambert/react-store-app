const mutations = {
  createDog(parent, args, ctx, info) {
    // DO NOT DO THIS IN PRODUCTION, just testing around the logic and params
    global.dogs = global.dogs || [];
    // creates the dog here line below is just seeing if the mutation is taking
    const newDog = { name: args.name };
    global.dogs.push(newDog);
    return newDog;
    // console.log(args);
    
  },
};

module.exports = mutations;
