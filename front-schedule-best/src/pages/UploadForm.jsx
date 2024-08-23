import React, { useState } from 'react';
import './css/UploadForm.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function UploadForm() {
    const [surname, setSurname] = useState('');
    const [file, setFile] = useState(null);
    const [fileLabel, setFileLabel] = useState('📂 Загрузить файл');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileLabel('✅ Файл загружен');
        } else {
            setFile(null);
            setFileLabel('📂 Загрузить файл');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !surname) {
            toast('⚠️ Заполните все поля!', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('surname', surname);

        try {
            const res = await axios.post('http://localhost:3000/upload/excel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Успешный ответ от сервера
            toast('🎉 Файл успешно принят!', {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Переход на страницу с расписанием и передача данных
            navigate('/schedule-table', { state: { response: res.data, surname: surname } });

        } catch (err) {
            // Обработка ошибок с сервера
            if (err.response && err.response.data && err.response.data.message) {
                toast(`❌ ${err.response.data.message}`, {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                // Общая ошибка при загрузке файла
                console.error("Ошибка при загрузке файла:", err);
                toast('❌ Ошибка при загрузке файла', {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };

    return (
        <div className="upload-form-container">
            <div className="heading-schedule">
                <h1>📅 Расписание для учителей</h1>
            </div>
            <form className="upload-form">
                <div className="form-item-surname">
                    <input
                        type="text"
                        name="surname"
                        id="surname"
                        placeholder="📝 Введите фамилию"
                        onChange={(e) => setSurname(e.target.value)}
                    />
                </div>
                <div className="form-item-file">
                    <input
                        type="file"
                        name="file"
                        id="file"
                        placeholder="📎 Прикрепите файл"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file">{fileLabel}</label>
                </div>
                <div className="submit-button">
                    <input type="submit" value="🚀 Готово" onClick={handleSubmit} />
                </div>
            </form>
        </div>
    );
}

export default UploadForm;
