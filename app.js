const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3004;
const http = require('http');
const moviesController = require('./controllers/movies');

app.use(express.static('client'))

app.use(cors())
app.use(bodyParser.json());

const init = async () => {
    app.listen(port, (err) => console.log(`Server up on port ${port}`));
};

init();

app.use('/api/movies', moviesController);

app.get('/test', (req, res) => {
    return res.json({ ok: true });
});