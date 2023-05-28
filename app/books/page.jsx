"use client"
import Button from '@/components/elements/Button';
import Input from '@/components/elements/Input';
import Pagination from '@/components/elements/Pagination';
import Spinner from '@/components/elements/Spinner';
import Table from '@/components/elements/Table';
import useAxios from 'axios-hooks';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function Books() {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        }
    })
    const [inputFilter, setInputFilter] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [rowSelected, setRowSelected] = useState();

    const token = session?.user?.token;
    const defaultUrl = `${process.env.SERVER_HOST ?? 'localhost'}/api/books?page_size=${pageSize}`
    const [url, setUrl] = useState(defaultUrl);
    const [{ data, loading, error }, executeAxios] = useAxios({ url, headers: { 'Authorization': 'Bearer ' + token } }, { manual: true });
    const [trigger, setTrigger] = useState(false);

    useEffect(() => {
        executeAxios();
    }, [url, trigger]);

    const [{ dataDelete, loadingDelete, errorDelete }, executeDelete] =
        useAxios({
            url: `${process.env.SERVER_HOST ?? 'localhost'}/api/books/${data?.data[rowSelected]?.id}`,
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        },
            { manual: true });

    const deleteBook = async () => {
        if (confirm(`Are you sure you want to delete this book? ${data?.data[rowSelected]?.title}`)) {
            await executeDelete()
                .then(setTrigger(!trigger));
        }
    }

    const moveToPage = (page) => {
        let querySelectors = `&page_size=${pageSize}`;
        if (inputFilter.length > 0) {
            querySelectors += `&filter=${inputFilter}`
        }
        const newUrl = page + querySelectors;
        setUrl(newUrl)
    }

    const search = async () => {
        let querySelectors = "";
        if (inputFilter.length > 0) {
            querySelectors += `&filter=${inputFilter}`
        }
        const oldUrl = url;
        const newUrl = defaultUrl + querySelectors;
        setUrl(newUrl);
        if (oldUrl == newUrl) {
            setTrigger(!trigger)
        }
    }

    let body
    if (loading) {
        body = <div className='h-screen'>
            <Spinner />
        </div>;
    }
    if (error) {
        body = <p>Error...</p>;
    }
    if (data) {
        const columns = [
            { "field": 'title', "name": "Title" },
            { "field": 'author', "name": "Author" },
            { "field": 'published_year', "name": "Published year" },
            { "field": 'genre', "name": "Genre" },
            { "field": 'stock', "name": "Stock" },
        ]
        body = <>
            <div className='flex self-start items-center mb-8 w-full'>
                <div className='flex items-center'>
                    <Input label="Filter" value={inputFilter} onChange={(e) => setInputFilter(e.target.value)} placeholder="Search" />
                </div>
                <div className='flex items-center ml-4'>
                    <select
                        id="page_size"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value)}
                    >
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                    <Button className="ml-4" onClick={(e) => search()}>Search</Button>
                </div>
                <div className="inline-flex rounded-md shadow-sm ml-8" role="group">
                    <Link href={rowSelected >= 0 ? `/books/${data?.data[rowSelected]?.id}` : "/books"} className={`${session?.user?.role == 'librarian' ? 'rounded-l-lg' : 'rounded-lg'} px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700`}>
                        Show
                    </Link>
                    {session?.user?.role == 'librarian'
                        &&
                        <>
                            <Link href={`/books/new`} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                                Create
                            </Link>
                            <button type="button" onClick={deleteBook} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                                Delete
                            </button></>}
                </div>
            </div>
            <Table
                columns={columns}
                data={data.data}
                selectRow={setRowSelected}
            />
            <div className='flex self-center items-center mt-8 w-fit'>
                <Pagination links={data.links} onClick={moveToPage} />
            </div>
        </>;
    }

    return (
        <main className="px-24 py-12 w-full flex flex-col justify-center items-center">
            {body}
        </main>
    )
}

export default Books