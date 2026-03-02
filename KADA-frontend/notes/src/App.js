import { useEffect, useMemo, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from './services/notesApi';

function normalizeNotes(payload) {
  const raw = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.notes)
        ? payload.notes
        : [];

  return raw.map((item, index) => ({
    id: item?._id ?? item?.id ?? index,
    author: item?.author ?? '',
    title: item?.title ?? '(Tanpa judul)',
    content: item?.content ?? ''
  }));
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  async function fetchAllNotes() {
    setLoading(true);
    setError('');
    try {
      const data = await getNotes();
      setNotes(normalizeNotes(data));
    } catch (err) {
      setError(err.message || 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllNotes();
  }, []);

  function resetForm() {
    setAuthor('');
    setTitle('');
    setContent('');
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = { author, title, content };

    try {
      if (isEditing) {
        await updateNote(editingId, payload);
      } else {
        await createNote(payload);
      }
      resetForm();
      await fetchAllNotes();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan data');
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(note) {
    setEditingId(note.id);
    setAuthor(note.author);
    setTitle(note.title);
    setContent(note.content);
  }

  async function handleDelete(id) {
    const ok = window.confirm('Hapus note ini?');
    if (!ok) return;

    setError('');
    try {
      await deleteNote(id);
      await fetchAllNotes();
    } catch (err) {
      setError(err.message || 'Gagal menghapus data');
    }
  }

  return (
    <main className="container">
      <h1>Notes CRUD</h1>

      <form onSubmit={handleSubmit} className="card form">
        <h2>{isEditing ? 'Edit Note' : 'Tambah Note'}</h2>

        <label htmlFor="author">Author</label>
        <input
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Masukkan author"
          required
        />

        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul"
          required
        />

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Masukkan isi note"
          rows={4}
          required
        />

        <div className="actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Menyimpan...' : isEditing ? 'Update' : 'Tambah'}
          </button>

          {isEditing && (
            <button type="button" className="secondary" onClick={resetForm}>
              Batal
            </button>
          )}
        </div>
      </form>

      <section className="card">
        <div className="list-head">
          <h2>Daftar Note</h2>
          <button type="button" className="secondary" onClick={fetchAllNotes} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        {!loading && notes.length === 0 && <p className="empty">Belum ada note.</p>}

        <ul className="notes">
          {notes.map((note) => (
            <li key={String(note.id)}>
              <h3>{note.title}</h3>
              <p>
                <strong>Author:</strong> {note.author || '-'}
              </p>
              <p>{note.content}</p>

              <div className="actions">
                <button type="button" className="secondary" onClick={() => handleEdit(note)}>
                  Edit
                </button>
                <button type="button" className="danger" onClick={() => handleDelete(note.id)}>
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
