# tgc-webgl

An open source 3D graphics framework made in Javascript with _WebGL_ and [ammo.js](https://github.com/kripken/ammo.js).

## Instructions

### Running the project

To run the project you clone the repository and drag the `index.html` file into your browser. 

#### Firefox

You should be good to go. Cloning the project and dragging the file should be enough to run the framework in the latest Firefox version.

#### Chrome

Clone this repository, install [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb) and select your cloned repository folder as the server folder (using _CHOOSE FOLDER_).
Find `index.html` in your local server.

#### Other browsers

Support on other browsers is currently unstable. You may try to run your `index.html` locally and check if local file fetching is supported. If it is not, you may need a local server (check your console for details, if it says something like 'CORS request' you need a server).

### Finding projects

You may find available projects by using
```javascript 
Projects.list();
```

### Loading projects

You can load projects by using
```javascript
Projects.load("your-project-name");
``` 




