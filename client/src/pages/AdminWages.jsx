import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminWages = () => {
    const [wages, setWages] = useState([]);

    const fetchWages = async () => {
        try {
            const response = await axios.get('http://localhost:5000/wages');
            setWages(response.data);
        } catch (error) {
            console.error("Error fetching wages:", error);
        }
    };

    useEffect(() => {
        fetchWages();
    }, []);

    return (
        <div>
            <h1>Artist Wages</h1>
            <ul>
                {wages.map((wage) => (
                    <li key={wage._id}>
                        Staff Name: {wage.staffName}, Client Name: {wage.clientName}, Total Price: {wage.totalPrice}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminWages;
