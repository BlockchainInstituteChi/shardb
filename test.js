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

  console.log('user.getFileName', users.getFileName('alex'));

  console.log('getting users');
  const USERS = await users.getFiles();
  console.log('user.files', USERS);

  var newUser = {
    issuer: 'did:ethr:0x1003c7Cb960BC6c476c1BD6e33F13dbC96eHS271',
    email: 'alex@test.com',
  };

  await users.createFile(newUser);

  var newestUser = await users.getFile(newUser.issuer);

  console.log(newestUser);

  // update user
  var updatedUser = await users.updateFile(newestUser.issuer, {
    email: 'alex@tests.com',
  });

  var newestUser = await users.getFile(newUser.issuer);

  console.log(newestUser);

  await users.deleteFile(newUser.issuer);

  var newestUser = await users.getFile(newUser.issuer);

  if (!newestUser === false) {
    console.log('user deletion failed', newestUser);
  } else {
    console.log('user deleted successfully!');
  }

  await users.selfDestruct();
}
