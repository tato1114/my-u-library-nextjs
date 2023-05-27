import React from 'react'

function Pagination({ links, onClick }) {
    const firstElement = "rounded-l-lg ";
    const lastElement = "rounded-r-lg ";
    const inactiveClass = "px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700";
    const activeClass = "px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700";

    const cleanLabel = (label) => {
        let newLabel = label.replace('&laquo; ', '')
        newLabel = newLabel.replace(' &raquo;', '')
        return newLabel
    }

    return (
        <nav aria-label="Page navigation example">
            <ul className="inline-flex -space-x-px">
                {links.map((link, index) =>
                    <li key={index}>
                        <span
                            onClick={() => onClick(link.url)}
                            className={
                                (index == 0 ? firstElement : '') +
                                (links.length - 1 == index ? lastElement : '') +
                                (link.active ? activeClass : inactiveClass)
                            }
                        >
                            {cleanLabel(link.label)}
                        </span>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Pagination