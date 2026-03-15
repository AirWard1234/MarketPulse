import React from "react";
import TopBar from "./topBar";
import { Grid } from "./grid";

const Dashboard = () => {
  return (
    <div className="bg-white rounded-2xl pb-4 shadow h-[200vh]">
        <TopBar />
        <Grid />
    </div>
  );
};

export default Dashboard;
