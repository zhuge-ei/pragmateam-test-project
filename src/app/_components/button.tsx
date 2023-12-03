import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

const Button: React.FC<ButtonProps> = ({
  label,
  className,
  ...buttonProps
}) => {
  return (
    <button
      {...buttonProps}
      className={clsx(
        "rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-600 disabled:cursor-not-allowed",
        className,
      )}
    >
      {label}
    </button>
  );
};

export default Button;
