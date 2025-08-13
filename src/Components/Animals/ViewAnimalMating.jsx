import React, { useContext, useEffect, useState } from "react";
import { GetAnimalContext } from "../../Context/GetAnimalContext";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MatingContext } from "../../Context/MatingContext";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

function ordinalSuffix(i) {
  let j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) return i + "st";
  if (j === 2 && k !== 12) return i + "nd";
  if (j === 3 && k !== 13) return i + "rd";
  return i + "th";
}

function ViewAnimalMating({ animalId }) {
  const { t } = useTranslation();
  let navigate = useNavigate();
  let { getAnimalMating } = useContext(GetAnimalContext);
  let { deleteMating } = useContext(MatingContext);
  const [animalMating, setAnimalMating] = useState([]);

  async function getMating(animalId) {
    const { data } = await getAnimalMating(animalId);
    setAnimalMating(data.data.mating);
  }

  useEffect(() => {
    if (animalId) {
      getMating(animalId);
    }
  }, [animalId]);

  const deleteItem = async (id) => {
    try {
      await deleteMating(id);
      setAnimalMating((prevMatings) =>
        prevMatings.filter((mating) => mating._id !== id)
      );
      Swal.fire(t("deleted"), t("mating_deleted_success"), "success");
    } catch (error) {
      console.error(t("delete_failed_mating"), error);
      Swal.fire(t("error"), t("mating_deleted_failed"), "error");
    }
  };

  const handleClick = (id) => {
    Swal.fire({
      title: t("confirm_delete"),
      text: t("delete_warning"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("yes_delete"),
    }).then((result) => {
      if (result.isConfirmed) deleteItem(id);
    });
  };

  function editMating(id) {
    navigate(`/editMating/${id}`);
  }

  function MatingAnimal() {
    navigate(`/mating`);
  }

  function formatDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  }

  return (
    <div className="mating-record-wrapper">
      <div className="mating-record-header">
        <h2>{t("mating_record")}</h2>
        <button onClick={() => MatingAnimal()} className="add-record-btn">
          <FaPlusCircle /> {t("add_new_record")}
        </button>
      </div>

      <div className="mating-record-list">
        {animalMating.length > 0 ? (
          animalMating.map((mating, index) => (
            <div key={mating._id} className="mating-record-item">
              <div className="mating-record-info">
                <span>
                  {ordinalSuffix(index + 1)} {t("mating")}
                </span>
                <ul>
                  {mating.matingType && (
                    <li>
                      <strong>{t("mating_type")}:</strong> {mating.matingType}
                    </li>
                  )}
                  {mating.matingDate && (
                    <li>
                      <strong>{t("mating_date")}:</strong>{" "}
                      {formatDate(mating.matingDate)}
                    </li>
                  )}
                  {mating.maleTag_id && (
                    <li>
                      <strong>{t("male_tag_id")}:</strong> {mating.maleTag_id}
                    </li>
                  )}
                  {mating.sonarDate && (
                    <li>
                      <strong>{t("sonar_date")}:</strong>{" "}
                      {formatDate(mating.sonarDate)}
                    </li>
                  )}
                  {mating.sonarRsult && (
                    <li>
                      <strong>{t("sonar_result")}:</strong> {mating.sonarRsult}
                    </li>
                  )}
                  {mating.expectedDeliveryDate && (
                    <li>
                      <strong>{t("expected_delivery_date")}:</strong>{" "}
                      {formatDate(mating.expectedDeliveryDate)}
                    </li>
                  )}
                  {mating.checkDays !== null &&
                    mating.checkDays !== undefined && (
                      <li>
                        <strong>{t("check_days")}:</strong> {mating.checkDays}
                      </li>
                    )}
                  {mating.fetusCount !== null &&
                    mating.fetusCount !== undefined && (
                      <li>
                        <strong>{t("fetus_count")}:</strong> {mating.fetusCount}
                      </li>
                    )}
                  {mating.pregnancyAge !== null &&
                    mating.pregnancyAge !== undefined && (
                      <li>
                        <strong>{t("pregnancy_age")}:</strong>{" "}
                        {mating.pregnancyAge}
                      </li>
                    )}
                </ul>
              </div>
              <div className="mating-record-actions">
                <FaEdit
                  onClick={() => editMating(mating._id)}
                  className="edit-icon"
                  title={t("edit")}
                />
                <FaTrashAlt
                  onClick={() => handleClick(mating._id)}
                  className="delete-icon"
                  title={t("delete")}
                />
              </div>
            </div>
          ))
        ) : (
          <p>{t("no_mating_records")}</p>
        )}
      </div>
    </div>
  );
}

export default ViewAnimalMating;
