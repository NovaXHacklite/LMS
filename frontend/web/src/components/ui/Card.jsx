import React from "react";

const Card = ({ title, subtitle, onClick, icon, className = "" }) => (
  <div
    onClick={onClick}
    className={`group relative bg-white/70 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl p-6 m-3 cursor-pointer w-80 border border-[#CAF0F8] hover:border-[#00B4D8] hover:-translate-y-1 ${className}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#CAF0F8]/10 to-[#90E0EF]/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
    <div className="relative z-10">
      {icon && (
        <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-[#0077B6] to-[#00B4D8] rounded-lg flex items-center justify-center text-white shadow-sm">
          {icon}
        </div>
      )}
      <h4 className="text-lg font-semibold text-[#03045E] mb-2 text-center group-hover:text-[#0077B6] transition-colors">{title}</h4>
      {subtitle && (
        <p className="text-sm text-gray-600 text-center leading-relaxed">{subtitle}</p>
      )}
    </div>
  </div>
);

export default Card;