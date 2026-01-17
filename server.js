const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const Note = require('./Note');

const app = express();

app.use(express.json());
app.use(express.static(__dirname)); 

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ===== CRUD API =====

// CREATE
app.post('/notes', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const note = new Note({ title, content });
  await note.save();

  res.status(201).json(note);
});

// READ ALL
app.get('/notes', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 }); // новые вверху
  res.json(notes);
});

// READ ONE
app.get('/notes/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json(note);
});

// UPDATE
app.put('/notes/:id', async (req, res) => {
  const { title, content } = req.body;

  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true, runValidators: true }
  );

  if (!updatedNote) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json(updatedNote);
});

// DELETE
app.delete('/notes/:id', async (req, res) => {
  const deletedNote = await Note.findByIdAndDelete(req.params.id);

  if (!deletedNote) {
    return res.status(404).json({ message: 'Note not found' });
  }

  res.json({ message: 'Note deleted' });
});

// Frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});