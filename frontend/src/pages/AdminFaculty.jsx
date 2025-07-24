import React, { useState } from "react";
import AddFacultyForm from "../components/AddFacultyForm";
import FacultyList from "../components/FacultyList";
import EditFacultyModal from "../components/EditFacultyModal";

const AdminFaculty = () => {
  const [editFaculty, setEditFaculty] = useState(null);
  const [facultyListReload, setFacultyListReload] = useState(0);
  const [facultySearch, setFacultySearch] = useState("");

  // Called after a new faculty is added
  const handleFacultyAdded = () => {
    setFacultyListReload((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 min-h-screen bg-gray-50">
      {/* Left: Add Faculty Form */}
      <div className="flex-1 max-w-lg">
        <AddFacultyForm onFacultyAdded={handleFacultyAdded} />
      </div>
      {/* Right: Faculty List */}
      <div className="flex-1">
        {/* Faculty Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search faculty by initial or department..."
            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={facultySearch || ""}
            onChange={(e) => setFacultySearch(e.target.value)}
          />
        </div>
        <FacultyList
          onEditFaculty={setEditFaculty}
          reloadKey={facultyListReload}
          searchQuery={facultySearch}
        />
      </div>
      {/* Edit Faculty Modal */}
      <EditFacultyModal
        open={!!editFaculty}
        onClose={() => setEditFaculty(null)}
        faculty={editFaculty}
      />
    </div>
  );
};

export default AdminFaculty;
