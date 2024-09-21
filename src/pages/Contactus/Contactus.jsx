import React, {useState} from "react";

import SideMenu from "../../Components/SideMenu/SideMenu";
import BottomBar from "../../Components/BottomBar/BottomBar";

import { IoIosClose, IoIosMenu } from "react-icons/io";

export default function Contactus() {

    
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };


  return (
    <div>
      <SideMenu isOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
      <div className="side-menu__icon" onClick={toggleSideMenu}>
          <IoIosMenu />
        </div>
      <BottomBar />
    </div>
  );
}
