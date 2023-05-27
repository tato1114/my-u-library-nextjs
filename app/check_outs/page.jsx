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

function CheckOuts() {
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/');
        }
    })
    const [inputFilter, setInputFilter] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [rowSelected, setRowSelected] = useState(null);

    const token = session?.user?.token;
    const defaultUrl = `${process.env.SERVER_HOST ?? 'localhost'}/api/check_outs?page_size=${pageSize}`
    const [url, setUrl] = useState(defaultUrl);
    const [trigger, setTrigger] = useState(false);
    const [{ data, loading, error }, executeAxios] = useAxios({ url, headers: { 'Authorization': 'Bearer ' + token } }, { manual: true });

    useEffect(() => {
        executeAxios();
    }, [url, trigger]);

    const [{ dataReturnBook, loadingReturnBook, errorReturnBook }, executeReturnBook] =
        useAxios({
            url: `${process.env.SERVER_HOST ?? 'localhost'}/api/check_outs/${data?.data[rowSelected]?.id}`,
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + token }
        },
            { manual: true });

    const returnBook = async () => {
        if (data?.data[rowSelected]?.status == 'returned') {
            alert('This book is already returned')
            return
        }
        if (confirm(`Are you sure you want to mark this book as returned? ${data?.data[rowSelected]?.title}`)) {
            await executeReturnBook()
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
        const newUrl = defaultUrl + querySelectors;
        setUrl(newUrl);
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
            { "field": 'book', "nested_field": "title", "name": "Title" },
            { "field": 'user', "nested_field": "first_name", "name": "User first name" },
            { "field": 'user', "nested_field": "last_name", "name": "User last name" },
            { "field": 'check_out_date', "name": "Check out date" },
            { "field": 'return_date', "name": "Return date" },
            { "field": 'status', "name": "Status" },
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
                    <button type="button" onClick={returnBook} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700">
                        Mark as returned
                    </button>
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

export default CheckOuts