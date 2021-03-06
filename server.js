const express = require('express')
const mongoose = require('mongoose')
const creds = require('./creds')
const MellosRollo = require('./models/mellosRollo')
const app = express()

mongoose.connect('mongodb://localhost/mellosRollos', {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
  console.log('Connected to Database')
}).catch((err) => {
  console.log(err)
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const rolloCountTotal = await MellosRollo.countDocuments()

  const todayBeginning = new Date()
  todayBeginning.setUTCHours(0,0,0,0)

  const rolloCountToday = await MellosRollo.find({ rolloAteAt: { $gte: todayBeginning} }).countDocuments()

  res.render('index', { rolloCountTotal: rolloCountTotal, rolloCountToday: rolloCountToday})
})

app.get('/rollo', (req, res) => {
  if(req.headers.authorization) {
      autharr = req.headers.authorization.split(' ')

      Object.entries(creds).forEach(([key, value]) => {
      const buf = Buffer.from(`${key}:${value}`, 'utf-8')

      if(buf.toString('base64') === autharr[1]){
        res.status(400).render('rollo')
      }
      })
  } else {
    res.header({
      'WWW-Authenticate': 'Basic'
    })
    res.status(401).render('unauthorized')
  }
})

app.post('/addRollo', async (req, res) => {
  await MellosRollo.create({})
  res.redirect('/')
})

app.listen(process.env.PORT || 3000)