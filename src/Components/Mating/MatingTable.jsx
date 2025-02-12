import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { MatingContext } from '../../Context/MatingContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import UploadMatExcel from './UploadMatExcel';

const NO_DATE = 'No Date';

function MatingTable() {
    const navigate = useNavigate();
    const { getMating, deleteMating } = useContext(MatingContext);

    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const animalsPerPage = 10;
    const [searchCriteria, setSearchCriteria] = useState({
        tagId: '',
        matingDate: '',
        sonarRsult: '',
        animalType: '',
        sonarDate :'',
    });
    const [matings, setMatings] = useState([]);
    const [pagination, setPagination] = useState({ totalPages: 1 }); // حالة جديدة لتخزين معلومات الصفحات

    async function fetchMating() {
        setIsLoading(true);
        try {
            const filters = {
                tagId: searchCriteria.tagId,
                matingDate: searchCriteria.matingDate,
                sonarRsult: searchCriteria.sonarRsult,
                animalType: searchCriteria.animalType,
                sonarDate: searchCriteria.sonarDate,
            };
            const { data } = await getMating(currentPage, animalsPerPage, filters);
            setMatings(data.data.mating);
            setPagination(data.pagination || { totalPages: 1 }); // Ensure pagination is defined with a fallback value
            const total = data.pagination?.totalPages || 1; // Use optional chaining with a fallback
            console.log("Calculated Total Pages:", total);
            setTotalPages(total); // Update total pages
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch data', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMating();
    }, [currentPage]);

    const deleteItem = async (id) => {
        try {
            await deleteMating(id);
            setMatings((prevMatings) => prevMatings.filter((mating) => mating._id !== id));
            Swal.fire('Deleted!', 'Mating has been deleted.', 'success');
        } catch (error) {
            console.error('Failed to delete Mating:', error);
            Swal.fire('Error', 'Failed to delete Mating.', 'error');
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

    const editMating = (id) => {
        navigate(`/editMating/${id}`);
    };

    // البحث
    const handleSearch = () => {
        setCurrentPage(1); // العودة إلى الصفحة الأولى عند البحث
        fetchMating();
    };

    // تغيير الصفحة
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // عرض أزرار الصفحات
    const renderPaginationButtons = () => {
        const buttons = [];
        const total = pagination?.totalPages || 1; // Use optional chaining and fallback to 1 if undefined
        for (let i = 1; i <= total; i++) { // use `total` instead of `totalPages`
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

    const addMatingData = (newMatings) => {  
        setMatings((prevMatings) => {  
            const updatedMatings = [...prevMatings, ...newMatings];  
            localStorage.setItem('matings', JSON.stringify(updatedMatings)); // Update localStorage  
            return updatedMatings;  
        });  
        fetchMating(); // Reload data from the API  
    };

    return (
        <>
            {isLoading ? (
                <div className='animal'>
                    <Rings visible={true} height="100" width="100" color="#3f5c40" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    <div className="title2">Mating</div>
                    <div className="flex-column flex-md-row mb-3">
                    <Link to='/mating'>
                        <button type="button" className="btn btn-lg btn-secondary active button2">
                            <MdOutlineAddToPhotos /> Add New Mating
                        </button>
                    </Link>
                    </div>
                    {/* <UploadMatExcel addMatingData={addMatingData} /> */}

                    <div className="container mt-5">
                        <div  className="d-flex flex-column flex-md-row align-items-center gap-2" style={{ flexWrap: 'nowrap' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Tag ID"
                                value={searchCriteria.tagId}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, tagId: e.target.value })}
                            />
                            <select
                                value={searchCriteria.animalType}
                                className="form-select"
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, animalType: e.target.value })}
                            >
                                <option value="">Animal Type</option>
                                <option value="goat">Goat</option>
                                <option value="sheep">Sheep</option>
                            </select>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Mating Date"
                                value={searchCriteria.matingDate}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, matingDate: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Sonar Rsult"
                                value={searchCriteria.sonarRsult}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, sonarRsult: e.target.value })}
                            />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by Sonar Date"
                                value={searchCriteria.sonarDate}
                                onChange={(e) => setSearchCriteria({ ...searchCriteria, sonarDate: e.target.value })}
                            />
                            <button
                                className="btn mb-2 me-2"
                                onClick={handleSearch}
                                style={{ backgroundColor: '#88522e', color: 'white' }}
                            >
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>

                    <table className="table table-hover mt-4">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tag ID</th>
                                <th>Male Tag ID</th>
                                <th>Mating Type</th>
                                <th>Mating Date</th>
                                <th>Sonar Date</th>
                                <th>Sonar Result</th>
                                <th>Expected Delivery Date</th>
                                <th>Edit Mating</th>
                                <th>Remove Mating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matings.map((mating, index) => (
                                <tr key={mating._id}>
                                    <td>{(currentPage - 1) * animalsPerPage + index + 1}</td>
                                    <td>{mating.tagId}</td>
                                    <td>{mating.maleTag_id}</td>
                                    <td>{mating.matingType}</td>
                                    <td>{mating.matingDate ? mating.matingDate.split('T')[0] : NO_DATE}</td>
                                    <td>{mating.sonarDate ? mating.sonarDate.split('T')[0] : NO_DATE}</td>
                                    <td>{mating.sonarRsult}</td>
                                    <td>{mating.expectedDeliveryDate ? mating.expectedDeliveryDate.split('T')[0] : NO_DATE}</td>
                                    <td onClick={() => editMating(mating._id)} className='text-success' style={{ cursor: 'pointer' }}>
                                        <FaRegEdit /> Edit
                                    </td>
                                    <td onClick={() => confirmDelete(mating._id)} className='text-danger' style={{ cursor: 'pointer' }}>
                                        <RiDeleteBin6Line /> Remove
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

export default MatingTable;
