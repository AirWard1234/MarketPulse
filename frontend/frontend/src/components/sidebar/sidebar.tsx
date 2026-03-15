import React from "react";
import AccountToggle from "./accountToggle";
import Search from "./search";
import RouteSelect from "./routeSelect";


const Sidebar = () => {
  return <div>
    {/* MAIN CONTENT */}
    <div className="overflow-y-scroll sticky top-4 h-[calc(100vh-32px-48px)]">
        <AccountToggle />
        <Search />
        <RouteSelect />
    </div>
    {/* PLAN TOGGLE */}
  </div>;
};

export default Sidebar;
