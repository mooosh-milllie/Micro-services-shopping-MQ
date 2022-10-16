const express = require('express');

const app = express();


app.use('/', (req, res, next) => {
  return res.status(200).json({msg: 'Hello from Customer'})
})

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log('Customer is Listening on port 8001')
})