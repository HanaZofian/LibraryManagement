import { Outlet } from "react-router-dom";

const LibraryHeader = () => {

  return (
    <div className="w-full p-6">
      <header className="bg-green-900 text-white px-6 py-4 shadow-md flex justify-between items-center rounded mb-6">
        <h1 className="text-xl font-semibold">The Library</h1>
      </header>

      <Outlet />
    </div>
  );
};

export default LibraryHeader;