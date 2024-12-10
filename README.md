# Habit Tracker!

Web version of the app:

[https://habit-tracker-app-front.netlify.app](https://habit-tracker-app-front.netlify.app)

![1](https://github.com/user-attachments/assets/a1bce511-8181-4bb5-a28e-c77520a4f952)

![2](https://github.com/user-attachments/assets/83725c9e-2dbf-48f1-9a12-ebd88ec08a26)

Full Server:

[https://github.com/Lenindelrionicaragua/ZenTimerAppServer](https://github.com/Lenindelrionicaragua/ZenTimerAppServer)

**Habit Tracker**: A React Native app for effective time management. The app allows users to track their time across various activities and offers detailed insights and statistics. Users can create or edit habit categories, store daily time records, and view stats in monthly, weekly, or daily formats. The goal is to help users track how they invest their time, stay motivated, and achieve their habit goals.

## Features

- **Customizable timer**: Track time for study, rest, exercise, family, or screen-free intervals.
- **User authentication**: Google authentication for login.
- **Habit categories**: Users can create and edit categories to organize their habits.
- **Daily time logs**: Store daily time records.
- **Statistics**: View time statistics by day, week, month, or category.
- **Motivation**: Keep track of time spent on habits and stay motivated to achieve goals.

## Technologies Used

- React Native
- Redux
- Firebase Authentication
- React Native Voice
- React Native Chart Kit
- Expo
- MongoDB
- **Testing**: Jest and Cypress for unit and end-to-end testing

## Setup Instructions

### 1. Install Dependencies

To run the project locally, first, clone this repository. Then, run the following command to install the necessary dependencies:

```bash
npm install --legacy-peer-deps
```

Next, install the testing library:

```bash
npm install @testing-library/react-hooks --legacy-peer-deps
```

### 2. Google Client ID

To use Google authentication, you'll need your own credentials for the different platforms. Add the following client IDs to your `.env` file:

```makefile
GOOGLE_CLIENT_ID_WEB=your-web-client-id
GOOGLE_CLIENT_ID_IOS=your-ios-client-id
GOOGLE_CLIENT_ID_ANDROID=your-android-client-id
GOOGLE_CLIENT_ID_EXPO=your-expo-client-id
```

These credentials can be obtained from the [Google Developer Console](https://console.developers.google.com/).

### 3. Test User

You can log in using the following credentials for testing purposes:

- **Email**: usertest@example.com
- **Password**: Password1234!

## Getting Started

After completing the setup steps, you can run the app locally on your machine.

### Running the App

Use the following command to start the app:

```bash
npm start
```

Follow the instructions in the terminal to run it on either an emulator or a physical device.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests with any new features, bug fixes, or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
