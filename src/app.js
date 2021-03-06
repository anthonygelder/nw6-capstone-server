require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const winston = require('winston')
const { NODE_ENV } = require('./config')
const authRouter = require('./auth/auth-router')
const userRouter = require('./user/user-router')
const dataRouter = require('./data/data-router')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'info.log'
    })
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}


const app = express()

const morganOption = (NODE_ENV === 'production') ?
  'tiny' :
  'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/data', dataRouter)

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = {
      error: {
        message: 'server error'
      }
    }
  } else {
    console.error(error)
    response = {
      message: error.message,
      error
    }
  }
  res.status(500).json(response)
})

module.exports = app
