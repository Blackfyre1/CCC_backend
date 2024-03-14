// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Location = require('./models/location');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://root:zjHySItuqYWS0c9i@kumbh.igzzpuu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Registration
app.get('/',(req,res)=>{
res.send(`<html>
<body>
TESTING
</body>
</html>`)
})
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    console.log(newUser.id);
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password} = req.body;
    const user = await User.findOne({ email, password });
    console.log(email);
    if (user) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
app.post('/saveLocation',async(req,res)=>{
  try{
     const {userId,lat,long} = req.body;
     const user = await User.findOne({_id: userId});
    if(!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return ;
    }
     const loc = new Location({userId,lat,long});
     loc.save();
     res.status(201).json({ message: "Location registered successfully" });
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
});
app.post('/getLocation',async(req,res)=>{
  try{
     const {userId} = req.body;
     const loc = await Location.findOne({userId});
     if(!loc){
      res.status(400).json({message: "Invalid UserId"})
     }
     res.status(201).json({lat: loc.lat , long: loc.long});
  }
  catch(error){
    res.status(400).json({ message: error.message });
  }
});
app.post('/updateLocation', async (req, res) => {
  try {
    const { userId, lat, long } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Find the location document for the user
    let loc = await Location.findOne({ userId});
    if (!loc) {
      return res.status(401).json({ message: "Location doesn't exist" });
    } else {
      await loc.updateOne({ userId, lat, long });
    }

    return res.status(201).json({ message: "Location updated successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.get('/allLocation',async(req,res)=>{
const all = await Location.find();
try{
return res.status(201).json(all);
}catch(error){
  return res.status(400).json({message: error.message})
}
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
