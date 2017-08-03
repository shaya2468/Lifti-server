# Lifti — Lifts associated with groups

In this document we'll discuss the high level design and the thought process behind Lifti.
To read about what the app does, how to use it and the main flow of the application please see this article [here](https://medium.com/@shayaajzner/test-test-test-67027d263a3b)

###Data Models

####User
Simple Entity that represents a user who registered to the system. 

main fields:

1. email
2. password
3. name

####Group
Represents a secure group, where only a manager can grant other users permission to join.

main fields:

1. name
2. description
3. manager - the user who is the manager of the group
4. members - list of the users, who are members of the group.

####Lift
A lift can be created by any user, and he may add it to the groups he chooses.

main fields:

1. origin
2. destination
3. capacity - the number of people the owner of the lift can take.
4. leave_at - when does the train leave
5. owner - the user who created the lift
6. groups - the groups that this ride will appear in

####Permission
A permission request sent by a user, to join a group

main fields:

1. group - the group the user requests to join
2. applicant - the user who wants to join a group

####City
A list of cities that a user that you can take lifts in. For now it's a hard coded list.

main fields:

1. name -the name of the city



###How the models all relate to each other:

![Image of Yaktocat](https://drive.google.com/uc?id=0B_ciQLEjqv8bRDdJUEJtRHRzdG8)




