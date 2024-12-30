import React, { useState } from "react";

function InputField(props) {
  const {
    label,
    id,
    extra,
    type,
    placeholder,
    variant,
    state,
    disabled,
    handleChange,
    value,
  } = props;

  const [errorMessage, setErrorMessage] = useState("");

  // Validation function
  const validateInput = (value) => {
    let error = "";
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Please enter a valid email.";
    } else if (type === "tel") {
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(value)) error = "Only numbers are allowed.";
    } else if (type === "text" && id === "username") {
      const usernameRegex = /^[A-Z a-z]+$/;
      if (!usernameRegex.test(value)) error = "Only alphabets are allowed.";
    } else if (type === "date") {
      const selectedDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      const monthDiff = today.getMonth() - selectedDate.getMonth();
      const dayDiff = today.getDate() - selectedDate.getDate();

      // Adjust for the month/day difference
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }

      if (selectedDate > today) {
        error = "Date cannot be in the future.";
      } else if (age < 18) {
        error = "You must be at least 18 years old.";
      }
    }
    setErrorMessage(error);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    validateInput(newValue);
    if (handleChange) handleChange(e); // Pass the change event to parent
  };

  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm text-navy-700 dark:text-white ${
          variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
        }`}
      >
        {label}
      </label>
      <input
        disabled={disabled}
        type={type}
        id={id}
        placeholder={placeholder}
        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${
          disabled === true
            ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
            : errorMessage
            ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
            : state === "success"
            ? "border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400"
            : "border-gray-200 dark:!border-white/10 dark:text-white"
        }`}
        onChange={handleInputChange}
        value={value}
      />
      {errorMessage && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default InputField;
