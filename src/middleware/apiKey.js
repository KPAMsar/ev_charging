
const APIUser = require('../models/APIUser');
const MAX = process.env.API_MAX || 25;
const validateKey = (req, res, next) => {
    //Where is the API key expected to be?
    let _host = req.headers.origin;
    //let api_key = req.query.api_key; //version 1 with the querystring
    let _api_key = req.params.apikey; //version 2 with the URL params
    // let api_key = req.header('x-api-key'); //version 3 using a header

//  APIUser.findOne({ api_key: _api_key }
    APIUser.findOne({ $and: [{ api_key: _api_key }, { host: _host } ]}
    //   (user) => user.host == host && user.api_key == api_key
    )
    .then(user => {
          console.log(_host)
    if (user !=null) {
      //good match
      //check the usage
      let today = new Date().toISOString().split('T')[0];
      let usageIndex = user.usage.findIndex((day) => day.date == today);
      if (usageIndex >= 0) {
        //already used today
        console.log('this is index:', user.usage[usageIndex].count,usageIndex)
        if (user.usage[usageIndex].count >= MAX) {
          //stop and respond
          res.status(429).json({
            error: {
              code: 429,
              message: 'Max API calls per day exceeded.',
            },
          });
        } else {
          //have not hit todays max usage
          user.usage[usageIndex].count++;
          APIUser.findByIdAndUpdate(user._id, { $set: { usage: [user.usage[usageIndex] ]} })
          .then(result => {
            //   console.log(result)
          })
          console.log('Good API call', user.usage[usageIndex]);
        //   console.log(user._id);
          next();
        }
      } else {
        //not today yet
        // user.usage.push({ date: today, count: 1 });
        APIUser.findByIdAndUpdate(user._id, { $set: { usage: { date: today, count: 1 } } })
        
        //ok to use again
        next();
      }
    } else {
      //stop and respond
      res.status(403).json({ error: { code: 403, message: `not allowed from ${_host}` } });
    }
        
    })
    // .catch(error => {
    //     res.json({
    //         message: 'An error occured!',
    //         error: error
    //     })
    // })

  
  };
  
  module.exports = {validateKey};