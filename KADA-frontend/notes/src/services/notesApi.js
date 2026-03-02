const BASE_URL = 'https://www.ninditya.my.id/notes';

async function parseResponse(res) {
  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getNotes() {
  const res = await fetch(BASE_URL);
  return parseResponse(res);
}

export async function createNote(payload) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return parseResponse(res);
}

export async function updateNote(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return parseResponse(res);
}

export async function deleteNote(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return parseResponse(res);
}
