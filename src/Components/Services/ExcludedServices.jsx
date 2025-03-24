import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

function ExcludedServices() {

    return (
    <div className='section'>
        <h2>Excluded Services</h2>
        <div className="content">
    <div className="card2">
        <Link className='Link' to="/excludedtable">
        <div className="icon">
        <GoTable />
        </div>
        <div className="info">
            <h3>Show  Data</h3>
            <p>All the Details of Excluded </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Excluded Data</button>
        </div>
        </Link>
    </div>
    <div className="card2">
    <Link className='Link' to='/excluded'>
        <div className="icon">
        <IoAddCircleOutline />
        </div>
        <div className="info">
            <h3>Add Excluded</h3>
            <p>Add Details of Excluded </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Add Excluded</button>
        </div>
        </Link>
        </div>
</div>
    </div>
    )
}

export default ExcludedServices
