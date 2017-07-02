require('../server/config/config');
var moment = require('moment');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('../server/db/mongoose');
// var {Todo} = require('./models/todo');
var {Group} = require('../server/models/group');
var {User} = require('../server/models/user');
var {Lift} = require('../server/models/lift');
var {City} = require('../server/models/city');



  var body = {name: "shaya", email:"shaya@gmail.com", password:"123456"}
  var user = new User(body);
  console.log('im starting');


var everybody = [];
var saveUserPromise = function (name, email, password, pic, exclude){

  var user = new User({name, email, password, pic});

  return user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    if (exclude){

    }else{

      everybody.push(user._id);

    }

    return {id: user._id, name: user.name};

  }).catch((e) => {
    console.log(name, 'error');
    return e;
  })
}
let shaya;
let simcha;
let imm;
let bina;
let shula;
let shmulkiz;
let thisGroup;

const { users, groups,lifts, cities } = mongoose.connection.collections;
users.drop(() => {
  groups.drop(() => {
    lifts.drop(() => {


      return Promise.all
      ([
        saveUserPromise("scorpion", "scorpion@gmail.com", "123456", "https://goo.gl/84uF8W", true),
        saveUserPromise("sonya", "sonya@gmail.com", "123456", "https://goo.gl/zRycqf"),
        saveUserPromise("subzero", "subzero@gmail.com", "123456", "https://goo.gl/FsYTU8"),
        saveUserPromise("raiden", "raiden@gmail.com", "123456", "https://goo.gl/WYPW8k"),
        saveUserPromise("reptile", "reptile@gmail.com", "123456", "https://goo.gl/taZsEb"),
        saveUserPromise("goro", "goro@gmail.com", "123456", "https://goo.gl/gBZ3rq"),
        saveUserPromise("liu kang", "liukang@gmail.com", "123456", "https://goo.gl/wb3zfh"),

        saveUserPromise("john", "john@gmail.com", "123456", "https://goo.gl/YuvrnW"),
        saveUserPromise("paul", "paul@gmail.com", "123456", "https://goo.gl/D9nvC6"),
        saveUserPromise("richard", "richard@gmail.com", "123456", "https://goo.gl/hcmmzd"),
        saveUserPromise("george", "george@gmail.com", "123456", "https://goo.gl/LckHu9"),

        saveUserPromise("roger", "roger@gmail.com", "123456", "https://goo.gl/2T39Wr"),
        saveUserPromise("david", "david@gmail.com", "123456", "https://goo.gl/mpc9Xm"),
        saveUserPromise("wright", "wright@gmail.com", "123456", "https://goo.gl/tB8Bdm"),
        saveUserPromise("nick", "nick@gmail.com", "123456", "https://goo.gl/nrNcqf"),

        saveUserPromise("slash", "slash@gmail.com", "123456", "https://pbs.twimg.com/profile_images/798266237197250562/GEZqHLiW.jpg"),
        saveUserPromise("axl", "axl@gmail.com", "123456", "https://goo.gl/s4H9st"),
        saveUserPromise("adler", "adler@gmail.com", "123456", "https://goo.gl/xy8Zhs"),
        saveUserPromise("duff", "duff@gmail.com", "123456", "https://goo.gl/4FctND"),
        saveUserPromise("izzy", "izzy@gmail.com", "123456", "https://goo.gl/gu6jSb"),

        saveUserPromise("fred", "fred@gmail.com", "123456", "https://goo.gl/AQw9UZ"),
        saveUserPromise("wilma", "wilma@gmail.com", "123456", "https://goo.gl/qXFPv4"),
        saveUserPromise("barney", "barney@gmail.com", "123456", "https://goo.gl/ocK7e3"),
        saveUserPromise("betty", "betty@gmail.com", "123456", "https://goo.gl/AGh2SX"),
        saveUserPromise("daffy", "daffy@gmail.com", "123456", "https://goo.gl/cLpVSX"),
        saveUserPromise("bugs", "bugs@gmail.com", "123456", "http://www.toonopedia.com/bugs.jpg"),
        saveUserPromise("elmo", "elmo@gmail.com", "123456", "https://goo.gl/U6p8WZ"),
        saveUserPromise("tweety", "tweety@gmail.com", "123456", "https://goo.gl/jY4grq")


      ])
      .then((result) => {
         shaya = result.filter((u) => {
          return (u.name === 'scorpion')
        })[0];

        let group = new Group({
          name: "tel aviv uni",
          description: "ajzner dudes",
          pic: "https://goo.gl/i2RQ6m",
          _manager: shaya.id
        });

        let group2 = new Group({
          name: "john becky wedding",
          description: "love da beatles ",
          pic: "https://goo.gl/XN1k8v",
          _manager: shaya.id
        });


        return Promise.all([group.save(), group2.save()]);
        // return group.save();
      }).then((groups) => {
        var group = groups[0];
        var group2 = groups[1];

        return Promise.all([
          Group.findOneAndUpdate({_id: group._id, 'members': {$nin: everybody}}, {$push: {members: {$each: everybody}}}),
          Group.findOneAndUpdate({_id: group2._id, 'members': {$nin: everybody}}, {$push: {members: {$each: everybody}}})
        ]);

      }).then((groups) => {
        if (!groups) {
          console.log('error');
        }
        thisGroup = groups[0];

        return Promise.all([
        onDoneFillingDb(thisGroup, "2017-07-02 15:30", "king david 12", "rothshild 43","Be on time or I will kill you!", 0 , 4, 5 ,6)
        ,onDoneFillingDb(thisGroup, "2017-07-02 14:30", "ben gurion 4", "alenbi 56", "air conditioning is blazing", 1 , 2, 3)
        ,onDoneFillingDb(thisGroup, "2017-07-02 15:30", "king david 12", "rothshild 43","", 4 , 5, 6 ,7),

        ,onDoneFillingDb(thisGroup, "2017-07-02 20:10", "akiva 43", "shvarts 121","we'll be listening to dark side of the moon",  2 , 12, 3 ,3),
        ,onDoneFillingDb(thisGroup, "2017-07-02 19:20", "achuza 22", "habonim 1","", 17 , 6),
        ,onDoneFillingDb(thisGroup, "2017-07-02 20:30", "borochov 252", "bar ilan 772", "I am the red skoda", 3 , 14, 8 ),
        ,onDoneFillingDb(thisGroup, "2017-07-02 17:30", "jerusalem", "rokchim 34","", 14 , 15, 16 ,18),
        ,onDoneFillingDb(thisGroup, "2017-07-02 18:30", "hachayil 55", "rachbal 88", "driving 140 kph so don't say you weren't told", 16 , 19),
        ,onDoneFillingDb(thisGroup, "2017-07-02 19:15", "akiva 112", "rashi 11","", 3 , 15, 10 ,8),

        ,onDoneFillingDb(thisGroup, "2017-07-02 19:45", "boker 112", "rashi 11","", 21 , 22, 3 ,23),
        ,onDoneFillingDb(thisGroup, "2017-07-02 19:20", "lechi 112", "tikva 11","", 24 , 26, 25 ,0),
        ,onDoneFillingDb(thisGroup, "2017-07-02 13:45", "etzel 112", "hape 11","", 0 , 23, 11 ,14),
        ,onDoneFillingDb(thisGroup, "2017-07-02 14:15", "nachal 112", "achidak 11","loony toones everyone", 2 , 3, 22 ,15),

        ,onDoneFillingDb(thisGroup, "2017-07-02 16:00", "walengerb 5", "begin 22","", 6 , 1, 11 ,12)])

      }).then((user) => {
        console.log('done!');
      }).catch((e) => {
        console.log(e);
      })
    })
  })

});



