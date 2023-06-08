# Square Dev GraphQL and PKCE Example Application

This is a demo mobile app that is intended to help you understand / implement / play with a mobile application that can help you understand some use cases and implementations for PKCE and GraphQL!

We have a blog post to accompany this repo here: TODO LINK TO BLOG POST

**NOTE**: This app is built with React Native and currently only builds for iOS. This app **DOES NOT** use Expo.


# Getting Started
## Square Setup
1. Create a developer account at [Square Developer](developer.squareup.com) and create a [new app](developer.squareup.com/apps)

1. Add a new Sandbox Testing account in your app. In this Example we named ours 'Flour Power'. 

1. Click the `...` next to the newly created sandbox seller and click `View Details`. Use the `access token` from this screen in the next step.


1. copy `.env.example` to `.env`. Use the accessToken from above place it's value in the newly created `.env` file.

1. Install node modules and then run the command to seed sample data into your test seller account.
    ```
    $ npm install
    $ npm run seed
    ```
1. Configure your app to have a redirect URL - https://developer.squareup.com/apps/YOUR_APP_ID/oauth

1. Paste the value of your `Application Id` and `Redirect URL` into the values in the `.env` file


*note*: you can run `npm run clear` to delete the test data from the seller account as well. You can also easily delete the test seller, and create a new one. Just repeat step 3 after doing so.
## Apple iOS Set up

**note**: DO NOT SKIP - this set up is critical to the success of making PKCE OAuth on the client work.

This app utilizes [Universal Links](https://developer.apple.com/ios/universal-links/). In order to use Universal links you must have an Apple Developer Account. You will need a web server running that can host a [apple-app-site-association](https://developer.apple.com/documentation/xcode/supporting-associated-domains?language=objc) file. We used https://glitch.com to handle this.

Make sure your App identifier is placed into the app, and that you have configured all the proper device signing in your apple developer account.

## React Native Set up

1. Install node modules
`npm install`

2. Link / install the cocoa pods
`npx pod-install ios`

3. Run the app
`npx react-native run-ios`

Alternatively you can also run `npx react-native start` and then press `i` to load the xcode install

If you run into issues with environment setup for react native and iOS, [check out the docs](https://reactnative.dev/docs/environment-setup)

## Using the Demo

Once your app has booted on the emulator and you can see the Neon Nexus login page, you need to do these next steps before the PKCE flow will work

1. In the emulator, move out of the app and open safari.

1. Navigate to https://developer.squareup.com/apps

1. Login to your Square Developer account.

1. Once logged in, scroll down to your sandbox seller accounts, and click open next to the sandbox seller account created on Step 2 in the Square Setup Section

1. Once Safari has opened a new window with your sandbox seller dashboard, open the sample app, you can now proceed with the OAuth flow.

## Troubleshooting

We have noticed that the app runs better on an iPhone 14, but might default to opening on an iphone SE. In the emulator menu there is a section for Devices, and you should be able to select a different phone. You can then restart the metro server

If the app doesn't launch on the first run of `npx react-native start` try restarting the metro server


