# errors-handler
  Simple and efficient global errors handler that handle errors of development and production , you don't worry about
  leaking informations in the production 
  
## Installation
```
npm i errors-handler --save
```


 ### Before using it : 
 Make sur you have a .env file contain ```NODE_ENV=development/production```
For now i use it for my self , it's very usefull but there is messings errors , so i appreciate your contributions :) 
## Use
 
 
 In an Express-based application:
 
 ```js
 const  app = express();
 const errorsHandler = require('errors-handler')
 //don't work without .env with variable NODE_ENV=production/development
 require('dotenv').config(); 

 
 // Setup your middlewares
// Setup your routes
app.get('/foo', async (req, res, next) => {
//Yout code here
// const doc = await Modal.find();
  if(!doc) return next(new AppError('error message here' , status code number here) 
  res.json({
  // your response here
  })
});

// the global error handler middleware 
app.use(errorsHandler);
 ```
 
 ## Options
 Soon
 
 