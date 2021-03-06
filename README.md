*This repo is in development - use at your own risk, and feel free to help :)*

### TO-DO:
1. Add filter support for collection.get()
2. Add dynamic classes for collection creation
3. Extend dynamic classes with methods
4. Incorporate search / indexing of some sort (hash table, maybe?)

# Shard DB (shardb for short!)
If you're building a decentralized app, and you need a simple database to offer you basic storage, in any location you choose, you can use SharDB to generate JSON flat file databases and specify storage locations on the fly.

Install with `npm i shardb` and get started!

## Initializing a Module
Check the test.js file in this repository for a full rundown, but the gist is, you can just import and create an instance of SharDB for each collection you want to track. 

For each collection, you'll need to specfy both a folder name and an 'identifier' parameter. 

For a user model, that might look something like this:
```
const shardb = require('shardb')
var userDir = __dirname + "/users/"
console.log(userDir)
var users = new shardb({
    dir: userDir,
    identifier: "issuer"
})
```
The 'identifier' should be the name of the parameter in the object which will act as the primary key. All database records must have a value for this field. 

Now, each new object in your database will receive a single JSON file, and you can call and search them using the `users` collection objects created in the statements above.

Piece of cake, right?

## The Constructor
As you can see in the last example, you just need to pass a folder name and an identifier to instantiate the database.

## Manipulating Records
The shardb object supports the following operations. The example below shows the full create, delete, clear, flow for a simple user with a DID. (see test.js for example)

```
const shardb = require('./index.js');
var userDir = __dirname + '/users/';
console.log(userDir);
var users = new shardb({
  dir: userDir,
  identifier: 'issuer',
});

module.exports = {test: testAll};

async function testAll() {
  console.log(users);

  console.log('getting users');
  const USERS = await users.get();
  console.log('user.files', USERS);

  var newUser = {
    issuer: 'did:ethr:0x1003c7Cb960BC6c476c1BD6e33F13dbC96eHS271',
    email: 'alex@weteachblockchain.org',
  };

  await users.create(newUser);

  var newestUser = await users.getOne(newUser.issuer);

  console.log('created new user!', newestUser); // will print null - this is correct

  // update user
  var updatedUser = await users.update(newestUser.issuer, {
    email: 'alex@tests.com',
  });

  var newestUser = await users.getOne(newUser.issuer);

  console.log('updated user', newestUser);

  await users.delete(newUser.issuer);

  var newestUser = await users.getOne(newUser.issuer);

  if (!newestUser === false) {
    console.log('user deletion failed', newestUser);
  } else {
    console.log('user deleted successfully!');
  }

  await users.selfDestruct();
}

```

