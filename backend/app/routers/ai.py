from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.note import Note
from app.schemas.note import (
    GraphResponse,
    VoiceToNoteRequest,
    VoiceToNoteResponse,
    DebateRequest,
    DebateResponse,
)
from app.services.claude_service import voice_to_structured_note, debate_mode
from app.services.graph_service import build_knowledge_graph

router = APIRouter(prefix="/ai", tags=["ai"])


@router.get("/graph", response_model=GraphResponse)
async def knowledge_graph(db: AsyncSession = Depends(get_db)):
    return await build_knowledge_graph(db)


@router.post("/voice-to-note", response_model=VoiceToNoteResponse)
async def voice_to_note(body: VoiceToNoteRequest):
    result = await voice_to_structured_note(body.raw_text)
    return VoiceToNoteResponse(**result)


@router.post("/debate", response_model=DebateResponse)
async def debate(body: DebateRequest, db: AsyncSession = Depends(get_db)):
    note = await db.get(Note, body.note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    result = await debate_mode(note.content, body.position)
    return DebateResponse(**result)
