import React from 'react';
import img1 from '../../Assets/Img/goat-farm.jpg'; // غيري المسار حسب مكان الصورة عندك
import goat from "./Usefullto.css"
import trader from '../../Assets/Img/full-shot-man-living-countryside.jpg'; 
import butchers from '../../Assets/Img/home.jpg'; 
const GoatCard = () => {
  return (
    <div className='usefullto'>
    <div className='container usefull mx-auto'>
        <h1 className='section_heading text-center mb-4 color-text'>Free application <span>useful to</span> </h1>
  <div className='row  '>
      
      <div className="col-lg-4 px-3 mb-4">
        <div className="card-hover bg-white rounded-md shadow-md p-2">
          <div className="border ll border-2 p-3 rounded">
            <img src={img1} alt="goat" loading="lazy" className="w-100 immg rounded-md" />
          </div>
      
          <div className="text-center mt-3">
            <h2 className="text-xl font-bold mb-2 color-text fw-bold">Goat Farms</h2>
            <p className="text-gray-600">
              Farmers, small and Commercial Goat / Sheep farms who produces animals in
              small to bulk quantity.
            </p>
          </div>
        </div>
      </div>
      
      <div className="col-lg-4 px-3 mb-4">
        <div className="card-hover bg-white rounded-md shadow-md p-2">
          <div className="border border-2 p-3 rounded">
            <img src={trader} alt="goat" loading="lazy" className="w-100 immg rounded-md" />
          </div>
      
          <div className="text-center mt-3">
            <h2 className="text-xl font-bold mb-2 color-text fw-bold">Animal Traders</h2>
            <p className="text-gray-600">
            Individual trader, agents or group of traders who buys animals from village or small market with less price and sell at higher price.
            </p>
          </div>
        </div>
      </div>
      <div className="col-lg-4 px-3 mb-4">
        <div className="card-hover bg-white rounded-md shadow-md p-2">
          <div className="border border-2 p-3 rounded">
            <img src={butchers} alt="goat" loading="lazy" className="w-100 immg rounded-md" />
          </div>
      
          <div className="text-center mt-3">
            <h2 className="text-xl font-bold mb-2 color-text fw-bold">Butchers
            </h2>
            <p className="text-gray-600">
            Who would like to keep online data of animals with price, date and track sales.
            </p>
          </div>
        </div>
      </div>
      
          
          </div>
    </div>
  </div>
  

  );
};

export default GoatCard;
