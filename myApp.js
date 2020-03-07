//Requiring/imprting the mongoose module.
const mongoose = require("mongoose");

//Connecting to the MongoDB. "MONGO_URI" is where I have saved my MongoDB URI which in this case
//is in the MongoDB Atlas .
mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

var Schema = mongoose.Schema;

//Creating a new Schema
var personSchema = new Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
});

//Creating a new Model from the schema
var Person = mongoose.model("Person", personSchema);

//Creating a new object from the Person model and saving it in Mongo.
var createAndSavePerson = function(done) {
  var john = new Person({
    name: "john",
    age: 43,
    favoriteFoods: ["bears", "beets"]
  });

  john.save(function(err, data) {
    if (err) return done(err);
    done(null, data);
  });
};

//Inserting multiple records
var arrayOfPeople = [
  { name: "Sanjiv", age: 26, favoriteFoods: ["water", "air"] },
  { name: "Jyotish", age: 25, favoriteFoods: ["beers", "soyabeans"] },
  { name: "Adu", age: 15, favoriteFoods: ["potato", "tomato"] }
];

var createManyPeople = function(arrayOfPeople, done) {
  Person.create(arrayOfPeople, function(err, data) {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
};

//Finding by a key. personName is the being passed to the function with the person's name.
var findPeopleByName = function(personName, done) {
  Person.find({ name: personName }, function(err, data) {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
};

//Finding one record using a key.
var findOneByFood = function(food, done) {
  Person.findOne({ favoriteFoods: food }, function(err, data) {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
};

//Finding a record(unique) using _id.
var findPersonById = function(personId, done) {
  Person.findById({ _id: personId }, function(err, data) {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
};

//Finding and saving a record.
var findEditThenSave = function(personId, done) {
  var foodToAdd = "hamburger";

  Person.findById({ _id: personId }, function(err, data) {
    data.favoriteFoods.push(foodToAdd);
    data.save(function(err, data) {
      if (err) {
        return done(err);
      }
      done(null, data);
    });
  });
};

//A function to finding and updating a record.
var findAndUpdate = function(personName, done) {
  var ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet },
    { new: true },
    function(err, data) {
      if (err) {
        return done(err);
      }
      done(null, data);
    }
  );
};

//Deleting a record(unique) using _id.
var removeById = function(personId, done) {
  Person.findOneAndRemove({ _id: personId }, function(err, data) {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
};

//Deleting a record(unique) using a key.
var removeManyPeople = function(done) {
  var nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, function(err, data) {
    if (err) {
      return done(err);
    }
    done(null, data);
  });
};

//Chaining multiple queries.
var queryChain = function(done) {
  var foodToSearch = "burrito";

  var findBurrito = Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select("-age");
  findBurrito.exec(function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

//Exports
exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
