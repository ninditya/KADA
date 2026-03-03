// Legacy in-memory note helper (not used by active MongoDB routes)
let notes = [];
let nextId = 1;

// Mengembalikan semua note di memory.
export function list() {
  return notes;
}

// Mengambil satu note berdasarkan id.
export function get(id) {
  return notes.find((note) => note.id === Number(id)) || null;
}

// Menambahkan note baru dan auto-increment id.
export function create({ author, title, content }) {
  const note = { id: nextId++, author, title, content };
  notes.push(note);
  return note;
}

// Memperbarui note jika id ditemukan.
export function update(id, data) {
  const note = get(id);
  if (!note) return null;

  Object.assign(note, data);
  return note;
}

// Menghapus note berdasarkan id dan mengembalikan status berhasil/tidak.
export function remove(id) {
  const before = notes.length;
  notes = notes.filter((note) => note.id !== Number(id));
  return notes.length !== before;
}
