let notes = [
  {
    id: 1,
    author: 'Ninditya',
    title: 'first note',
    content: 'My first note is here.'
  }
];

export const list = () => {
  return notes.map(({ id, title }) => ({ id, title }));
};

export const get = (id) => {
  const note = notes.find((note) => note.id === id);
  if (!note) {
    throw new Error('Note not found');
  }
  return note;
};

export const create = (title, content) => {
  const lastId = notes.length ? notes[notes.length - 1].id : 0;

  const newNote = {
    id: lastId + 1,
    author,
    title,
    content
  };

  notes.push(newNote);
  return newNote;
};

export const update = (id, title, content) => {
  const index = notes.findIndex((note) => note.id === id);

  if (index < 0) {
    throw new Error('Note not found for update');
  }

  notes[index] = {
    ...notes[index],
    author,
    title,
    content,
  };

  return notes[index];
};

export const remove = (id) => {
 const exists = notes.some((note) => note.id === id);

 if (!exists) {
   throw new Error('Note not found for deletion');
 }
 notes = notes.filter((note) => note.id !== id);
};