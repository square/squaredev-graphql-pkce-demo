# GraphQL and PKCE OAuth Example Application

This is a demo mobile app that is intended to help you understand / implement / play with a mobile application that can help you understand some use cases and implementations for PKCE OAuth and GraphQL!

We have a blog post to accompany this repo [here](https://developer.squareup.com/blog/unlock-a-better-mobile-experience-with-square-graphql-and-pkce)

**NOTE**: This app **DOES NOT** use Expo. While [setting up your React Native environment](https://reactnative.dev/docs/environment-setup) please keep that in mind, and follow instructions to setup **without** Expo.

# Getting Started
## Square Setup
1. Create a developer account at [Square Developer](https://developer.squareup.com) and create a [new app](https://developer.squareup.com/apps)

1. Navigate to the [sandbox test accounts](https://developer.squareup.com/console/en/sandbox-test-accounts) and create a new test account. In this Example we named ours 'Flour Power'. 

1. Click the name of the newly created sandbox seller. Open the drop down for your app and use the `access token` from this screen in the next step.


1. Use the accessToken from above place it's value into the `SQUARE_ACCESS_TOKEN` variable in `seed-data.js`. We are not saving this value in our `.env` because the value would get packaged into our app - which would be a security nightmare, and undo the purpose of using PKCE!

1. Install node modules and then run the command to seed sample data into your test seller account.
    ```
    $ npm install
    $ npm run seed
    ```
1. Configure your app to have a redirect URL - https://developer.squareup.com/apps/YOUR_APP_ID/oauth

1. Copy `.env.example` to `.env`. Paste the value of your `Application Id` and `Redirect URL` into the values in the `.env` file


*note*: you can run `npm run clear` to delete the test data from the seller account as well. You can also easily delete the test seller, and create a new one. Just repeat step 3 after doing so.
## Apple iOS Set up

**note**: DO NOT SKIP if deploying on iOS - this set up is critical to the success of making PKCE OAuth on the client work.

This app utilizes [Universal Links](https://developer.apple.com/ios/universal-links/). In order to use Universal links you must have an Apple Developer Account. You will need a web server running that can host a [apple-app-site-association](https://developer.apple.com/documentation/xcode/supporting-associated-domains?language=objc) file. We used https://glitch.com to handle this.

Make sure your App identifier is placed into the app, and that you have configured all the proper device signing in your apple developer account.

### iOS Troubleshooting
If you run into issues with environment setup for react native and iOS, [check out the docs](https://reactnative.dev/docs/environment-setup)

If the app is having trouble launching, you should stop all processes, open Xcode, launch an emulator, and once all of that is running, then try `npx reactive-native start` and press `i` to launch the iOS app

We have noticed that the app runs better on an iPhone 14, but might default to opening on an iphone SE. In the emulator menu there is a section for Devices, and you should be able to select a different phone. You can then restart the metro server and see if that fixes the issue.


## Android Set up

**note**: DO NOT SKIP if deploying on Android - this set up is critical to the success of making PKCE OAuth on the client work.

This app utilizes [Android App Links](https://developer.android.com/training/app-links#android-app-links). In order to implement this you will need to have web server running that can host a file called. [assetLinks.json](https://developer.android.com/training/app-links/verify-android-applinks#web-assoc). The `package name` for this repo is `com.squaredevgraphqlpkce`. We used https://glitch.com to handle hosting this file.

### Android Troubleshooting
Getting React native to work with Android is a bit cumbersome. Please follow [these instructions](https://reactnative.dev/docs/environment-setup) as closely as you can. 

If you have configured your android app link correctly but the app is not opening, follow [these steps](https://developer.android.com/training/app-links/verify-android-applinks#manual-verification) to manually verify you configured it correctly.


## React Native Set up

1. Install node modules
`npm install`

### For iOS
1. Link / install the cocoa pods
`npx pod-install ios`

1. Run the app
`npx react-native run-ios`

    Alternatively you can also run `npx react-native start` and then press `i` to load the xcode install


### For Android
1. `npx react-native start`

1. open a second terminal and run:

    `npx react-native run-android`



## Using the Demo

Once your app has booted on the emulator and you can see the Neon Nexus login page, you need to do these next steps before the PKCE flow will work

1. In the emulator, move out of the app and open safari.

1. Navigate to [the developer dashboard](https://developer.squareup.com/apps)

1. Login to your Square Developer account.

1. Once logged in, scroll down to your sandbox seller accounts, and click open next to the sandbox seller account created on Step 2 in the Square Setup Section

1. Once Safari has opened a new window with your sandbox seller dashboard, open the sample app, you can now proceed with the OAuth flow.


