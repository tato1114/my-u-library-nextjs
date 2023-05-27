import React from "react";

const Input = ({
    id,
    value,
    onChange,
    type = "text",
    validate,
    placeholder,
    label = "",
    error = ""
}) => {

    return (
        <div>

            <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                onChange={onChange}
                validate={validate}
                placeholder={placeholder}
            />
            {error
                ? <p className="mt-2 text-sm text-red-600"><span class="font-medium">Oops!</span>{error}</p>
                : <></>
            }
        </div>
    );
};

export default Input;