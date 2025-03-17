import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

function AnimalServices() {

    return (
    <div className='section'>
        <h2>Animal Services</h2>
        <div className="content">
    <div className="card2">
        <Link className='Link' to="/animals">
        <div className="icon">
        <GoTable />
        </div>
        <div className="info">
            <h3>Show  Data</h3>
            <p>All the Details of Animals </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Animals Data</button>
        </div>
        </Link>
    </div>
    <div className="card2">
    <Link className='Link' to='/AnimalsDetails'>
        <div className="icon">
        <IoAddCircleOutline />
        </div>
        <div className="info">
            <h3>Add Animal</h3>
            <p>Add Details of Animal </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Add Animal</button>
        </div>
        </Link>
        </div>
</div>
    </div>
    )
}

export default AnimalServices
