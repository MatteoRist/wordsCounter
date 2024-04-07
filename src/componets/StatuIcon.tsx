import React from "react";

interface StatusIconProps {
  success: boolean | null;
}

const StatusIcon: React.FC<StatusIconProps> = ({ success }) => {
  if (success === true) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-green-500 mt-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  } else if (success === false) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-500 mt-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    );
  } else {
    return null;
  }
};

export default StatusIcon;
