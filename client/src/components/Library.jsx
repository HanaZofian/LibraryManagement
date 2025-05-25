import { useEffect, useState } from "react";
import { genreOptions } from "./BookForm";

export default function Library() {
  const [book, setBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    async function selectGenre() {
      try {
        if (!selectedGenre) {
          setBooks([]);
          return;
        }
        const response = await fetch(`http://localhost:5050/book?genre=${selectedGenre}`);
        if (!response.ok) throw new Error("Fail to fetch");
        const data = await response.json();

        // Remove unavailable books
        const availableBooks = data.filter((b) => b.availability !== "Unavailable");
        setBooks(availableBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      }
    }
    selectGenre();
  }, [selectedGenre]);


  return (
    <div className="flex flex-col w-full min-h-screen p-6">
  

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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            selectedGenre ? <p className="text-gray-600">No available books in this category.</p> : <p className="text-gray-600">Select a Category</p>
          )}
        </div>
      </div>
    </div>
  );
}
