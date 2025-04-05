import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

function FodderServices() {

    return (
    <div className='section'>
        <h2>Fodder Services</h2>
        <div className="content">
    <div className="card2">
        <Link className='Link' to="/fodderTable">
        <div className="icon">
        <GoTable />
        </div>
        <div className="info">
            <h3>Show  Data</h3>
            <p>All the Details of Fodder </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Fodder Data</button>
        </div>
        </Link>
    </div>
    <div className="card2">
    <Link className='Link' to='/fodder'>
        <div className="icon">
        <IoAddCircleOutline />
        </div>
        <div className="info">
            <h3>Add Fodder</h3>
            <p>Add Details of Fodder </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Add Fodder</button>
        </div>
        </Link>
        </div>
</div>
    </div>
    )
}

export default FodderServices
