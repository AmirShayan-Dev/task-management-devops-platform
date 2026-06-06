from pydantic import BaseModel
from typing import Optional


class TaskCreate(BaseModel):
    title: str
    status: Optional[str] = "todo"
    owner_id: Optional[int] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    status: str
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True
