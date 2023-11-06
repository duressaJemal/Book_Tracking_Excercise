from models import Book
from database import get_db, close_db

class BookRepository:
    def get_all_books(self):
        # Get a database connection and cursor using a context manager
        with get_db() as (conn, cursor):
            cursor.execute("SELECT id, title, status FROM books")
            # Create a list of Book objects from the fetched rows
            books = [
                Book(id=row[0], title=row[1], status=row[2]) for row in cursor.fetchall()
            ]
        return books

    def get_book(self, book_id):
        # Get a database connection and cursor using a context manager
        with get_db() as (conn, cursor):
            cursor.execute("SELECT id, title, status FROM books WHERE id=?", (book_id,))
            # Create a Book object from the fetched row
            book = Book(*cursor.fetchone())
        return book

    def create_book(self, book):
        # Get a database connection and cursor using a context manager
        with get_db() as (conn, cursor):
            cursor.execute("INSERT INTO books (title, status) VALUES (?, ?)", (book.title, book.status))
            conn.commit()
            # Get the ID of the last inserted row
            book_id = cursor.lastrowid
        return self.get_book(book_id)

    def update_book(self, book_id, book):
        # Get a database connection and cursor using a context manager
        with get_db() as (conn, cursor):
            cursor.execute("UPDATE books SET title=?, status=? WHERE id=?", (book.title, book.status, book_id))
            conn.commit()
        return self.get_book(book_id)

    def delete_book(self, book_id):
        # Get a database connection and cursor using a context manager
        with get_db() as (conn, cursor):
            cursor.execute("DELETE FROM books WHERE id=?", (book_id,))
            conn.commit()