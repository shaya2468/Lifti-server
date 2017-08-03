# Lifti — Lifts associated with groups

In this document we'll discuss the high level design and the thought process behind Lifti.
To read about what the app does, how to use it and the main flow of the application please see this article [here](https://medium.com/@shayaajzner/test-test-test-67027d263a3b)

### Data Models

### How the models all relate to each other:

![Image of Yaktocat](https://drive.google.com/uc?id=0B_ciQLEjqv8bRDdJUEJtRHRzdG8)

#### User
Simple Entity that represents a user who registered to the system. 

main fields:

1. email
2. password
3. name

#### Group
Represents a secure group, where only a manager can grant other users permission to join.

main fields:

1. name
2. description
3. manager - the user who is the manager of the group
4. members - list of the users, who are members of the group.

#### Lift
A lift can be created by any user, and he may add it to the groups he chooses.

main fields:

1. origin
2. destination
3. capacity - the number of people the owner of the lift can take.
4. leave_at - when does the train leave
5. owner - the user who created the lift
6. groups - the groups that this ride will appear in

#### Permission
A permission request sent by a user, to join a group

main fields:

1. group - the group the user requests to join
2. applicant - the user who wants to join a group

#### City
A list of cities that a user that you can take lifts in. For now it's a hard coded list.

main fields:

1. name -the name of the city


### Authorization/Security:

Bycrypt is used for storing passwords securely.

JWT, with a predefined salt, is used to grant access tokens.
Every time a user dispatches an api, he must send the access token in the header, which will be verified on the server and used to identify the user.


### Public api's



    POST /users - sign up
    POST /users/login - login

    POST /groups - create a group
    GET /groups - get all groups the user is a member or manager of
    GET /groups/search/:query- search for a group

    POST /lifts - create a lift
    POST /lifts/join/:id - join a lift with an id.
    GET /lifts - get all lifts that answer a specific time and place query

    POST /perms - send a permission request to join a group
    GET /perms - get all the permission requests, that were sent to the groups that I am the manger of
    POST /perms/accept - accept a permission request, the user who sent it, will now be a member of the group.
    POST /perms/reject - reject a permission request
