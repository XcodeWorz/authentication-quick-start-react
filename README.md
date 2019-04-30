This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Front End

The front end was made with Create React App. Use the following scripts to quick start it. You can change the api url link in the settings file (./src/settings.js)

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## Server

The server is a standard Express app using Passport and JWT. You will need to setup a mongo database. Set the app secret, port and mongo connection string in the settings file (./src/config/settings.js)

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.