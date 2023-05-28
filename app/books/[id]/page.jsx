"use client"

import Button from '@/components/elements/Button';
import Spinner from '@/components/elements/Spinner';
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
    const isNormalUser = session?.user?.role == 'user';
    const url = `${process.env.SERVER_HOST ?? 'localhost'}/api/books/${params.id != 'new' ? params.id : ''}`
    const headers = { 'Authorization': 'Bearer ' + token }
    const [{ data, loading, error }, executeGet] = useAxios({ url, headers: headers }, { manual: true });

    const { register, handleSubmit, setValue, watch, formState: { errors }, } = useForm({});

    useEffect(() => {
        if (params.id != 'new') {
            executeGet();
        }
    }, []);
    const [
        { data: putData, loading: putLoading, error: putError },
        executePut
    ] = useAxios(
        {
            url: url,
            method: params.id == 'new' ? 'POST' : 'PUT',
            headers: headers
        },
        { manual: true }
    )

    const onSubmit = async (data) => {
        await executePut({ data: { ...data } })
            .then(() => {
                setDataStored(true)
            })
    };


    const [
        { data: checkOutData, loading: checkOutLoading, error: checkOutError },
        executeCheckOut
    ] = useAxios(
        {
            url: `${process.env.SERVER_HOST ?? 'localhost'}/api/books/${data?.id}/check_outs`,
            method: 'POST',
            headers: headers
        },
        { manual: true }
    )

    const checkOut = async () => {
        await executeCheckOut({ data: { ...data } })
            .then(() => {
                setDataStored(true)
            })
    }

    let body
    if (dataStored) {
        body = <div className='h-screen'>
            <Link href="/books" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                Data stored successfully, click here to return to books list
            </Link>
        </div>;
    }

    if (loading) {
        body = <div className='h-screen'>
            <Spinner />
        </div>;
    }
    if (error) {
        body = <p>Error...</p>;
    }

    if ((data || params.id == 'new') && !dataStored) {
        if (data) {
            setValue("title", data.title)
            setValue("author", data.author)
            setValue("published_year", data.published_year)
            setValue("genre", data.genre)
            setValue("stock", data.stock)
        }
        body = <>
            <nav className="flex self-start mb-8" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link href="/books" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                            /Return to books list
                        </Link>
                    </li>
                </ol>
            </nav>

            <form className='w-full' onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6 w-1/2">
                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                    <input type="text" {...register("title", { required: { value: true, message: "This field is required" } })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" readOnly={isNormalUser} />
                    {errors.title && <div className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.title.message} </div>}
                </div>
                <div className="mb-6 w-1/2">
                    <label htmlFor="author" className="block mb-2 text-sm font-medium text-gray-900">Author</label>
                    <input type="text" {...register("author", { required: { value: true, message: "This field is required" } })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" readOnly={isNormalUser} />
                    {errors.author && <div className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.author.message} </div>}
                </div>
                <div className="mb-6 w-1/2">
                    <label htmlFor="published_year" className="block mb-2 text-sm font-medium text-gray-900">Release year</label>
                    <input type="text" {...register("published_year", { required: { value: true, message: "This field is required" } })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" readOnly={isNormalUser} />
                    {errors.published_year && <div className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.published_year.message} </div>}
                </div>
                <div className="mb-6 w-1/2">
                    <label htmlFor="genre" className="block mb-2 text-sm font-medium text-gray-900">Genre</label>
                    <input type="text" {...register("genre", { required: { value: true, message: "This field is required" } })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" readOnly={isNormalUser} />
                    {errors.genre && <div className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.genre.message} </div>}
                </div>
                <div className="mb-6 w-1/2">
                    <label htmlFor="stock" className="block mb-2 text-sm font-medium text-gray-900">Stock</label>
                    <input type="number" {...register("stock", { required: { value: true, message: "This field is required" }, min: { value: 0, message: "The minimum value is 0" } })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" readOnly={isNormalUser} />
                    {errors.stock && <div className="rounded  border border-red-600 bg-red-50 p-1 text-red-600">{errors.stock.message} </div>}
                </div>
                {isNormalUser
                    ? <Button onClick={(e) => {
                        e.preventDefault();
                        checkOut()
                    }}
                    >
                        Request check out
                    </Button>
                    : <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>}
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