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

1. Run this next command to seed data into the test account that can be used for the application.
    ```
    $ npm run seed
    ```
1. Configure your app to have a redirect URL - https://developer.squareup.com/apps/YOUR_APP_ID/oauth

1. Paste the value of your `Application Id` and `Redirect URL` into the values in the `.env` file


*note*: you can run `npm run clear` to delete the test data from the seller account as well. You can also easily delete the test seller, and create a new one. Just repeat step 3 after doing so.
## Apple iOS Set up

This app utilizes [Universal Links](https://developer.apple.com/ios/universal-links/). In order to use Universal links you must have an Apple Developer Account. You will need a web server running that can host a [apple-app-site-association](https://developer.apple.com/documentation/xcode/supporting-associated-domains?language=objc) file. We used https://glitch.com to handle this.


## React Native Set up

1. Install node modules
`npm install`

2. Link / install the cocoa pods
`npx pod-install ios`

3. Run the app
`npx react-native start`

When the app is running you can press `i` in the interactive metro menu to launch the app on iOS.

## Troubleshooting

notes: 

App didn't start when Xcode wasn't open. Need to do a full reboot, and test.

For the first time running the flow, need to click allow on the smart banner

