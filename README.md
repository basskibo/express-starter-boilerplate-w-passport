# express-starter-boilerplate-w-passport

This is boilerplate application setup for quickstart of Nodejs project with express, Mongo , redis and passport authentication.

### Installation

First you need to clone this projcet 

```javascript
git clone https://github.com/basskibo/express-starter-boilerplate-w-passport.git
```


after cloning project, redirect to project destination

```javascript
cd express-starter-boilerplate-w-passport/
```

Install node modules with/without sudo it depends of you
```javascript
sudo npm install
or
npm install
```

You can start node server in two ways:
#### First way: with node

```javascript
node init.js
```

#### Second way: with pm2 which is included in package.json and it will be installed when you run npm install

```javascript
pm2 start init.js --name "my-project" 
```
