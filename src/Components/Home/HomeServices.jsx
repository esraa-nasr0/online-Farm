import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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
import Img21 from '../../Assets/Img/breed.jpg';
import Img22 from '../../Assets/Img/locationShed.jpg';

function HomeServices() {
const { t } = useTranslation();
const [isFattening, setIsFattening] = useState(false);

useEffect(() => {
    const token = localStorage.getItem('Authorization');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            setIsFattening(decoded.registerationType === 'fattening');
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
}, []);

return (
    <div className='section'>
    <h2>{t('home_services')}</h2>
    <ul className='cards'>

        <li className='card'>
        <Link className='Link' to='/locationServices'>
            <img src={Img22} alt='location' />
            <h3>{t('location_shed')}</h3>
            <p>{t('enter_location_shed_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_location_shed')}
            </button>
        </Link>
        </li>

        <li className='card'>
        <Link className='Link' to='/breedServices'>
            <img src={Img21} alt='breed' />
            <h3>{t('breeds')}</h3>
            <p>{t('enter_breed_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_breeds')}
            </button>
        </Link>
        </li>

        <li className='card'>
        <Link className='Link' to='/animalServices'>
            <img src={Img1} alt='animal' />
            <h3>{t('animals')}</h3>
            <p>{t('enter_animal_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_animal')}
            </button>
        </Link>
        </li>

        {!isFattening && (
            <>
                <li className='card'>
                <Link className='Link' to='/matingServices'>
                    <img src={Img2} alt='mating' />
                    <h3>{t('mating')}</h3>
                    <p>{t('enter_mating_data')}</p>
                    <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                    {t('go_to_mating')}
                    </button>
                </Link>
                </li>

                <li className='card'>
                <Link className='Link' to='/breedingServices'>
                    <img src={Img13} alt='breeding' />
                    <h3>{t('breeding')}</h3>
                    <p>{t('enter_breeding_data')}</p>
                    <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
                    {t('go_to_breeding')}
                    </button>
                </Link>
                </li>
            </>
        )}

        <li className='card'>
        <Link className='Link' to='/weightServices'>
            <img src={Img3} alt='weight' />
            <h3>{t('weight')}</h3>
            <p>{t('enter_weight_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_weight')}
            </button>
        </Link>
        </li>

        <li className='card'>
        <Link className='Link' to='/vaccineServices'>
            <img src={Img12} alt='vaccine' />
            <h3>{t('vaccine')}</h3>
            <p>{t('enter_vaccine_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_vaccine')}
            </button>
        </Link>
        </li>

        <li className='card'>
        <Link className='Link' to='/report'>
            <img src={Img14} alt='report' />
            <h3>{t('report')}</h3>
            <p>{t('enter_report_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_report')}
            </button>
        </Link>
        </li>

        <li className='card'>
        <Link className='Link' to='/reportDaliy'>
            <img src={Img15} alt='daily-report' />
            <h3>{t('daily_report')}</h3>
            <p>{t('enter_daily_report_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_daily_report')}
            </button>
        </Link>
        </li>

        <li className='card'>
        <Link className='Link' to='/excludedServices'>
            <img src={Img16} alt='excluded' />
            <h3>{t('excluded')}</h3>
            <p>{t('enter_excluded_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_excluded')}
            </button>
        </Link>
        </li>

        <li className='card'>
        <Link className='Link' to='/treetmentServices'>
            <img src={Img17} alt='treatment' />
            <h3>{t('treatment')}</h3>
            <p>{t('enter_treatment_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_treatment')}
            </button>
        </Link>
        </li>

        <li className='card'>
        <Link className='Link' to='/animalCost'>
            <img src={Img18} alt='cost' />
            <h3>{t('animal_cost')}</h3>
            <p>{t('enter_animal_cost_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_animal_cost')}
            </button>
        </Link>
        </li>

        <li className='card'>
        <Link className='Link' to='/feedingServices'>
            <img src={Img19} alt='feeding' />
            <h3>{t('feeding')}</h3>
            <p>{t('enter_feeding_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_feeding')}
            </button>
        </Link>
        </li>

        <li className='card'>
        <Link className='Link' to='/fodderServices'>
            <img src={Img20} alt='fodder' />
            <h3>{t('fodder')}</h3>
            <p>{t('enter_fodder_data')}</p>
            <button className='btn mb-2 me-2' style={{ backgroundColor: '#21763e', color: 'white' }}>
            {t('go_to_fodder')}
            </button>
        </Link>
        </li>

    </ul>
    </div>
);
}

export default HomeServices;
