import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { IoIosSave } from "react-icons/io";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

// Breed data from your Excel file
const breedData = [
  { arabic: "برقى", english: "Barqi" },
  { arabic: "أوسيمى", english: "Awsimi" },
  { arabic: "رحمانى", english: "Rahmani" },
  { arabic: "صعيدى", english: "Saidi" },
  { arabic: "برديسى", english: "bardisi" },
  { arabic: "سملوطى", english: "Smalout" },
  { arabic: "كانزي (الدرشاوي)", english: "Kanzi (El- Dershawi)" },
  { arabic: "مأنيت ( الجداوي)", english: "Maenit (El-Gedawi)" },
  { arabic: "أبو دليك (دابول)", english: "Abou Delik (Daboul)" },
  { arabic: "عواسى (نعيمى)", english: "Awassi" },
  { arabic: "حرى", english: "Harri" },
  { arabic: "نجدي", english: "Najdi" },
  { arabic: "بربرى", english: "Barbarine" },
  { arabic: "أولاد جلال", english: "Awlad Galal" },
  { arabic: "صردى", english: "Sarda" },
  { arabic: "سوهاجى", english: "Sohagi" },
  { arabic: "الرفيدي", english: "rofayda" },
  { arabic: "السواكني", english: "sawakni" },
  { arabic: "الحمرى", english: "hamry" },
  { arabic: "عربى", english: "Araby" },
  { arabic: "الدمان", english: "Eldaman" },
  { arabic: "أبى الجعد", english: "Abi elgad" },
  { arabic: "بني كيل", english: "bin kial" },
  { arabic: "تمحضيت", english: "" },
  { arabic: "الكرادية", english: "Kordia" },
  { arabic: "الحمدانية", english: "Elhamdina" },
  { arabic: "عساف", english: "Assaf" },
  { arabic: "دوربر", english: "Dorper" },
  { arabic: "سافولك", english: "Suffolk" },
  { arabic: "تكسل", english: "TEXEL" },
  { arabic: "مارينو", english: "Merino" },
  { arabic: "رومانوف", english: "Romanov" },
  { arabic: "اللاكون", english: "Lacaune" },
  { arabic: "الكيوس (القبرصي)", english: "Chios" }
];

function BreedPost() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [inputLanguage, setInputLanguage] = useState('english'); // Track input language
    const { t } = useTranslation();

    // Helper function to generate headers with the latest token
    const getHeaders = () => {
        const Authorization = localStorage.getItem("Authorization");
        const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;
        return { Authorization: formattedToken };
    };

    async function submitBreed(values) {
        const headers = getHeaders();
        setIsLoading(true);
        setError(null);

        console.log("Sending data:", values);
        console.log("Headers:", headers);

        try {
            let { data } = await axios.post(
                `https://farm-project-bbzj.onrender.com/api/breed/addbreed`,
                values,
                { headers }
            );

            if (data.status === "success") {
                setIsLoading(false);
                Swal.fire({
                    title: "Success!",
                    text: "Breed added successfully!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            }
        } catch (err) {
            setIsLoading(false);
            setError(err.response?.data?.message || "An error occurred");
        }
    }

    // **Formik Setup**
    let formik = useFormik({
        initialValues: {
            breedName: "", 
        },
        validationSchema: Yup.object({
            breedName: Yup.string().required("Breed Name is required"),
        }),
        onSubmit: submitBreed,
    });

    // Detect if input is in Arabic or English
    const isArabic = (text) => {
        const arabicRegex = /[\u0600-\u06FF]/;
        return arabicRegex.test(text);
    };

    // Handle input change for suggestions
    const handleInputChange = (e) => {
        const value = e.target.value;
        formik.handleChange(e);
        
        // Detect input language
        setInputLanguage(isArabic(value) ? 'arabic' : 'english');
        
        if (value.length > 0) {
            const filtered = breedData.filter(
                breed => 
                    breed.arabic.toLowerCase().includes(value.toLowerCase()) || 
                    breed.english.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle suggestion selection
    const handleSuggestionClick = (breed) => {
        const selectedValue = inputLanguage === 'arabic' ? breed.arabic : breed.english;
        formik.setFieldValue("breedName", selectedValue);
        setShowSuggestions(false);
    };

    return (
        <div className="container">
            <div className="title2">{t('breed')}</div>
            <p className="text-danger">{error}</p>

            <form onSubmit={formik.handleSubmit} className="mt-5">
                {isLoading ? (
                    <button type="submit" className="btn button2" disabled>
                        <i className="fas fa-spinner fa-spin"></i>
                    </button>
                ) : (
                    <button type="submit" className="btn button2">
                        <IoIosSave /> Save
                    </button>
                )}

                <div className="animaldata">
                    <div className="input-box" style={{ position: 'relative' }}>
                        <label className="label" htmlFor="breedName">{t('breed')}</label>
                        <input 
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
                            onChange={handleInputChange} 
                            value={formik.values.breedName} 
                            placeholder={t('enter_breed')} 
                            id="breedName" 
                            type="text" 
                            className="input2" 
                            name="breedName"
                            autoComplete="off"
                        />
                        {formik.errors.breedName && formik.touched.breedName && (
                            <p className="text-danger">{formik.errors.breedName}</p>
                        )}
                        
                        {showSuggestions && suggestions.length > 0 && (
                            <ul style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                zIndex: 1000,
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                            }}>
                                {suggestions.map((breed, index) => (
                                    <li 
                                        key={index}
                                        style={{
                                            padding: '8px 12px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid #eee',
                                        }}
                                        onMouseDown={() => handleSuggestionClick(breed)}
                                    >
                                        <div>{inputLanguage === 'arabic' ? breed.arabic : breed.english}</div>
                                        <div style={{ fontSize: '0.8em', color: '#666' }}>
                                            {inputLanguage === 'arabic' ? breed.english : breed.arabic}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}

export default BreedPost;