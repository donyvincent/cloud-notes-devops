from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NoteCreate(BaseModel):
    title: str
    content: str
    tags: str = ""


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    tags: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class GraphEdge(BaseModel):
    source_id: int
    target_id: int
    similarity: float
    relationship: str


class GraphResponse(BaseModel):
    nodes: list[NoteResponse]
    edges: list[GraphEdge]


class VoiceToNoteRequest(BaseModel):
    raw_text: str


class VoiceToNoteResponse(BaseModel):
    title: str
    content: str
    tags: str


class DebateRequest(BaseModel):
    note_id: int
    position: str


class DebateResponse(BaseModel):
    original_position: str
    counter_argument: str
    key_weaknesses: list[str]
    steelman: str
