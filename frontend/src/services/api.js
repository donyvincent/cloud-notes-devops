import axios from "axios";

const api = axios.create({ baseURL: "" });

export const getNotes = () => api.get("/notes/").then((r) => r.data);
export const getNote = (id) => api.get(`/notes/${id}`).then((r) => r.data);
export const createNote = (data) => api.post("/notes/", data).then((r) => r.data);
export const updateNote = (id, data) => api.patch(`/notes/${id}`, data).then((r) => r.data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

export const getGraph = () => api.get("/ai/graph").then((r) => r.data);
export const voiceToNote = (raw_text) =>
  api.post("/ai/voice-to-note", { raw_text }).then((r) => r.data);
export const debateNote = (note_id, position) =>
  api.post("/ai/debate", { note_id, position }).then((r) => r.data);
