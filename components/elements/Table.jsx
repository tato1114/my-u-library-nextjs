import React from 'react'

function Table({
    columns,
    data,
    selectRow
}) {
    return (
        <div className="w-full relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                        </th>
                        {columns.map((column, index) =>
                            <th key={index} scope="col" className="px-6 py-3">
                                {column.name}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) =>
                        <tr key={index} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 text-right">
                                <input
                                    id={`row-${index}`}
                                    type="radio"
                                    onClick={(e) => selectRow(index)}
                                    name="selected-row"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                            </td>
                            {columns.map((column, index) =>
                                <td key={index} scope="col" className="px-6 py-3">
                                    {column.nested_field ? row[column.field][column.nested_field] : row[column.field]}
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

    )
}

export default Table