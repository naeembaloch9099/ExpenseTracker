import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import IconPickerModal from "../components/IconPickerModel";

const IconPicker = () => {
  const [collapsed] = useState(false);
  const [show, setShow] = useState(true); // show Modal directly
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar collapsed={collapsed} />
        <div style={{ padding: 20 }}>
          <h2>Icon Picker</h2>
          <p>Pick icon modal demo.</p>
          {show && (
            <IconPickerModal
              onClose={() => setShow(false)}
              onSelect={(ic) => {
                console.log("chosen", ic);
                setShow(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IconPicker;
