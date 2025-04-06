import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

function LocationServices() {

    return (
    <div className='section'>
        <h2>Location Shed Services</h2>
        <div className="content">
    <div className="card2">
        <Link className='Link' to="/locationTable">
        <div className="icon">
        <GoTable />
        </div>
        <div className="info">
            <h3>Show  Data</h3>
            <p>All the Details of Location </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Location Data</button>
        </div>
        </Link>
    </div>
    <div className="card2">
    <Link className='Link' to='/locationPost'>
        <div className="icon">
        <IoAddCircleOutline />
        </div>
        <div className="info">
            <h3>Add Location</h3>
            <p>Add Details of Location </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Add Location</button>
        </div>
        </Link>
        </div>
</div>
    </div>
    )
}

export default LocationServices
