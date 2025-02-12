import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2'; 
import { WeightContext } from '../../Context/WeightContext';

function WeightTable() {
    let navigate = useNavigate();
    let { getWeight, deleteWeight } = useContext(WeightContext);
    
    // حالات البيانات
    const [weights, setWeight] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 
    const [searchCriteria, setSearchCriteria] = useState({
        tagId: '',
        weightType: '',
        Date: ''
    });
    const [currentPage, setCurrentPage] = useState(1); 
    const [totalPages, setTotalPages] = useState(0);
    const animalsPerPage = 10;
    const [pagination, setPagination] = useState({ totalPages: 1 });

    // دالة لجلب البيانات
    async function fetchWeight() {
        setIsLoading(true);
        const filters = {
            tagId: searchCriteria.tagId,
            weightType: searchCriteria.weightType,
            Date: searchCriteria.Date,
        };

        try {
            let { data } = await getWeight(currentPage, animalsPerPage, filters);
            setWeight(data.data.weight);
            setPagination(data.pagination || { totalPages: 1 });
            setTotalPages(data.pagination?.totalPages || 1);
        } catch (error) {
            console.error('Error fetching weight data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // تحميل البيانات عند أول تحميل للمكون
    useEffect(() => {
        fetchWeight();
    }, [currentPage]); // التحديث عند تغيير الصفحة

    // دالة لحذف الوزن
    const deleteItem = async (id) => {
        try {
            await deleteWeight(id);
            setWeight((prevWeights) => prevWeights.filter((weight) => weight._id !== id));
            Swal.fire('Deleted!', 'Weight has been deleted.', 'success');
        } catch (error) {
            console.error('Failed to delete Weight:', error);
            Swal.fire('Error', 'Failed to delete Weight.', 'error');
        }
    };

    // تأكيد الحذف
    const handleClick = (id) => {
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

    // التوجه لتعديل الوزن
    function editWeight(id) {
        navigate(`/editWeight/${id}`);
    }

    // دالة البحث
    function handleSearch() {
        setCurrentPage(1); // العودة إلى الصفحة الأولى عند البحث
        fetchWeight();
    }

    // تغيير الصفحة
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // عرض أزرار الصفحات
    const renderPaginationButtons = () => {
        const buttons = [];
        const total = pagination?.totalPages || 1; // ضمان الحصول على العدد الإجمالي للصفحات
        for (let i = 1; i <= total; i++) {
            buttons.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => paginate(i)}>
                        {i}
                    </button>
                </li>
            );
        }
        return buttons;
    };

    return (
        <>
        {isLoading ? (
            <div className='animal'>
                <Rings
                    visible={true}
                    height="100"
                    width="100"
                    color="#3f5c40"
                    ariaLabel="rings-loading"
                />
            </div>
        ) : (
            <div className="container">
                <div className="title2">Weight</div>
                <div className="flex-column flex-md-row mb-3 me-3">
                    <Link to='/weight'>
                        <button type="button" className="btn btn-lg btn-secondary active button2">
                            <MdOutlineAddToPhotos /> Add New Weight
                        </button>
                    </Link>
                </div>

                {/* Inputs للبحث */}
                <div className="container mt-5">
                    <div className="d-flex flex-column flex-md-row align-items-center gap-2" style={{ flexWrap: 'nowrap' }}>
                        <input
                            type="text"
                            className="form-control me-2 mb-2"
                            placeholder="Search by Tag ID"
                            value={searchCriteria.tagId}
                            onChange={(e) => setSearchCriteria({ ...searchCriteria, tagId: e.target.value })}
                            style={{ flex: '1' }}
                        />
                        <input
                            type="text"
                            className="form-control me-2 mb-2"
                            placeholder="Search by Weight Type"
                            value={searchCriteria.weightType}
                            onChange={(e) => setSearchCriteria({ ...searchCriteria, weightType: e.target.value })}
                            style={{ flex: '1' }}
                        />
                        <input
                            type="text"
                            className="form-control me-2 mb-2"
                            placeholder="Search by Date"
                            value={searchCriteria.Date}
                            onChange={(e) => setSearchCriteria({ ...searchCriteria, Date: e.target.value })}
                            style={{ flex: '1' }}
                        />
                        <button
                            className="btn mb-2 me-2"
                            onClick={handleSearch}
                            style={{ backgroundColor: '#88522e', borderColor: '#88522e', color: '#E9E6E2' }}
                        >
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>

                <table className="table table-hover mt-6">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tag ID</th>
                            <th scope="col">Weight Type</th>
                            <th scope="col">Weight</th>
                            <th scope="col">Height</th>
                            <th scope="col">Date</th>
                            <th scope="col">Edit weight</th>
                            <th scope="col">Remove weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weights.map((weight, index) => (
                            <tr key={`${weight.id || weight._id}-${index}`}>
                                <th scope="row">{(currentPage - 1) * animalsPerPage + index + 1}</th>
                                <td>{weight.tagId}</td>
                                <td>{weight.weightType}</td>
                                <td>{weight.weight}</td>
                                <td>{weight.height}</td>
                                <td>{weight.Date ? weight.Date.split('T')[0] : 'No Date'}</td>
                                <td onClick={() => editWeight(weight._id)} style={{ cursor: 'pointer' }} className="text-success">
                                    <FaRegEdit /> Edit Weight
                                </td>
                                <td onClick={() => handleClick(weight._id)} className="text-danger" style={{ cursor: 'pointer' }}>
                                    <RiDeleteBin6Line /> Remove weight
                                </td>
                            </tr>
                        ))}
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

export default WeightTable;
