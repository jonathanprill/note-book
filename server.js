// The following HTML routes should be created:
//  -GET /notes should return the notes.html file.
//  -GET * should return the index.html file.

// The following API routes should be created:
//  -GET /api/notes should read the db.json file and return all saved notes as JSON.
//  -POST /api/notes should receive a new note to save on the request body, add it to
//      the db.json file, and then return the new note to the client. You'll need to find
//      a way to give each note a unique id when it's saved (look into npm packages that could do this for you).

const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require('./db/db.json');


// parse incoming string or array data  |  converts it to key/value pairing
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

//Gets CSS to work
app.use(express.static('public'));

/////////////////////////////////////////////////////////////////////////////

//Getting notes json array
app.get('/api/notes', (req, res) => {
  let results = notes;

  res.json(results);
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});


//Posting
function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, './db/db.json'),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = notes.length.toString();

  //Validation
  if (!validateNote(req.body)) {
    res.status(400).send('The note is not properly formatted.');
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

function validateNote(note) {
  if (!note.title || typeof note.title !== 'string') {
    return false;
  }
  if (!note.text || typeof note.text !== 'string') {
    return false;
  }
  return true;
}


////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);