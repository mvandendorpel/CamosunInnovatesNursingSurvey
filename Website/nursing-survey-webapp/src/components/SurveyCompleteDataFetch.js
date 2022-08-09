import React, { useEffect, useState } from 'react';
import SurveyComplete from './SurveyComplete';
import axios from 'axios';
import jwtDecode, { JwtPayload } from "jwt-decode";

const SurveyCompleteDataFetch = () => {
    const authToken = window.localStorage.getItem('authToken'); // retrieves the saved token from localstorage
    const decoded = jwtDecode(authToken); 
    const userID = decoded.userID  
    const [dataFetch, setData] = useState();
    const apiURL = "https://10.51.253.2:3004/api/lastsubmission";
    const getUserStats = async () => {
        try {
            const userData = await axios.get(`${apiURL}?nurses_id=${userID}`);
            setData(userData.data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getUserStats();
        console.log(dataFetch);
    }, []); 

    
    return(
        <>
            {dataFetch && <SurveyComplete data={dataFetch} />}
        </>
    );

}

export default SurveyCompleteDataFetch;