import { Book } from "../model/model";

interface BookSectionProps {
    setBooks: (books: Book[]) => void;
    title: string;
    books: Book[];
    onMoveBook: (bookId: number) => void;
    onTakeBackBook: (bookId: number) => void;
    onDeleteBook: (bookId: number) => void;
    getPreviousStatus: (books: Book[], bookId: number) => string;
    getNextStatus: (books: Book[], bookId: number) => string;
  }
  
  export function BookSection({
    title,
    books,
    onMoveBook,
    onTakeBackBook,
    onDeleteBook,
    getPreviousStatus,
    getNextStatus,
  }: BookSectionProps) {
  
    return (
      <section className="p-12 bg-gray-100   text-black space-y-8 flex flex-col justify-start">
        <div className="border border-gray-700 bg-gray-700 text-white text-stone-950 text-2xl font-bold p-4  rounded-t-lg">
          <h1>{title}</h1>
        </div>
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-gray-200 p-5 py-7 rounded-lg flex flex-col shadow-md"
          >
  
            <div className="py-3 font-bold text-xl">Title: {book.title}</div>
  
            <div className="flex items-between p-3">
              {!(book.status === "To Read") && (
                <button
                  type="button"
                  className="border border-gray-700 bg-gray-700 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-800 focus:outline-none focus:shadow-outline"
                  onClick={() => onTakeBackBook(book.id)}
                  disabled={book.status === "To Read"}
                >
                  Take Back {getPreviousStatus(books, book.id)}
                </button>
              )}
  
              {!(book.status === "Completed") && (
                <button
                  type="button"
                  className="border border-gray-700 bg-gray-700 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-800 focus:outline-none focus:shadow-outline"
                  onClick={() => onMoveBook(book.id)}
                  disabled={book.status === "Completed"}
                >
                  Move to {getNextStatus(books, book.id)}
                </button>
              )}
  
              <button
                type="button"
                className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline"
                onClick={() => onDeleteBook(book.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    );
  }
  


