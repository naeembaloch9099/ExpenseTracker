import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DeleteModal from "../components/DeleteModel";

const DeleteConfirm = () => {
  const [collapsed] = useState(false);
  const [show, setShow] = useState(true);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar collapsed={collapsed} />
        <div style={{ padding: 20 }}>
          <h2>Delete Confirm Demo</h2>
          {show && (
            <DeleteModal
              title="Delete Entry"
              message="Are you sure you want to delete this entry?"
              onCancel={() => setShow(false)}
              onConfirm={() => {
                alert("deleted");
                setShow(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;
