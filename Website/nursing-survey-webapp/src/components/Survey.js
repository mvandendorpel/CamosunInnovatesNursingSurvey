import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import axios from 'axios';

const Survey = (props) => {

    const form = {
        nurseId: 2,
        surveyDate: new Date(),
        surveyTypeId: 1,
        answers: new Map()
    }
    const [questions, setQuestions] = useState([]);
    const [formValues, setFormValues] = useState(form);
    const apiURL = "http://localhost:3004/api/weeklysurvey";
    useEffect(async () => {
        try {
            const surveys = await axios(apiURL);
            console.log(surveys.data);
            setQuestions(surveys.data);
        } catch (e) { }

    }, []);

    const handleSubmit = async () => {
        
        const surveyData = {...formValues};
        surveyData.answers = [...surveyData.answers.values()];
        const res = await axios.post(apiURL, surveyData);
        console.log('res', res);
    }

    return (
        <div >
            <p>Survey</p>
            {
                questions.map(q => {
                    return (
                        <div>
                            <div>{q.questionText}</div>
                            {q.answers && q.answers.map((ans, index) => (
                                <>
                                    <input key={index} name={q.qId} onClick={(e) => {
                                        const form = {...formValues};
                                        form.answers.set(q.qId, {
                                            qId: q.qId,
                                            answer: ans.answerId
                                        })
                                        setFormValues(form);
                                    }} type="radio" value={ans.answerId} />
                                    <label  key={index} htmlFor={q.qId}>{ans.answerText}</label>
                                </>
                            ))}
                            {!q.answers && <textarea onKeyUp={(e) => {
                                 const form = {...formValues};
                                 form.answers.set(q.qId, {
                                     qId: q.qId,
                                     answer: e.target.value
                                 })
                                 setFormValues(form);
                            }}></textarea>}
                        </div>
                    )
                })
            }

            <button style={{marginBottom: '20px'}} onClick={() => {
                handleSubmit();
            }}>Submit</button>

        </div>

    );
};



export default Survey;