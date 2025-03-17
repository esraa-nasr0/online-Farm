import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { CiViewTable } from "react-icons/ci";
import { MdNoteAdd } from "react-icons/md";

function FeedingServices() {

    return (
    <div className='section'>
        <h2>Feeding Services</h2>
        <div className="content">
    <div className="card2">
        <Link className='Link' to="/feedingTable">
        <div className="icon">
        <GoTable />
        </div>
        <div className="info">
            <h3>Show  Data</h3>
            <p>All the Details of Feeding </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Feeding Data</button>
        </div>
        </Link>
    </div>
    <div className="card2">
    <Link className='Link' to='/feed'>
        <div className="icon">
        <IoAddCircleOutline />
        </div>
        <div className="info">
            <h3>Add  by Feeding</h3>
            <p>Add Details by Feeding </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Add Feeding </button>
        </div>
        </Link>
        </div>
        <div className="card2">
        <Link className='Link' to='/feedlocationtable'>
        <div className="icon">
        <CiViewTable />
        </div>
        <div className="info">
            <h3>Show  Data</h3>
            <p>All the Details  by Location </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Data by Location </button>
        </div>
        </Link>
        </div>
    <div className="card2">
        <Link className='Link' to='/feedbylocation'>
        <div className="icon">
        <MdNoteAdd />
        </div>
        <div className="info">
            <h3>Add by Location</h3>
            <p>Add the Details  by Location </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Add by Location </button>
        </div>
        </Link>
        </div>
        
</div>
    </div>
    )
}

export default FeedingServices
