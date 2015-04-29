---
layout: post
title: "Angular and Tryton based web application with angular-tryton"
date: 2015-01-19 00:04:12 +0530
comments: true
categories: [Angular, Tryton, angular-tryton, ERP]
---

If AngularJS is your choice of frontend development framework, and you are working
with Tryton, then angular-tryton may just be what you need to create your next
Tryton and AngularJS powered single page web application or mobile app.

<!-- more -->

##What's angular-tryton, anyway?
angular-tryton lets your angular app interact with Tryton the same way Tryton GTK
client does; only now, you decide what data you want to get and how you want to present
it in your app, hopefully you'll make something better than the GTK client ;)

If you really want to dig into details about how angular-tryton works, it's
probably a good idea to konw how the Tryton GTK client works, because that is
exactly the same way angular-tryton interacts with the Tryton server AKA trytond.

In fact angular-tryton enforces the exact permissions as the Tryton client does but
with angular-tryton you can handle the responses, the way you want, keeping in
mind the UI/UX of your app.

###How Tryton works
Essentially, the Tryton client makes RPC calls to trytond and fetches the
required data and/or makes changes to records.
If you're curious about what RPC requests the Tryton client makes, you can run the
Tryton GTK client in debug mode.


Run the following command in your terminal if you have tryton already installed.

```bash
tryton --log-level=debug
```

Then log in, and you'll find, the terminal where you started Tryton in debug mode,
get flooded with unintelligible logs, but if you pay attention to one of those logs
starting with `INFO:`, you can make sense of what's happening.

Tryton client  makes RPC calls to trytond and calls a method which may be
any valid method documented in the Tryton API (create, write, search, read, etc).

You can do exactly the same thing with the power of angular-tryton in you Angular
app.

###How angular-tryton works
Now you know how Tryton's GTK client works, time to understand how you can use angular-tryton
to have the same superpowers that Tryton client has.

angular-tryton, out of the box provides you 2 services `tryton` and `session`.
So, the basic idea is `tryton` service is used for all the RPC calls which don't
require a session i.e. if you don't have to be logged in to access a method
for example: 

Getting trytond server version.
```javascript
tryton.getServerVersion()
```

Getting a list of databases
```javascript
tryton.rpc('common.list', [null, null])
.success(function(response){
    $scope.databases = response;
});
```

And `session` service is for making RPC calls to the methods which require a
tryton user to be logged in like: search, read, create write, etc.

Log into tryton.
```javascript
session.doLogin($scope.user.database, $scope.user.username, $scope.user.password)
.success(function(response){
    // Yay! user logged in.
})
.error(function(reason){
    // Handle login failure.
});
```

After login, access Tryton's methods.
```javascript
// Create a pyson domain
var domain = [
    ['id', '=', 42]
];
// Call search_read method over RPC with the domain.
session.rpc('model.party.party.search_read', [domain]);
```

In future post we'll discover how we can use this capability of angular-tryton
to create something useful. How about a cordova based mobile application may be?
