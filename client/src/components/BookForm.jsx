import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const genreOptions = ["Biography","Adventure","Business","Fiction","Children's Book","Comedy","History","Non-Fiction","Science",].sort();

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    publicationYear: "",
    genre: "",
    copies: "",
    availability: "",
  });

  const [isNew, setIsNew] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  useEffect(() => {
    if (!id) {
      setIsNew(true);
      return;
    }

    async function fetchBook() {
      setLoading(true);
      setMessage("");
      try {
        const response = await fetch(`http://localhost:5050/book/${id}`);
        if (!response.ok) throw new Error("Fail to fetch book data.");
        const data = await response.json();

        setForm({
          title: data.title || "",
          author: data.author || "",
          isbn: data.isbn || "",
          publicationYear: data.publicationYear ? data.publicationYear.toString() : "",
          genre: data.genre || "",
          copies: data.copies !== undefined ? data.copies.toString() : "",
          availability: data.availability || "",
        });

        setIsNew(false);
      } catch (error) {
        setMessage("Fail to load data for editing.");
        console.error(error);
        setIsNew(true);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [id]);

  async function onSubmit(e) {
    e.preventDefault();

    const { title, author, isbn, publicationYear, genre, copies, availability } = form;

    // Check for empty fields
    function hasEmptyFields(fields) {
      return fields.some(
        (field) =>
          field === undefined ||
          field === null ||
          (typeof field === "string" && field.trim() === "")
      );
    }

    if (hasEmptyFields([title, author, isbn, publicationYear, genre, copies, availability])) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Validate ISBN format
    const isbnDigitsOnly = isbn.replace(/[-\s]/g, "");
    if (!/^\d{10}$/.test(isbnDigitsOnly) && !/^\d{13}$/.test(isbnDigitsOnly)) {
      setMessage("ISBN must be either 10 or 13 digits only.");
      return;
    }

    try {
      const response = await fetch(
        isNew ? "http://localhost:5050/book" : `http://localhost:5050/book/edit/${id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            publicationYear: Number(publicationYear), // convert to number before sending
            copies: Number(copies),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(isNew ? "Book added successfully!" : "Book updated successfully!");
        if (isNew) {
          setForm({
            title: "",
            author: "",
            isbn: "",
            publicationYear: "",
            genre: "",
            copies: "",
            availability: "",
          });
        }
      } else {
          setMessage(data.message || "Failed to save book.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error. Please try again later.");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isNew ? "Add a New Book" : "Edit Book"}</h2>

      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading book data...</p>
      ) : (
        <form onSubmit={onSubmit}>

          {/* Title */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              required
            />
          </div>

          {/* Author */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Author</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form.author}
              onChange={(e) => updateForm({ author: e.target.value })}
              required
            />
          </div>

          {/* ISBN - editable for add and edit */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">ISBN</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form.isbn}
              onChange={(e) => updateForm({ isbn: e.target.value })}
              required
            />
          </div>

          {/* Publication Year */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Publication Year</label>
            <select
              className="w-full p-2 border rounded"
              value={form.publicationYear}
              onChange={(e) => updateForm({ publicationYear: e.target.value })}
              required
            >
              <option value="">Select year</option>
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Genre */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Genre</label>
            <select
              className="w-full p-2 border rounded"
              value={form.genre}
              onChange={(e) => updateForm({ genre: e.target.value })}
              required
            >
              <option value="">Select genre</option>
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Copies */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Number of Copies</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={form.copies}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || Number(val) >= 1) {
                  updateForm({ copies: val });
                }
              }}
              required
              min="1"
            />
          </div>

          {/* Availability */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">Availability</label>
            <select
              className="w-full p-2 border rounded"
              value={form.availability}
              onChange={(e) => updateForm({ availability: e.target.value })}
              required
            >
              <option value="">Select:</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {isNew ? "Add Book" : "Update Book"}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/Admin/ViewBook")}
            className="w-full mt-4 bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400"
          >
            Back
          </button>
        </form>
      )}
    </div>
  );
}
