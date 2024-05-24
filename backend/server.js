require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
const Port = process.env.PORT
const MongoDB_Atlas=process.env.MONGODB_URI
const MongoDB_Local=process.env.MONGODB_LOCAL

app.use(bodyParser.json())
app.use(cors())

//MongoDB database Connection
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(MongoDB_Atlas);

  //Define Note Schema and Mode
  const noteSchema= new mongoose.Schema({
    title:String,
    content:String
  })

  const Note = mongoose.model("Note",noteSchema)

// API routes

app.get("/",(req,res)=>{
  res.send("This is a Notes App")
})

//GET Route
app.get('/api/notes',(req, res) => {
    try {
      Note.find().then(results=>{
        res.json(results)
      }).catch(err=>console.log(err))
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

//POST Route
  app.post('/api/notes', async (req, res) => {
    let Title = req.body.title
    let Content= req.body.content
    const note = new Note({
      title: Title,
      content: Content
    });
    try {
      await note.save()
      res.json({message:"Note Created SuccessFully"});
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

//PUT ROUTE
app.put('/api/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//PATCH Route
app.patch('/api/notes/:id',async (req,res)=>{
  let noteID=req.params.id
  let noteContent=req.body.content
  try{
    Note.updateOne({_id:noteID},{content:noteContent}).then(results=>{
      res.json({message:"Note Updated Successfully"})
    }).catch(err=>console.log(err))
  }catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
})

//Delete Route
app.delete('/api/notes/:id',async(req,res)=>{
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
})
  // Add other CRUD routes (PUT, DELETE) as needed

  //End of DB Connection
}
//server App is Listening on port 8080
app.listen(Port, () => console.log(`Server running on port ${Port}`));