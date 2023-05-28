import React from "react";

const Input = ({
    id,
    value,
    onChange,
    type = "text",
    validate,
    placeholder,
    label = "",
}) => {

    return (
        <>
            <label htmlFor="message" className="block mb-2 mr-4 text-sm font-medium text-gray-900">{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                onChange={onChange}
                validate={validate}
                placeholder={placeholder}
            />
        </>
    );
};

export default Input;