//http://stackoverflow.com/questions/25101386/many-to-many-relationship-with-nosql-mongodb-and-mongoose
var onDoneFillingDb = function(group, date, origin_street, destination_street, message, owner, rider1, rider2, rider3){



  City.find()
  .then((cities) => {

    var timestamp = moment(date, "YYYY/MM/DD HH:mm").unix();
    // console.log(everybody);
    var body = {
        destination_street,
        destination_city: cities[0]._id,
        origin_street,
        origin_city: cities[1]._id,
       _owner: everybody[owner],
       description: message,
       capacity: 5,
       groups: [group._id],
       leave_at: timestamp
    }

    var createArr = () => {
      var arr = [];
      arr.push(everybody[rider1])

      if (rider2){
        arr.push(everybody[rider2])
      }

      if (rider3){
        arr.push(everybody[rider3])
      }

      return arr
    }

    var lift = new Lift(body);
    var arr = createArr();
    return lift.save()
    .then((lift) => {
      // return Lift.findOneAndUpdate({_id: lift._id, 'riders': {$ne: imm.id}}, {$push: {riders: imm.id}}, {runValidators: true})

      return Lift.findOneAndUpdate({_id: lift._id, 'riders': {$nin: arr}}, { $push: {riders: {$each: arr}}}, {runValidators: true});
    })
    .then((lift) => {
      console.log('DONE!!!@@@###');
    }).catch((e) => {
      console.log(e);
    });
  }, (e) => {
    console.log(e);
  });





  // console.log(body);
}















//
