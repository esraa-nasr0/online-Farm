import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { VaccineanimalContext } from '../../Context/VaccineanimalContext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';

function VaccineTable() {
    let navigate = useNavigate();
    let { getallVaccineanimal, DeletVaccineanimal } = useContext(VaccineanimalContext);
    const [vaccines, setVaccines] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({ tagId: '', animalType: '', vaccineName: '' });
   const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
    const [animalsPerPage] = useState(10); // عدد العناصر في كل صفحة
    const [totalPages, setTotalPages] = useState(1); // إجمالي عدد الصفحات
    const [pagination, setPagination] = useState({ totalPages: 1 });

    async function getItem() {
        setIsLoading(true);
        try {
            const filters = {
                vaccineName: searchCriteria.vaccineName,
                tagId: searchCriteria.tagId,
                locationShed: searchCriteria.locationShed
            };
 
            let { data } = await getallVaccineanimal(currentPage, animalsPerPage, filters);
            console.log(data);
            if (data && data?.vaccine) {
                const uniqueVaccines = Array.from(new Set(data.vaccine.map(vaccine => vaccine._id))).map(id => data.vaccine.find(vaccine => vaccine._id === id));
                setVaccines(uniqueVaccines);
                setTotalPages(data?.pagination?.totalPages || 1);
                setPagination(data.pagination);
setTotalPages(data.pagination.totalPages);


            } else {
                console.error("Unexpected data structure:", data);
                setVaccines([]);
            }
        } catch (error) {
            console.error("Error fetching vaccine data:", error);
            setVaccines([]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSearch = () => {
        setCurrentPage(1);
        getItem();
    };

    useEffect(() => {
        getItem();
    }, [currentPage]);

   

    async function deleteItem(id) {
        try {
            let response = await DeletVaccineanimal(id);
            if (response.status === "success") {
                setVaccines(prevVaccines => prevVaccines.filter(vaccine => vaccine._id !== id));
            } else {
                console.error("Error deleting vaccine:", response);
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    }

    function handleClick(id) {
        Swal.fire({
            title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteItem(id);
            }
        });
    }

    function editVaccine(id) {
        navigate(`/editVaccine/${id}`);
    }
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const total = pagination.totalPages; // استخدام القيمة من حالة الصفحات
        for (let i = 1; i <= total; i++) { // استخدام total بدلاً من totalPages
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
                    <Rings visible={true} height="100" width="100" color="#3f5c40" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="">
                    <div className='container'>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4" style={{ marginTop: "140px" }}>
                            <h2 className="bottom-line pb-2" style={{ color: "#88522e" }}>Vaccine Records</h2>
                            <div className='d-flex flex-column flex-sm-row gap-2'>
                            <Link to='/vaccinebyanimal'>
                                    <button type="button" className="btn btn-lg d-flex align-items-center justify-content-center active button2" style={{ background: "#88522e", color: "white", borderColor: "#3a7d44" }}>
                                        <MdOutlineAddToPhotos /> Add New Vaccine by Animal
                                    </button>
                                </Link>
                                <Link to='/vaccinebylocationshed'>
                                    <button type="button" className="btn btn-lg active button2" style={{ background: "#88522e", color: "white", borderColor: "#3a7d44" }}>
                                        <MdOutlineAddToPhotos />+ by Location Shed
                                    </button>
                                </Link>
                              
                            </div>
                        </div>

                        <div className="d-flex flex-column flex-md-row align-items-center gap-2 mt-4" style={{ flexWrap: 'nowrap' }}>
                            <input
                                type="text"
                                className="form-control"
                                value={searchCriteria.vaccineName}
                                placeholder="Search Vaccine Name"
                                onChange={(e) => setSearchCriteria(prev => ({ ...prev, vaccineName: e.target.value }))}
                            />
                            <input
                                type="text"
                                className="form-control"
                                value={searchCriteria.tagId}
                                placeholder="Search Tag ID"
                                onChange={(e) => setSearchCriteria(prev => ({ ...prev, tagId: e.target.value }))}
                            />
                            <input
                                type="text"
                                className="form-control"
                                value={searchCriteria.locationShed}
                                placeholder="Search Location Shed"
                                onChange={(e) => setSearchCriteria(prev => ({ ...prev, locationShed: e.target.value }))}
                            />
                            <button className="btn" onClick={handleSearch} style={{ backgroundColor: '#88522e', borderColor: '#88522e', color: 'white' }}>
                                <i className="fas fa-search" style={{ background: "#88522e" }}></i>
                            </button>
                        </div>

                    </div>
   <div className="table-responsive">
   <div className="full-width-table"  >
                        <table className="table table-striped mt-4">
                        <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Vaccine Name</th>
                                    <th scope="col">Every (Days)</th>
                                    <th scope="col">Vaccination Log</th>
                                    <th scope="col">Edit</th>
                                    <th scope="col">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vaccines.map((vaccine, index) => (
                                    <tr key={`${vaccine._id}-${index}`}>
                                        <td>{index + 1}</td>
                                        <th scope="row">{vaccine.vaccineName}</th>
                                        <td>{vaccine.givenEvery}</td>
                                        <td>
                                            {vaccine.vaccinationLog && vaccine.vaccinationLog.length > 0
                                                ? vaccine.vaccinationLog.map((log, i) => (
                                                    <div key={i}>
                                                        <strong>Date Given:</strong> {log.DateGiven ? log.DateGiven.split('T')[0] : 'No Date'}<br />
                                                        <strong>Valid Until:</strong> {log.vallidTell ? log.vallidTell.split('T')[0] : 'No Date'}<br />
                                                        <strong>Location Shed:</strong> {log.locationShed ? log.locationShed : 'No Location'}<br />
                                                        <strong>Tag ID:</strong> {log.tagId ? log.tagId : 'No Tag ID'}
                                                    </div>
                                                ))
                                                : 'No Vaccination Log'}
                                        </td>
                                        <td onClick={() => editVaccine(vaccine._id)} style={{ cursor: 'pointer', color: "#198754" }}>
                                            <FaRegEdit /> Edit
                                        </td>
                                        <td onClick={() => handleClick(vaccine._id)} className="text-danger" style={{ cursor: 'pointer' }}>
                                            <RiDeleteBin6Line /> Remove
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
</div>
                    <div className="d-flex flex-wap justify-content-center mt-4">
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

export default VaccineTable;

