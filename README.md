# Bubble Blitz (Expo)

A simple Expo game project you can work with from your phone and build in the cloud.

## What it is
- Expo / React Native app
- Simple bubble tapping arcade game
- Ready for EAS cloud builds

## How to use from your phone
1. Upload these files to a GitHub repo or open them in a mobile code editor.
2. Install the Expo and EAS tools where you plan to run commands.
3. Run:
   - `npm install`
   - `npx expo start`
4. For an iOS cloud build:
   - `npx eas login`
   - `npx eas build -p ios --profile preview`

## Before building
- Change the app name, slug, and bundle identifier in `app.json`.
- Replace the placeholder assets in `/assets` if you want your own icon.

## Files
- `App.js` - main game
- `app.json` - Expo config
- `eas.json` - cloud build profiles
