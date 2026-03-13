import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
import database, models, schemas
from auth_verify import get_current_user, CurrentUser
from helpers import create_audit_log

router = APIRouter(tags=["documents"])
UPLOAD_BASE = os.environ.get("UPLOAD_PATH", "/app/uploads")


@router.get("/documents", response_model=list[schemas.DocumentResponse])
def list_documents(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(database.get_db)):
    return db.query(models.Document).filter(models.Document.owner_id == current_user.id, models.Document.is_vault == True).all()


@router.post("/documents/upload", response_model=schemas.DocumentResponse)
async def upload_document(
    doc_type: str = Form(...), file: UploadFile = File(...),
    application_id: int = Form(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(database.get_db),
):
    user_dir = os.path.join(UPLOAD_BASE, str(current_user.id))
    os.makedirs(user_dir, exist_ok=True)
    safe_name = file.filename.replace(" ", "_")
    file_path = os.path.join(user_dir, safe_name)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    doc = models.Document(owner_id=current_user.id, application_id=application_id, doc_type=doc_type,
                          filename=safe_name, file_path=file_path, file_size=len(content), is_vault=True)
    db.add(doc)
    create_audit_log(db, current_user.id, current_user.email, "document.uploaded", "document",
                     detail={"doc_type": doc_type, "filename": safe_name})
    db.commit()
    db.refresh(doc)
    return doc


@router.delete("/documents/{doc_id}")
def delete_document(doc_id: int, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(database.get_db)):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if not doc: raise HTTPException(status_code=404, detail="Not found")
    if doc.owner_id != current_user.id and current_user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=403, detail="Not authorised")
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted"}
