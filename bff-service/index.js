const express = require('express');
require('dotenv').config();
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.all('/*', (req, res) => {
  console.log('originalUrl', req.originalUrl); // /products/main?res=all
  console.log('method', req.method); // POST, GET
  console.log('body', req.body); // { name: 'product-1', count: '12' }

  const recipient = req.originalUrl.split('/')[1];
  console.log('recipient', recipient);

  const recipientUrl = process.env[recipient];
  if (recipientUrl) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientUrl}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
    };

    console.log('axiosConfig: ', axiosConfig);

    axios(axiosConfig)
      .then(function (response) {
        console.log('response from recipient', response.data);
        res.json(response.data);
      })
      .catch((error) => {
        console.log('some error: ', JSON.stringify(error));

        if (error.response) {
          const { status, data } = error.response;

          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: 'Cannot process request' });
  }
});

app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});
