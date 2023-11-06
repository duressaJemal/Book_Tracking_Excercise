interface HeaderProps {
    newBook: {
        title: string;
        status: string;
    };
    setNewBook: (book: { title: string, status: string }) => void;
    handleAddBook: (e: React.FormEvent) => void;
}

function Header({ newBook, setNewBook, handleAddBook }: HeaderProps) {
    return (
        <div className="bg-gray-100 p-5 flex items-center justify-between backdrop-blur bg-opacity-50">
            <div className="p-10">
                <h1 className="mb-4 text-2xl font-bold">Add a New Book</h1>
                <form onSubmit={handleAddBook}>
                    <input
                        value={newBook.title}
                        onChange={(e) =>
                            setNewBook({ ...newBook, title: e.target.value })
                        }
                        placeholder="Enter book title"
                        className="border p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="ml-4 p-2 bg-blue-500 text-white rounded"
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Header;