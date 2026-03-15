import React from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const AccountToggle = () => {
  return (
    <div className="border-b mb-4 mt-2 pb-2 border-stone-300">
        <button className="flex p-0.5 hover:bg-stone-200 rounded transition-colors relative gap-2 w-full items-center">
            <img
                src="https://api.dicebear.com/9.x/thumbs/svg?seed=Robert"
                alt="avatar"
                className="size-8 rounded shrink-0 bg-violet-500 shadow"
            />
            <div className="text-start">
                <span className="text-sm font-medium block">Aleksandre Shtikov</span>
                <span className="text-xs text-stone-500 block">sshtikov@uwaterloo.ca</span>
            </div>

            <FiChevronDown className="absolute right-2 top-1/2 translate-y-[calc(-50%+4px)] text-xs" />
            <FiChevronUp className="absolute right-2 top-1/2 translate-y-[calc(-50%-4px)] text-xs" />

        </button>
    </div>
  );
};

export default AccountToggle;
