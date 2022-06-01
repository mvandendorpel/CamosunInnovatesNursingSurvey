import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import './Survey.css';
import SurveyNavButtons from './SurveyNavButtons';
import SurveyHeader from './SurveyHeader';
//import './SignUp.css'
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
        <React.Fragment >
            <SurveyHeader />
            {
                questions.map(q => {
                    return (
                        <>
                            <Typography variant="h4" component="div" gutterBottom className="SignUpHeader" sx={{ml: 3, mt: 3}}>
                                {q.questionText}
                            </Typography>
                            
                            <FormControl>
                                <RadioGroup>
                                    {q.answers && q.answers.map((ans, index) => (
                                        <>
                                            <FormControlLabel className="qRadio" label={ans.answerText} control={<Radio />} key={index} name={q.qId} sx={{ml:2,}} onClick={(e) => {
                                                const form = {...formValues};
                                                form.answers.set(q.qId, {
                                                    qId: q.qId,
                                                    answer: ans.answerId
                                                })
                                                setFormValues(form);
                                            }} type="radio" value={ans.answerId} />
                                        </>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            
                            {!q.answers && <TextField 
                                id="outlined-multiline-static"
                                sx={{m:3,}}
                                rows ={6}
                                multiline onKeyUp={(e) => {
                                    const form = {...formValues};
                                    form.answers.set(q.qId, {
                                         qId: q.qId,
                                         answer: e.target.value
                                    })
                                    setFormValues(form);
                                }}>
                            </TextField>}
                            <SurveyNavButtons />
                        </ >
                    )
                })
            }

            <button style={{marginBottom: '20px'}} onClick={() => {
                handleSubmit();
            }}>Submit</button>
        </React.Fragment>
    );
};

export default Survey;