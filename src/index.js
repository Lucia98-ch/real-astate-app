import cors from 'cors'
import {Server} from 'http'
import express from 'express'
import passport from 'passport'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import router from './router'
import socket from './sockets'
import db from './config/db'

require('dotenv').config()

const app = express()
const server = Server(app)
const port = parseInt(process.env.PORT, 10) || 8080
const dev = process.env.NODE_ENV === 'development'

if(dev) app.use(require('morgan')('combined'))

app.use(cors())
app.use(cookieParser())
app.use(passport.initialize())
app.use(bodyParser.json({limit: '150mb'}))
app.use(bodyParser.urlencoded({extended: true,limit: '150mb'}))

socket(server)
db.connect()
router(app)

server.listen(port, err => {
    if (err) throw err
    console.log(`🚀 Ready at http://localhost:${port}`)
})