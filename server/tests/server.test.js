
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {Group} = require('./../models/group');
const {Lift} = require('./../models/lift');
const {User} = require('./../models/user');

const {app} = require('./../server');
const {populateGroups, populateUsers, populateLifts, populateCities, populatePerms, users, groups, lifts, cities, dateLift1, perms} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateGroups);
beforeEach(populateCities);
beforeEach(populateLifts);
beforeEach(populatePerms);

describe('POST /groups', () => {
  it('should create a new group', (done) => {

    var name = 'groupAAA';
    var description = 'descriptionAAA';
    var body = {
      name, description
    }
    request(app)
      .post('/groups')
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(name);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Group.find({name}).then((groups) => {
          expect(groups.length).toBe(1);
          expect(groups[0].name).toBe(body.name);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create group with name that is to short', (done) => {

    var name = '1';
    var description = 'descriptionAAA';
    var body = {
      name, description
    }
    request(app)
      .post('/groups')
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Group.find().then((groups) => {
          expect(groups.length).toBe(groups.length);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create group with missing description', (done) => {

    var name = '1234';
    var body = {
      name
    }
    request(app)
      .post('/groups')
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Group.find().then((groups) => {
          expect(groups.length).toBe(groups.length);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /groups', () => {
  it('should get all groups of user', (done) => {
    request(app)
      .get('/groups')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.groups.length).toBe(2);
      })
      .end(done);
  });
});


describe('GET /groups/:id', () => {
  it('should return group with specified id', (done) => {
    request(app)
      .get(`/groups/${groups[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(groups[0].name);
      })
      .end(done);
  });

  it('should return 404 if group not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/groups/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/groups/123abc')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


describe('GET /groups/search/:query', () => {
  it('should return groups that answer search cirteria', (done) => {
    request(app)
      .get(`/groups/search/gro`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(groups.length);
      })
      .end(done);
  });

  it('should return no groups because no groups contain the query', (done) => {
    request(app)
      .get(`/groups/search/jjj`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(0);
      })
      .end(done);
  });
});

describe('DELETE /groups/:id', () => {
  it('should remove a group', (done) => {
    var hexId = groups[0]._id.toHexString();

    request(app)
      .delete(`/groups/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.group.id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Group.findById(hexId).then((group) => {
          expect(group).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should fail to remove a group that user is not manager of', (done) => {
    var hexId = groups[0]._id.toHexString();

    request(app)
      .delete(`/groups/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Group.findById(hexId).then((group) => {
          expect(group).toExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if group id is invalid', (done) => {
    request(app)
      .delete('/groups/123abc')
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});


describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';
    var name = "gregory"

    request(app)
      .post('/users')
      .send({email, password, name})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!',
        name:'gregory'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('POST /lifts', () => {
  it('should create a new lift', (done) => {

    request(app)
      .post('/lifts')
      .set('x-auth', users[0].tokens[0].token)
      .send(lifts[0])
      .expect(200)
      .expect((res) => {
        expect(res.body.origin_city.toString()).toBe(lifts[0].origin_city.toString());
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Lift.find({origin_city:lifts[0].origin_city}).then((lifts) => {
          expect(lifts.length).toBe(1);
          expect(lifts[0].destination_street).toBe(lifts[0].destination_street);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not be able to create lift in group that user does not belong to', (done) => {

    request(app)
      .post('/lifts')
      .set('x-auth', users[1].tokens[0].token)
      .send(lifts[0])
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Lift.find().then((lifts) => {
          expect(lifts.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});


describe('GET /lifts', () => {
  it('should find lifts in time frame', (done) => {

    var body = lifts[0];
    var lift1 = new Lift(body);
    lift1.save()
    .then((result) => {
      request(app)
        .get('/lifts')
        .set('x-auth', users[0].tokens[0].token)
        .query({
          origin_city: cities[0]._id.toString(),
          destination_city: cities[1]._id.toString(),
          from_time: dateLift1 - 100,
          till_time: dateLift1 + 100
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    })
  });

  it('should not find lifts that exist, but not for any of the groups the user is in', (done) => {

    var body = lifts[0];
    var lift1 = new Lift(body);
    lift1.save()
    .then((result) => {
      request(app)
        .get('/lifts')
        .set('x-auth', users[1].tokens[0].token)
        .query({
          origin_city: cities[0]._id.toString(),
          destination_city: cities[1]._id.toString(),
          from_time: dateLift1 - 100,
          till_time: dateLift1 + 100
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(0);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    })
  });

  it('should not find lifts that do not exist in time frame', (done) => {

    var body = lifts[0];
    var lift1 = new Lift(body);
    lift1.save()
    .then((result) => {
      request(app)
        .get('/lifts')
        .set('x-auth', users[0].tokens[0].token)
        .query({
          origin_city: cities[0]._id.toString(),
          destination_city: cities[1]._id.toString(),
          from_time: dateLift1 + 100,
          till_time: dateLift1 + 200
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(0);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    })
  });

  it('should not find lifts that do not exist origin and destination city', (done) => {

    var body = lifts[0];
    var lift1 = new Lift(body);
    lift1.save()
    .then((result) => {
      request(app)
        .get('/lifts')
        .set('x-auth', users[0].tokens[0].token)
        .query({
          origin_city: cities[1]._id.toString(),
          destination_city: cities[0]._id.toString(),
          from_time: dateLift1 - 100,
          till_time: dateLift1 + 100
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(0);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    })
  });
});


describe('GET /perms', () => {
  it('should return all permissions request to the manger of the group', (done) => {

    request(app)
      .get('/perms')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('should accpet perm request', (done) => {
    var body = {
      group_id:perms[0]._group,
      applicant_id: perms[0]._applicant
    }

    request(app)
      .post('/perms/accept')
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(200)
      .expect((res) => {

      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Group.find().then((groups) => {
          expect(groups[0].members.length).toBe(1);
          expect(groups[0].members[0].toString()).toBe(body.applicant_id.toString());
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject perm request', (done) => {
    var body = {
      group_id:perms[0]._group,
      applicant_id: perms[0]._applicant
    }

    request(app)
      .post('/perms/reject')
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect(200)
      .expect((res) => {

      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Group.find().then((groups) => {
          expect(groups[0].members.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });



});
