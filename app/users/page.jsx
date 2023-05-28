"use client"

import useAxios from 'axios-hooks';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

function Book({ params }) {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        }
    })
    const [dataStored, setDataStored] = useState(false);
    const token = session?.user?.token;
    const url = `${process.env.SERVER_HOST ?? 'localhost'}/api/auth/register`
    const headers = { 'Authorization': 'Bearer ' + token }

    const { register, handleSubmit, watch, formState: { errors }, } = useForm({});

    const [
        { data: putData, loading: putLoading, error: putError },
        executePost
    ] = useAxios(
        {
            url: url,
            method: 'POST',
            headers: headers
        },
        { manual: true }
    )

    const onSubmit = async (data) => {
        await executePost({ data: { ...data } })
            .then(() => {
                setDataStored(true)
            })
    };

    let body
    if (dataStored) {
        body = <div className='h-screen'>
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                Data stored successfully, click here to return home
            </Link>
        </div>;
    }

    if (!dataStored) {
        body = <>

            <nav className="flex self-start mb-8" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link href="/books" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                            /Return to home
                        </Link>
                    </li>
                </ol>
            </nav>

            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6 w-1/2">
                    <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900">Role</label>
                    <select
                        id="role"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        {...register("role", { required: { value: true, message: "This field is required" } })}
                    >
                        <option value='user' defaultChecked>User</option>
                        <option value='librarian'>Librarian</option>
                    </select>
                    {errors.role && <p className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.role.message} </p>}
                </div>
                <div className="mb-6 w-1/2">
                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">First name</label>
                    <input type="text" {...register("first_name", { required: { value: true, message: "This field is required" } })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                    {errors.first_name && <p className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.first_name.message} </p>}
                </div>
                <div className="mb-6 w-1/2">
                    <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900">Last name</label>
                    <input type="text" {...register("last_name", { required: { value: true, message: "This field is required" } })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                    {errors.last_name && <p className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.last_name.message} </p>}
                </div>
                <div className="mb-6 w-1/2">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">email</label>
                    <input type="email" {...register("email", { required: { value: true, message: "This field is required" } })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                    {errors.email && <p className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.email.message} </p>}
                </div>
                <div className="mb-6 w-1/2">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                    <input type="password" {...register("password", {
                        required: { value: true, message: "This field is required" },
                        min: { value: 8, message: "Password must be at least 8 characters long" },
                        pattern: { value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, message: "Password must have an uppercase letter, a lowercase letter, a number and a special character" }
                    })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                    {errors.password && <p className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.password.message} </p>}
                </div>
                <div className="mb-6 w-1/2">
                    <label htmlFor="password_confirmation" className="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                    <input type="password" {...register("password_confirmation", {
                        required: { value: true, message: "This field is required" }, min: 8, validate: (val) => {
                            if (watch('password') != val) {
                                return "Your passwords do no match";
                            }
                        }
                    })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                    {errors.password_confirmation && <p className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.password_confirmation.message} </p>}
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

            </form>
        </>
    }
    return (
        <main className="px-24 py-12 w-full flex flex-col justify-center items-center">
            {body}
        </main>
    )
}

export default Book