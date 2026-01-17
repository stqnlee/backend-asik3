const form = document.getElementById('noteForm');
const notesList = document.getElementById('notesList');

async function loadNotes() {
  const response = await fetch('/notes');
  const notes = await response.json();

  notesList.innerHTML = '';
  notes.forEach(note => {
    const li = document.createElement('li');

    const date = new Date(note.createdAt).toLocaleString();

    li.innerHTML = `
      <div class="note-text">
        <strong>${note.title}</strong>
        <p>${note.content}</p>
        <em>${date}</em>
      </div>
      <button onclick="deleteNote('${note._id}')">Delete</button>
    `;

    notesList.appendChild(li);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const note = {
    title: document.getElementById('title').value,
    content: document.getElementById('content').value
  };

  await fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note)
  });

  form.reset();
  loadNotes();
});

async function deleteNote(id) {
  await fetch(`/notes/${id}`, { method: 'DELETE' });
  loadNotes();
}

// загрузка заметок при старте
loadNotes();