import React from "react";
import { IconType } from "react-icons";
import { FiBook, FiBookOpen, FiDollarSign, FiHome, FiSettings, FiZap } from "react-icons/fi";

const RouteSelect = () => {
  return (
    <div className="space-y-1">
        <Route Icon = {FiHome} title="Dashboard" selected />
        <Route Icon = {FiZap} title="Portfolio" selected={false} />
        <Route Icon = {FiBookOpen} title="News" selected={false} />
        <Route Icon = {FiDollarSign} title="Finance" selected={false} />
        <Route Icon = {FiSettings} title="Settings" selected={false} />
    </div>
  );
};

export default RouteSelect;

const Route = ({
    selected,
    Icon,
    title,
} : {
        selected: boolean,
        Icon: IconType,
        title: string
}) => {
    return <button className={`flex items-center justify-start gap-2 w-full rounded-lg px-2 py-1.5 transition-colors ${selected ? "bg-stone-50" : "hover:bg-stone-200"} ${selected ? "shadow-sm" : ""}`}>
        <Icon className={selected? "text-violet-800" : ""} />
        <span>{title}</span>
    </button>
}