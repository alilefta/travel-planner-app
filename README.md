# Travel Planner

Travel planner app help you to orginize your trips easily with no effort.

App is build using SASS, express, Webpack, ES6.
Unit tested with Jest.
Service workers included.

## Demo

https://angry-almeida-1e29f6.netlify.app/

## Features

1. User can search for a trip with `city name and departure date` and optionally end date.
2. User can save or remove the trip from the search main page
3. Local storage is used to Save trips and Notes which they are much like Todo list.
4. User can add Notes, with a nice bootstrap modal => note will added to the trip and rendered immediatly.
5. Notes are added and renderd if the user save or didn't save the trip.
6. When a note added on a saved trip it will remains in the Local storage wo it will not removed when user refresh the page
7. User can remove notes oh hovering on the note and click the anchor tag that appears
8. When no images came up by search, we used Pixabay to get an Image to show up.
9. Beautiful designed notifications to tell the user on every change in the page.
10. There are two pages in the app, One for main page and the other for trips that in the storage.
11. Functionality is smoothly renderd much like a front end framework, or library like React.js

## Installation

Use NPM package manager to install all dependencies.

```bash
npm install
```

## Usage

Run the App's local server

```
npm run start
```

To build a development version

```
npm run dev
```

To build a production version

```
npm run build
```

To run tests

```
npm run test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
