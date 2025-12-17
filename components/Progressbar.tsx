import React from "react";

const Progressbar = () => {
  return (
    <div className="relative pt-4">
      <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
        {/* <span>{course.nextLesson}</span> */}
        <span className="text-gray-400">70%</span>
      </div>
      {/* <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden border border-gray-200">
        <div
          className={`h-full rounded-full ${getColorClass(
            course.subject.theme
          )}`}
          style={{
            width: `70%`,
            inset: "0",
          }}
        >
          <div className="w-full h-full bg-white/20 rounded-full"></div>
        </div>
      </div> */}
    </div>
  );
};

export default Progressbar;
