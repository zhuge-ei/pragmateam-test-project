import React from "react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  errorMessage?: string;
  label?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ errorMessage, label, className, ...inputProps }, ref) => {
    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <label
            htmlFor={inputProps.id}
            className={clsx("mb-2 block text-sm font-medium", {
              "text-red-700": errorMessage,
              "text-white": !errorMessage,
            })}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...inputProps}
          className={clsx("block w-full rounded-lg border p-2.5 text-sm", {
            "border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500":
              errorMessage,
            "border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500":
              !errorMessage,
          })}
        />
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>
    );
  },
);

export default Input;
