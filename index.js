require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const url = {}

app.post('/api/shorturl', async (req,res)=>{
  const original_url = req.body.url
  try {
    const response = await fetch(original_url,{method:"HEAD"});
    if (!response.ok) {
      return res.status(400).json({error:'invalid url'})
    }
    const short_url = Math.floor(1000 + Math.random() * 9000);
    url[short_url] = original_url
    res.json({original_url,short_url})

  } catch (error) {
    res.json({error:'invalid url'})
  }

})

app.get('/api/shorturl/:short_url?',(req,res)=>{
  const short = req.params.short_url;
  const original = url[short]
  if (original) {
    res.redirect(original)
  }else{
    res.json({error:'invalid url'})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
