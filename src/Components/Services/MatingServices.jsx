import React from 'react'
import { GoTable } from "react-icons/go";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { MdOutlineAddToPhotos } from "react-icons/md";


function MatingServices() {

    return (
    <div className='section'>
        <h2>Mating Services</h2>
        <div className="content">
    <div className="card2">
        <Link className='Link' to="/matingTable">
        <div className="icon">
        <GoTable />
        </div>
        <div className="info">
            <h3>Show  Data</h3>
            <p>All the Details of Mating </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Mating Data</button>
        </div>
        </Link>
    </div>
    <div className="card2">
    <Link className='Link' to='/mating'>
        <div className="icon">
        <IoAddCircleOutline />
        </div>
        <div className="info">
            <h3>Add Mating</h3>
            <p>Add Details of Mating </p>
            <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Add Mating</button>
        </div>
        </Link>
        </div>
        
                <div className="card2">
                <Link className='Link' to="/matingLocation">
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

export default MatingServices
