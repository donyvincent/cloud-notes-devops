import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch
from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as c:
        yield c


@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_create_and_get_note(client):
    payload = {"title": "Test Note", "content": "Some content", "tags": "test"}
    create_resp = await client.post("/notes/", json=payload)
    assert create_resp.status_code == 201
    note_id = create_resp.json()["id"]

    get_resp = await client.get(f"/notes/{note_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["title"] == "Test Note"


@pytest.mark.asyncio
async def test_update_note(client):
    payload = {"title": "Original", "content": "Content", "tags": ""}
    create_resp = await client.post("/notes/", json=payload)
    note_id = create_resp.json()["id"]

    update_resp = await client.patch(f"/notes/{note_id}", json={"title": "Updated"})
    assert update_resp.status_code == 200
    assert update_resp.json()["title"] == "Updated"


@pytest.mark.asyncio
async def test_delete_note(client):
    payload = {"title": "To Delete", "content": "Content", "tags": ""}
    create_resp = await client.post("/notes/", json=payload)
    note_id = create_resp.json()["id"]

    del_resp = await client.delete(f"/notes/{note_id}")
    assert del_resp.status_code == 204

    get_resp = await client.get(f"/notes/{note_id}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_voice_to_note(client):
    mock_result = {"title": "Meeting Notes", "content": "## Summary\n- point 1", "tags": "meeting"}
    with patch(
        "app.routers.ai.voice_to_structured_note", new=AsyncMock(return_value=mock_result)
    ):
        resp = await client.post("/ai/voice-to-note", json={"raw_text": "talked about the project today"})
        assert resp.status_code == 200
        assert resp.json()["title"] == "Meeting Notes"


@pytest.mark.asyncio
async def test_debate_mode(client):
    payload = {"title": "Test", "content": "Remote work is better", "tags": ""}
    create_resp = await client.post("/notes/", json=payload)
    note_id = create_resp.json()["id"]

    mock_result = {
        "original_position": "Remote work is better",
        "counter_argument": "In-office has benefits...",
        "key_weaknesses": ["isolation", "communication lag"],
        "steelman": "Remote work can be effective with right tooling",
    }
    with patch("app.routers.ai.debate_mode", new=AsyncMock(return_value=mock_result)):
        resp = await client.post(
            "/ai/debate", json={"note_id": note_id, "position": "Remote work is better"}
        )
        assert resp.status_code == 200
        assert len(resp.json()["key_weaknesses"]) == 2
