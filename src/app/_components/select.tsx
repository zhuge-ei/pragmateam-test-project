import React from "react";
import clsx from "clsx";

type Option = {
  value: string;
  label: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  errorMessage?: string;
  label?: string;
  options: Option[];
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ errorMessage, label, options, className, ...selectProps }, ref) => {
    return (
      <div className={clsx("flex w-full flex-col items-center", className)}>
        {label && (
          <label
            htmlFor={selectProps.id}
            className={clsx("mb-2 block text-sm font-medium", {
              "text-red-700": errorMessage,
              "text-white": !errorMessage,
            })}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          {...selectProps}
          className={clsx(
            "block w-32 rounded-lg border p-2.5 text-center text-sm",
            {
              "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500":
                errorMessage,
              "border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500":
                !errorMessage,
            },
          )}
        >
          <option>Unset</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
      </div>
    );
  },
);

export default Select;
