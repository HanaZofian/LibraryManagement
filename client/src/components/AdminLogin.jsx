import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ // Store state of login values
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");  //feedback message
  const navigate = useNavigate(); //to nav to other page

  function updateForm(value) { //updating login values state
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:5050/libAuth", {
        method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(form),
});


  const data = await response.json();

    if (data.success) {
      setMessage(data.message);
       localStorage.setItem("adminToken", data.adminToken);
      setTimeout(() => {
      navigate("/Admin/ViewBook"); //after successful login, go to ViewBook in  1s
        }, 1000);
    } else {
        setMessage(data.message || "Login failed");
    }

    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Server error. Please try again later.");
    }

    // Clear form fields
    setForm({ username: "", password: "" });
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.toLowerCase().includes("successful")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1 text-sm font-medium">Username</label>
          <input
            type="text"
            id="username"
            className="w-full p-2 border rounded"
            value={form.username}
            onChange={(e) => updateForm({ username: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border rounded"
            value={form.password}
            onChange={(e) => updateForm({ password: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}

