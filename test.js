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
