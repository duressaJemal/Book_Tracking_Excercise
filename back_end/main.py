from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from repository import BookRepository
from models import Book
from database import get_db, close_db, create_books_table

app = FastAPI()

class BookCreate(BaseModel):
    title: str
    status: str

repository = BookRepository()

# Event handler for startup, creating the 'books' table if it doesn't exist
@app.on_event("startup")
async def startup_event():
    await create_books_table()

# Event handler for shutdown, closing the repository connection
@app.on_event("shutdown")
async def shutdown_event():
    await repository.close()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint to retrieve all books
@app.get("/books", response_model=List[Book])
async def read_books():
    return await repository.get_all_books()

# Endpoint to retrieve a specific book by ID
@app.get("/books/{book_id}", response_model=Book)
async def read_book(book_id: int):
    book = await repository.get_book(book_id)
    if book:
        return book
    raise HTTPException(status_code=404, detail="Book not found")

# Endpoint to create a new book
@app.post("/books", response_model=Book)
async def create_book(book: BookCreate):
    return await repository.create_book(book)

# Endpoint to update an existing book
@app.put("/books/{book_id}", response_model=Book)
async def update_book(book_id: int, book: BookCreate):
    existing_book = await repository.get_book(book_id)
    if not existing_book:
        raise HTTPException(status_code=404, detail="Book not found")
    existing_book.status = book.status
    return await repository.update_book(book_id, existing_book)

# Endpoint to delete a book by ID
@app.delete("/books/{book_id}", response_model=Book)
async def delete_book(book_id: int):
    existing_book = await repository.get_book(book_id)
    if not existing_book:
        raise HTTPException(status_code=404, detail="Book not found")
    await repository.delete_book(book_id)
    return existing_book

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, port=9000)