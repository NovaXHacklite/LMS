import React from "react";
import { ArrowRightIcon } from "../icons/Icons";

const Breadcrumb = ({ items }) => (
  <div className="max-w-7xl mx-auto px-6 mt-6 mb-2">
    <div className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ArrowRightIcon className="w-4 h-4 text-[#00B4D8]" />}
          <span
            className={`px-3 py-1 rounded-lg transition-colors ${
              item.active
                ? "bg-[#0077B6] text-white font-medium"
                : "text-[#03045E] hover:bg-[#CAF0F8] cursor-pointer"
            }`}
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default Breadcrumb;