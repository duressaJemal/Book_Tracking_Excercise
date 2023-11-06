from models import Book
from database import get_db, close_db


class BookRepository:
    def get_all_books(self):
        conn, cursor = get_db()
        cursor.execute("SELECT id, title, status FROM books")
        books = [
            Book(id=row[0], title=row[1], status=row[2]) for row in cursor.fetchall()
        ]

        close_db()
        return books

    def get_book(self, book_id):
        conn, cursor = get_db()
        cursor.execute("SELECT id, title, status FROM books WHERE id=?", (book_id,))
        book = Book(*cursor.fetchone())
        close_db()
        return book

    def create_book(self, book):
        conn, cursor = get_db()
        cursor.execute(
            "INSERT INTO books (title, status) VALUES (?, ?)", (book.title, book.status)
        )
        conn.commit()
        book_id = cursor.lastrowid
        close_db()
        return self.get_book(book_id)

    def update_book(self, book_id, book):
        conn, cursor = get_db()
        cursor.execute(
            "UPDATE books SET title=?, status=? WHERE id=?",
            (book.title, book.status, book_id),
        )
        conn.commit()
        updated_book = self.get_book(book_id)
        close_db()
        return updated_book

    def delete_book(self, book_id):
        conn, cursor = get_db()
        cursor.execute("DELETE FROM books WHERE id=?", (book_id,))
        conn.commit()
        close_db()
