---
layout: post
title: "Set up push notification for Cordova/Phonegap app on Parse.com platform"
date: 2016-01-03 17:16:45 +0530
comments: true
categories: [Parse.com, Cordova, Phonegap, Angular]
---

Creating hybrid apps with Cordova can sometimes be a real pain because not a lot
of platforms have bindings for it.

I've recently been working on a hybrid app using Facebook's Parse platform which
provides, a very easy backend solution for creating apps along with SDK for most
of the platform you might need, to create app for. Parse also has an easy way to
integrate push notifications for your apps, BUT, the SDK only supports native apps.
No love for the JS SDK. So, if you're building a native iOS or Android app, you're
golden, but if it's a hybrid app, you are out of luck.

<!-- more -->

### There are some plugins we might use, right?
Well, not really, there are a [bunch](https://github.com/cranberrygame/cordova-plugin-pushnotification-parsepushnotification)
[of](https://github.com/taivo/parse-push-plugin) [plugins](https://github.com/avivais/phonegap-parse-plugin)
which might help you, but most of them are either outdated, require changes to the
native code or both. I tried a bunch of them and none seem to have worked for me.

Besides, if it can be done using JS in a hybrid app, I always prefer that over
depending on Cordova plugin.

So, what is the solution then, are we dead in the water if we want to create
a hybrid app with parse and be able to send push notifications from parse?
The answer is no, if you understand how parse really works and how it registers
your device and sends push notifications to the device, you'll e easily be able
to configure push notifications for your hybrid app without touching any native
client code or using any Parse specific Cordova plugin, sounds good? Let's see how we can do it...

### How Parse push notifications work
If you were creating a native mobile application with parse, it would create a
new installation record `Parse.Instllation` record for your device in the
`_Installation` class in the Parse dashboard.

This record would contain details about the device your app is installed in;
the details we are interested in are: `deviceToken`, `deviceType`, `installationId`,
and `timeZone`.

All you have to do to be able to send push notification is, create a new record
manually of `Parse.Installation` and provide the fields we need to sending push
notifications and that's it, you'll be able to send the push notification.

### Manually create a new installation for the app
We need to following information for the installation record.

#### Device Token
Firstly we must have a device token - it is an identifier of your device, which
the push notificaition server uses to make sure it sends the message to your device
and not your neighbour's phone.

[Install](https://github.com/phonegap-build/PushPlugin) the official Cordova/Phonegap
push notification plugin to get the device token. Follow their documentation on
how to get the device token, it's pretty straightforward.

#### Installation ID
Every Parse application is provided with an installation ID, whether it's mobile
app, Web app. 

Get the installation ID from current session:

```javascript
...
// Get the current installation
Parse.Session.current();
    .then(function(session) {
        var installationId = session.get('installationId');
        ...
    })
```

#### Device Type
This can be either `android` or `ios` depending on the current device the app is
installed on.

#### Time Zone
Timezone is very critical for push notifications, if you want to send a push notification
on user's local timezone. If you're using `moment`, it's as simple as `moment.tz.guess()`.

And that's it that's it, you can now send push notification to your device now
and you didn't even need any Parse specific push notification plugin for cordova.

Here's how my final code looks after implementing the whole thing in AngularJS.

```javascript
var _registerPushNotification = function() {
    return $cordovaPush.register({'badge': true, 'sound': true, 'alert': true})
      .then(function(deviceToken) { 
        ParseSDK.deviceToken = deviceToken;
        // Get the current installation
        return Parse.Session.current();
      })
      .then(function(session) {
        ParseSDK.session = session;
        // Check if current user has an instllation record for this device
        var installationQuery = (new Parse.Query(Parse.Installation))
          .equalTo('user', ParseSDK.currentUser)
          .equalTo('installationId', ParseSDK.session.get('installationId'))
          .equalTo('deviceToken', ParseSDK.deviceToken);
        return installationQuery.first();
      })
      .then(function(result) {
        if(result) {
          // This device is already registered with the current user
          return Parse.Promise.as();
        }
        // Device is not registered with the current user
        var installation = new Parse.Installation();
        return installation.save({
          'user': ParseSDK.current,
          'installationId': ParseSDK.session.get('installationId'),
          'deviceToken': ParseSDK.deviceToken,
          'deviceType': 'ios',
          'timeZone': moment.tz.guess(),
          'appName': 'afitgo',
          'appIdentifier': 'com.afitgo',
          'appVersion': null, // TODO
          'localeIdentifier': window.navigator.userLanguage || window.navigator.language
        });
      }, function(err) {
        console.error('Error trying to register push notification ', err);
    });
  };
```
