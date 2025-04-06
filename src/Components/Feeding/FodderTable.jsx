import React, { useContext, useEffect, useState } from 'react';
import { Rings } from 'react-loader-spinner';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { Feedcontext } from '../../Context/FeedContext';
import Swal from 'sweetalert2';
import { Link , useNavigate } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";


export default function FodderTable() {
    const { getFodder , deleteFodder } = useContext(Feedcontext);
    const [isLoading, setIsLoading] = useState(false);
    const [fodder, setFodder] = useState([]);
    const [error, setError] = useState(null);
    const [searchName, setSearchName] = useState('');
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [FodderPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1 }); // حالة جديدة لتخزين معلومات الصفحات
    

    const fetchFodder = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const filters = {name: searchName,}
            const { data } = await getFodder(currentPage, FodderPerPage , filters);
            setFodder(data?.data?.fodders || []);
            setPagination(data.pagination); // تحديث حالة الصفحات
            const total = data.pagination.totalPages;
            setTotalPages(total); // تحديث عدد الصفحات
        }catch (error) {
                    Swal.fire('Error', 'Failed to fetch data', 'error');
                } finally {
                    setIsLoading(false);
                }
    };

    const deleteItem = async (id) => {
            try {
                await deleteFodder(id);
                setFodder((prevTreatment) => prevTreatment.filter((item) => item._id !== id));
                Swal.fire('Deleted!', 'Treatment has been deleted.', 'success');
            } catch (error) {
                console.error('Failed to delete treatment:', error);
                Swal.fire('Error', 'Failed to delete treatment.', 'error');
            }
        };

        const confirmDelete = (id) => {
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                }).then((result) => {
                    if (result.isConfirmed) deleteItem(id);
                });
            };

    useEffect(() => {
        fetchFodder();
    }, [currentPage]);

    // البحث
    const handleSearch = () => {
        setCurrentPage(1); // العودة إلى الصفحة الأولى عند البحث
        fetchFodder();
    };

    // تغيير الصفحة
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // عرض أزرار الصفحات
    const renderPaginationButtons = () => {
        const buttons = [];
        const total = pagination.totalPages; // استخدام القيمة من حالة الصفحات
        for (let i = 1; i <= total; i++) { // استخدام `total` بدلاً من `totalPages`
            buttons.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(i)}>
                        {i}
                    </button>
                </li>
            );
        }
        return buttons;
    }
    const editFodder = (id) => {
        navigate(`/editFodder/${id}`);
    };

    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Rings visible={true} height="100" width="100" color="#9cbd81" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    <div className="title2">Fodder</div>
                    {error && <p className="text-danger mt-3">{error}</p>}
                    
                    <div className='container mt-4'>
                        <div className="d-flex flex-column flex-md-row align-items-center gap-2" style={{ flexWrap: 'nowrap' }}>
                            <input type="text" className="form-control" placeholder="Search by Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} style={{ flex: 1 }} />
                            <button className="btn mb-2 me-2" onClick={handleSearch} style={{ backgroundColor: '#FAA96C',  color: 'white' }}>
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <table className="table table-hover mt-4" aria-label="Fodder Table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Components</th>
                                <th scope="col">Total Quantity</th>
                                <th scope="col">Total Price</th>
                                <th scope="col">Edit Fodder</th>
                                <th scope="col">Remove Fodder</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fodder.length > 0 ? (
                                fodder.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <th scope="row">{(currentPage - 1) * FodderPerPage + index + 1}</th>
                                        <td>{item.name}</td>
                                        <td>Quantity : {item.components.map((comp) => comp.quantity).join(', ')}</td> {/* عرض quantity فقط */}
                                        <td>{item.totalQuantity}</td>
                                        <td>{item.totalPrice}</td>
                                        <td 
                                        onClick={() => editFodder(item._id)}
                                            className="text-success"
                                            style={{ cursor: 'pointer' }}>
                                            <FaRegEdit /> Edit Fodder
                                        </td>
                                        <td 
                                            onClick={() => confirmDelete(item._id)}
                                            className="text-danger"
                                            style={{ cursor: 'pointer' }}>
                                            <RiDeleteBin6Line /> Remove Fodder
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No Fodder found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* أزرار الصفحات */}
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                {renderPaginationButtons()}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
