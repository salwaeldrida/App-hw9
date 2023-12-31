const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const moviesRouter = require('./routes/movies');
const usersRouter = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/movies', moviesRouter);
app.use('/users', usersRouter);

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Database API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
