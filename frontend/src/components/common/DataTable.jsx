import { HiPencil, HiTrash } from 'react-icons/hi';


const DataTable = ({ columns, data, onEdit, onDelete }) => (
    <div className="bg-white rounded-xl shadow-sm border border-light-400 overflow-x-auto">
        <table className="w-full text-sm">
            <thead className="bg-light-200 text-dark-700">
                <tr>
                    {columns.map((col) => (
                        <th key={col.key} className="text-left px-4 py-3 font-semibold">{col.label}</th>
                    ))}
                    <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={columns.length + 1} className="text-center py-10 text-dark-300">
                            No records found.
                        </td>
                    </tr>
                ) : (
                    data.map((row) => (
                        <tr key={row._id} className="border-t border-light-300 hover:bg-light-100">
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-3 text-dark-700">
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                            <td className="px-4 py-3 text-right space-x-2">
                                <button onClick={() => onEdit(row)} className="text-primary-500 hover:text-primary-700" aria-label="Edit">
                                    <HiPencil className="inline text-lg" />
                                </button>
                                <button onClick={() => onDelete(row)} className="text-danger hover:text-red-700" aria-label="Delete">
                                    <HiTrash className="inline text-lg" />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);

export default DataTable;