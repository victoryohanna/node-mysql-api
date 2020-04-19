const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000; 

//Configure express server to access json data and enable CORS for all http header
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cors());   

//Routes
const route = require('./routes/api');
app.use('/', route);

//Start the server
app.listen(port, ()=>{
    console.log('Server running at port ' + port);
});