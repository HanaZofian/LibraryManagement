import { useEffect, useState } from "react";
import { genreOptions } from "./BookForm";
import { useNavigate } from "react-router-dom";

export default function ViewBook() {
  const [book, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const navigate = useNavigate();

  // Fetch books based on selected categories
  useEffect(() => {
    async function selectGenre() {
      try {
        if (!selectedGenre) {
          setBooks([]);
          return;
        }
        const response = await fetch(`http://localhost:5050/book?genre=${selectedGenre}`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setBooks(data.length === 0 ? [] : data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      }
    }
    selectGenre();
  }, [selectedGenre]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5050/book/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Fail to delete the book");
      }

      // Remove deleted book from state to update UI
      setBooks((prevBooks) => prevBooks.filter((delBook) => delBook._id !== id));
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Fail to delete the book.");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen p-6">
      {/* Top Buttons */}
      <div className="flex justify-end mb-6 space-x-4">
        <button
          onClick={() => navigate("/Admin/BookForm")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Book
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Log Out
        </button>
      </div>

      <div className="flex w-full flex-grow">
        {/* Categories Sidebar */}
        <div className="w-1/4 pr-6 border-r border-gray-300">
          <h2 className="text-lg font-bold mb-4">Categories</h2>
          <ul className="space-y-2">
            {genreOptions.map((genre) => (
              <li key={genre}>
                <button
                  onClick={() => setSelectedGenre(genre)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedGenre === genre
                      ? "bg-green-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {genre}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Book Display */}
        <div className="w-3/4 pl-6">
          <h2 className="text-xl font-semibold mb-4">
            {selectedGenre ? `${selectedGenre} Books` : "Select a Category"}
          </h2>

          {book.length > 0 ? (
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Author</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">ISBN</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Publication Year</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Copies</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Availability</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {book.map((bookItem, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2">{bookItem.title}</td>
                    <td className="border border-gray-300 px-4 py-2">{bookItem.author}</td>
                    <td className="border border-gray-300 px-4 py-2">{bookItem.isbn}</td>
                    <td className="border border-gray-300 px-4 py-2">{bookItem.publicationYear}</td>
                    <td className="border border-gray-300 px-4 py-2">{bookItem.copies}</td>
                    <td className="border border-gray-300 px-4 py-2">{bookItem.availability}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        className="mr-2 text-blue-600 hover:underline"
                        onClick={() => navigate(`/Admin/EditBook/${bookItem._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDelete(bookItem._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            selectedGenre ? null : <p className="text-gray-600">Select a Category</p>
          )}
        </div>
      </div>
    </div>
  );
}

