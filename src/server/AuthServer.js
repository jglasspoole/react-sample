const serverPort = 3001
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

//For sake of example sits in memory here, but should be taken from a DB
const users = []

//Displays user data (with encrypted passwords)
app.get('/users', (req, res) => {
  res.json(users)
})

//Insert a new user
app.post('/users', async (req, res) => {
  try {
    //const salt = await bcrypt.genSalt()
    //const hashedPassword = await bcrypt.hash(req.body.password, salt)
    //Done in one line below...
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password : hashedPassword }

    users.push(user)
    res.status(201).send()

  } catch {
    res.status(500).send()
  }
})

//Check login for a user
app.post('/users/login', async (req, res) => {
  //Do we have a matching user name in list
  const user = users.find(user => user.name === req.body.name)
  if(user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    //Using bcrypt compare helps prevent timing attacks
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    }
    else {
      res.send('Not allowed')
    }
  } catch {
    res.status(500).send()
  }
})

app.listen(serverPort)