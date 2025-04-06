import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Vaccinetableentriescontext } from '../../Context/Vaccinetableentriescontext';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';

function VaccineTable() {
  const navigate = useNavigate();
  const { getallVaccineanimalEntries, DeletVaccineanimal } = useContext(Vaccinetableentriescontext);

  const [vaccines, setVaccines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    tagId: '',
    vaccineName: '',
    locationShed: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [animalsPerPage] = useState(10);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  useEffect(() => {
    getItem();
  }, [currentPage]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
    navigate(`/editVaccineanimals/${id}`);
  }

  const renderPaginationButtons = () => {
    const buttons = [];
    const total = pagination.totalPages;
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

  async function getItem() {
    setIsLoading(true);
    try {
      const filters = {
        tagId: searchCriteria.tagId,
        vaccineName: searchCriteria.vaccineName,
        locationShed: searchCriteria.locationShed,
      };

      const { data } = await getallVaccineanimalEntries(currentPage, animalsPerPage, filters);

      if (data?.entries) {
        setVaccines(data.entries);
        setPagination(data.pagination || { totalPages: 1 });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No Data',
          text: 'No vaccine records found.'
        });
        setVaccines([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch vaccine data.'
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = () => {
    setCurrentPage(1);
    getItem();
  };

  async function deleteItem(id) {
    try {
      const response = await DeletVaccineanimal(id);
      
      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: response.data.message || 'Vaccine record deleted successfully.',
          timer: 1500
        });
        setVaccines(prev => prev.filter(item => item._id !== id));
      } else {
        throw new Error('Failed to delete vaccine');
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Something went wrong while deleting.'
      });
    }
  }

  return (
    <div className="p-4">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999
        }}>
          <Rings 
            height="100"
            width="100"
            color="#88522e"
            ariaLabel="loading-indicator"
          />
        </div>
      ) : (
        <>
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
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <div className="full-width-table">
              <table className="table table-striped mt-4">
                <thead>
                  <tr>
                    <th scope="col">Tag ID</th>
                    <th scope="col">Vaccine Name</th>
                    <th scope="col">Dose Price</th>
                    <th scope="col">Entry Type</th>
                    <th scope="col">Date</th>
                    <th scope="col">Location Shed</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccines.length > 0 ? (
                    vaccines.map(vaccine => (
                      <tr key={vaccine._id} className="hover:bg-gray-50 transition">
                        <td>{vaccine.tagId}</td>
                        <td>{vaccine.Vaccine?.vaccineName || '--'}</td>
                        <td>{vaccine.Vaccine?.pricing?.dosePrice || '--'}</td>
                        <td>{vaccine.entryType}</td>
                        <td>{new Date(vaccine.date).toLocaleDateString()}</td>
                        <td>{vaccine.locationShed?.locationShedName || '--'}</td>
                        <td
                          onClick={() => editVaccine(vaccine._id)}
                          style={{ cursor: "pointer", color: "#198754" }}
                          title="Edit Vaccine"
                        >
                          <FaRegEdit className="me-1" /> Edit
                        </td>
                        <td
                          onClick={() => handleClick(vaccine._id)}
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                          title="Remove Vaccine"
                        >
                          <RiDeleteBin6Line className="me-1" /> Remove
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-6 text-gray-500">No vaccine records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex flex-wrap justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                {renderPaginationButtons()}
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

export default VaccineTable;