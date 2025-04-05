import React from 'react';
import Img1 from '../../Assets/Img/Goat-Kids-Care-and-Management-2.jpg';
import Img2 from '../../Assets/Img/goat3.jpeg';
import Img3 from '../../Assets/Img/weightGoat.jpg';
import Img12 from '../../Assets/Img/Vaccine.jpg';
import Img13 from '../../Assets/Img/breeding.webp';
import Img14 from '../../Assets/Img/report.jpg';
import Img15 from '../../Assets/Img/pngtree-yellow-office-report-image_1297576.jpg';
import Img16 from '../../Assets/Img/pngtree-write-report-line-filled-icon-png-image_324810.jpg';
import Img17 from '../../Assets/Img/treatment.webp';
import Img18 from '../../Assets/Img/animalCost.jpg';
import Img19 from '../../Assets/Img/feedingAnimal.webp';
import Img20 from '../../Assets/Img/full-shot-man-living-countryside.jpg';


import { Link } from 'react-router-dom';

function HomeServices() {
    return <>
    <div className='section'>
        <h2>Home Services</h2>
        <ul className='cards'>
            <li className='card'>
                <Link className='Link' to="/animalServices">
                <img  src={Img1} alt='goat1'/>
                <h3>Animals</h3>
                <p>Enter The  Animals Details Data</p>
                <button className='btn mb-2 me-2 ' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Animal</button>
                </Link>
            </li>
            <li className='card'>
                <Link className='Link' to="/matingServices">
                <img  src={Img2} alt='goat2'/>
                <h3>Mating</h3>
                <p>Enter The Animal Mating Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C',  color: 'white' }}>Go to Mating</button>
                </Link>
            </li>
            <li className='card'>
                <Link className='Link' to="/weightServices">
                <img  src={Img3} alt='goat3'/>
                <h3>Weight</h3>
                <p>Enter The Animal's Weight Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Weight</button>
                </Link>
            </li>

            <li className='card'>
                <Link className='Link' to="/breedingServices">
                <img  src={Img13} alt='goat5'/>
                <h3>Breeding</h3>
                <p>Enter The Animal's Breeding Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Breeding</button>
                </Link>
            </li>

            <li className='card'>
                <Link className='Link' to="/vaccineServices">
                <img  src={Img12} alt='goat4'/>
                <h3>Vaccine</h3>
                <p>Enter The Animal's Vaccine Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Vaccine</button>
                </Link>
            </li>

            <li className='card'>
                <Link className='Link' to="/report">
                <img  src={Img14} alt='goat5'/>
                <h3>Report</h3>
                <p>Enter The Animal's Report Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Report</button>
                </Link>
            </li>
            
            <li className='card'>
                <Link className='Link' to="/reportDaliy">
                <img  src={Img15} alt='goat6'/>
                <h3>Daliy Report</h3>
                <p>Enter The Animal's Daliy Report Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C',  color: 'white' }}>Go to Daliy Report</button>
                </Link>
            </li>
            
            <li className='card'>
                <Link className='Link' to="/excludedServices">
                <img  src={Img16} alt='goat7'/>
                <h3>Excluded</h3>
                <p>Enter The Animal's  Excluded Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to  Excluded</button>
                </Link>
            </li>

            <li className='card'>
                <Link className='Link' to="/treetmentServices">
                <img  src={Img17} alt='goat4'/>
                <h3>Treatment</h3>
                <p>Enter The Animal's Treatment Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C',  color: 'white' }}>Go to Treatment</button>
                </Link>
            </li>

            
            <li className='card'>
                <Link className='Link' to="/animalCost">
                <img  src={Img18} alt='goat4'/>
                <h3>Animal Cost</h3>
                <p>Enter The Animal's Animal Cost Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Animal Cost</button>
                </Link>
            </li>

            
            <li className='card'>
                <Link className='Link' to="/feedingServices">
                <img  src={Img19} alt='goat4'/>
                <h3>Feeding</h3>
                <p>Enter The Animal's Feeding Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C',  color: 'white' }}>Go to Feeding</button>
                </Link>
            </li>
            
            <li className='card'>
                <Link className='Link' to="/fodderServices">
                <img  src={Img20} alt='goat4'/>
                <h3>Fodder</h3>
                <p>Enter The Animal's Fodder Data</p>
                <button className='btn mb-2 me-2' style={{ backgroundColor: '#FAA96C', color: 'white' }}>Go to Fodder</button>
                </Link>
            </li>
        </ul>
    </div>
    </>
}

export default HomeServices
