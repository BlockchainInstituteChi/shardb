const shardb = require('./index.js');
var userDir = __dirname + '/users/';
console.log(userDir);
var users = new shardb({
  dir: userDir,
  identifier: 'issuer', // this is your primary key for object retrieval
  format :  {
    issuer: "text",
    email: "text"
  },
  ops : { // ops are for utility functions, and can be accessed under the db object 
    sayTen : function () {
      console.log('Method test 10')
    },
    sayN : function (n) {
      console.log('Method test n: ', n)
    },
    countRecords : async function () {
      var allUsers = await users.get() // runs in the current context ** 
      console.log('Method countAll: ', allUsers.length)
    }
  }, 
  methods : {
    sayHi : function () {
      console.log('hi!')
    },
    sayMyId : function () {
      
    }
  }
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


  console.log('Method tests', users.ops)
  users.ops.sayTen()
  users.ops.sayN('11')
  users.ops.countRecords()

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
