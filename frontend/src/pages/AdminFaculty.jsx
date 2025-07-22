import React, { useState } from "react";
import AddFacultyForm from "../components/AddFacultyForm";
import FacultyList from "../components/FacultyList";
import EditFacultyModal from "../components/EditFacultyModal";

const AdminFaculty = () => {
  const [editFaculty, setEditFaculty] = useState(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 min-h-screen bg-gray-50">
      {/* Left: Add Faculty Form */}
      <div className="flex-1 max-w-lg">
        <AddFacultyForm />
      </div>
      {/* Right: Faculty List */}
      <div className="flex-1">
        <FacultyList onEditFaculty={setEditFaculty} />
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
