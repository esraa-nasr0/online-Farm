import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";
import { CiViewTable } from "react-icons/ci";
import { MdNoteAdd } from "react-icons/md";

function TreetmentServices() {

    return (
    <div className='section'>
        <h2>Treatment Services</h2>
        <div className="content">
    <div className="card2">
        <Link className='Link' to="/treatmentTable">
        <div className="icon">
        <GoTable />
        </div>
        <div className="info">
            <h3>Show  Data</h3>
            <p>All the Details of Treatment </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Treatment Data</button>
        </div>
        </Link>
    </div>
    <div className="card2">
    <Link className='Link' to='/treatment'>
        <div className="icon">
        <IoAddCircleOutline />
        </div>
        <div className="info">
            <h3>Add  by Treatment</h3>
            <p>Add Details by Treatment </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Add Treatment </button>
        </div>
        </Link>
        </div>
        <div className="card2">
        <Link className='Link' to='/treatAnimalTable'>
        <div className="icon">
        <CiViewTable />
        </div>
        <div className="info">
            <h3>Show  Data</h3>
            <p>All the Details  by Animal </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Data by Animal </button>
        </div>
        </Link>
        </div>
    <div className="card2">
        <Link className='Link' to='/treatmentAnimal'>
        <div className="icon">
        <MdNoteAdd />
        </div>
        <div className="info">
            <h3>Add by Animal</h3>
            <p>Add the Details  by Animal </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Add by Animal </button>
        </div>
        </Link>
        </div>
        <div className="card2">
        <Link className='Link' to="/treatmentLocation">
        <div className="icon">
        <MdOutlineAddToPhotos />
        </div>
        <div className="info">
            <h3>Add  by Location Shed</h3>
            <p>Add Details  by Location Shed </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Add  by Location Shed</button>
        </div>
        </Link>
    </div>
</div>
    </div>
    )
}

export default TreetmentServices
