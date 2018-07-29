# DevConnector
A social network for developers made on MERN Stack based on Udemy course.


**Live demo:** <https://devconnector-mern.herokuapp.com>
 
## Main Technologies

### Client Side

* [x] **[React](https://github.com/facebook/react)**
* [x] **[Redux](https://github.com/reactjs/redux)**
* [x] **[Bootstap 4](https://github.com/twbs/bootstrap/tree/v4-dev)**
* [x] **[React-Router](https://github.com/ReactTraining/react-router)**

### Server Side

* [x] **[Node.js / Express](https://github.com/expressjs/express)**
* [x] **[MongoDB](https://github.com/mongodb/mongo)**
* [x] **[JWT](https://github.com/auth0/node-jsonwebtoken)**
* [x] **[Passport](http://www.passportjs.org/)**

### Setup

```bash
$ git clone https://github.com/adicuco/devconnector.git
```

Go to project direction

Install dependencies

```bash
$ npm i
$ npm run client-install
```

Create **config/keys_dev.js** file

Add your MongoDb URL, JWT secret and Github credentials

```bash
module.exports = {
  mongoURI: YOUR_MONGODB_URI,
  secretOrKey: YOUR_SECRET_OR_KEY,
  githubClientId: YOUR_GITHUB_CLIENT_ID,
  githubClientSecret: YOUR_GITHUB_CLIENT_SECRET
};
```

Run app

```bash
$ npm run dev
```
