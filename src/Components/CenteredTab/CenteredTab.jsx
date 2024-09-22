import React, { useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";

import "./CenteredTab.css"

export default function CenteredTabs({ activeTab, handleTabClick, children }) {
  const [value, setValue] = useState(activeTab || 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleTabClick(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Tabs value={value} onChange={handleChange} centered rtl="true">
       {children}
      </Tabs>
    </Box>
  );
}
