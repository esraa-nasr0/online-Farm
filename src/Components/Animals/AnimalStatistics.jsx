import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHorse, FaDiceD6, FaDiceThree } from 'react-icons/fa';
import styles from './AnimalStatistics.module.css';

function AnimalStatistics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const getHeaders = () => {
    const Authorization = localStorage.getItem("Authorization");
    const formattedToken = Authorization?.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
    return { Authorization: formattedToken };
  };

  const fetchAnimalStatistics = async () => {
    const headers = getHeaders();
    try {
      const { data } = await axios.get(
        `https://farm-project-bbzj.onrender.com/api/animal/getAnimalStatistics`,
        { headers }
      );
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching animal statistics", error);
      setError("فشل تحميل إحصائيات الحيوانات. حاول مرة أخرى.");
    }
  };

  useEffect(() => {
    fetchAnimalStatistics();
  }, []);

  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!stats) return <div className={`text-center mt-10 ${styles.loadingText}`}>Loading ......</div>;

  return (
    <div className={styles.statisticsContainer}>
      <div className={`${styles.card} ${styles.totalAnimals}`}>
        <div>
          <h2 className={styles.statTitle}>{stats.totalAnimals}</h2>
          <p className={styles.statDescription}>Total Animals</p>
        </div>
        <FaHorse className={`${styles.icon} ${styles.horseIcon}`} />
      </div>

      <div className={`${styles.card} ${styles.sheep}`}>
        <div>
          <h2 className={styles.statTitle}>
            Total: {stats.byType?.sheep?.total || 0}<br />
            ♂ {stats.byType?.sheep?.males || 0} | ♀ {stats.byType?.sheep?.females || 0}
          </h2>
          <p className={styles.statDescription}>Sheep</p>
        </div>
        <FaDiceD6 className={`${styles.icon} ${styles.sheepIcon}`} />
      </div>

      <div className={`${styles.card} ${styles.goat}`}>
        <div>
          <h2 className={styles.statTitle}>
            Total: {stats.byType?.goat?.total || 0}<br />
            ♂ {stats.byType?.goat?.males || 0} | ♀ {stats.byType?.goat?.females || 0}
          </h2>
          <p className={styles.statDescription}>Goat</p>
        </div>
        <FaDiceThree className={`${styles.icon} ${styles.goatIcon}`} />
      </div>
    </div>
  );
}

export default AnimalStatistics;
