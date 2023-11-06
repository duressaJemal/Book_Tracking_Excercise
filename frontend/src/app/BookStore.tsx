"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";
import { Book } from "./model/model";
import { BASE_URL } from "./util/constants";
import { BookSection } from "./components/BookSection"
import { NavBar } from "./components/NavBar";
import Header from "./components/Header";


export default function BookStore() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const [newBook, setNewBook] = useState<{
    title: string;
    status: string;
  }>({
    title: "",
    status: "To Read",
  });

  useEffect(() => {
    const getBooks = async () => {
      try {
        const booksFromServer = await axios.get<Book[]>(
          BASE_URL
        );
        setBooks(booksFromServer.data);
      } catch (err: any) {
        setError(err.message);
        setOpenSnackbar(true);
      }
    };

    getBooks();
  }, []);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<Book>(
        BASE_URL,
        newBook
      );
      setBooks([...books, response.data]);
      setNewBook({ title: "", status: "To Read" });
    } catch (err: any) {
      setError(err.message);
      setOpenSnackbar(true);
    }
  };

  const handleMoveBook = (bookId: number) => {
    handleUpdateBookStatus(bookId, getNextStatus(books, bookId));
  };

  const handleTakeBackBook = (bookId: number) => {
    handleUpdateBookStatus(bookId, getPreviousStatus(books, bookId));
  };

  const handleClose = () => {
    setOpenSnackbar(false);
  };

  const handleUpdateBookStatus = async (bookId: number, newStatus: string) => {
    try {
      await axios.put(`${BASE_URL}/${bookId}`, {
        title: "",
        status: newStatus,
      });
      const updatedBooks = books.map((book) =>
        book.id === bookId ? { ...book, status: newStatus } : book
      );
      setBooks(updatedBooks);
    } catch (err: any) {
      setError(err.message);
      setOpenSnackbar(true);
    }
  };



  const handleDeleteBook = async (bookId: number) => {
    try {
      await axios.delete(`${BASE_URL}/${bookId}`);
      const updatedBooks = books.filter((book) => book.id !== bookId);
      setBooks(updatedBooks);
    } catch (err: any) {
      setError(err.message);
      setOpenSnackbar(true);
    }
  };

  const getNextStatus = (books: Book[], bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      switch (book.status) {
        case "To Read":
          return "In Progress";
        case "In Progress":
          return "Completed";
        default:
          return book.status;
      }
    }
    return "To Read";
  };

  const getPreviousStatus = (books: Book[], bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      switch (book.status) {
        case "In Progress":
          return "To Read";
        case "Completed":
          return "In Progress";
        default:
          return book.status;
      }
    }
    return "To Read";
  };

  return (
    <div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <NavBar />
      <main className="flex flex-col bg-gray-100 justify-center items-center text-very-light-gray">
        <div className="container">
          <div className="bg-gray-100 p-5 flex items-center justify-between backdrop-blur bg-opacity-50">

            <Header newBook={newBook} setNewBook={setNewBook} handleAddBook={(e : React.FormEvent) => {
              handleAddBook(e);
            }} />



          </div>

          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="container grid grid-cols md:grid-cols-3 md:h-[95vh]">
              <BookSection
                setBooks={setBooks}
                title="To Read"
                books={books.filter((book) => book.status === "To Read")}
                onMoveBook={handleMoveBook}
                onTakeBackBook={handleTakeBackBook}
                onDeleteBook={handleDeleteBook}
                getNextStatus={getNextStatus}
                getPreviousStatus={getPreviousStatus}
              />
              <BookSection
                setBooks={setBooks}
                title="In Progress"
                books={books.filter((book) => book.status === "In Progress")}
                onMoveBook={handleMoveBook}
                onTakeBackBook={handleTakeBackBook}
                onDeleteBook={handleDeleteBook}
                getNextStatus={getNextStatus}
                getPreviousStatus={getPreviousStatus}
              />
              <BookSection
                setBooks={setBooks}
                title="Completed"
                books={books.filter((book) => book.status === "Completed")}
                onMoveBook={handleMoveBook}
                onTakeBackBook={handleTakeBackBook}
                onDeleteBook={handleDeleteBook}
                getPreviousStatus={getPreviousStatus}
                getNextStatus={getNextStatus}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

