import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import './Survey.css';
import SurveyHeader from './SurveyHeader';
import Stack from '@mui/material/Stack';

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
    const [filled, isFilled] = useState(false);
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

    function handleNext(qid) {
        let x = document.getElementById(qid); //The current question HTML element block
        x.style.display = 'none'; //Hides it
        console.log(qid);
        if (qid === '11') { //Hardcoded for this quiz length, TODO: Find new solution for variable length quizzes.
            handleSubmit();
        }
        isFilled(false);
    }

    function handleBack(qid) {
        let x = document.getElementById(qid -= 1); //The previous question
        x.style.display = 'block'; //Shows it

    }

    const StyledButton = styled(Button)({
        backgroundColor: '#214971',
    });

    return (
        <React.Fragment >
            <SurveyHeader />
            {
                questions.map(q => {
                    return (
                        <div id={q.qId} className="question">
                            <Typography variant="h4" component="div" gutterBottom sx={{ml: 3, mt: 3}}> {/* Question text */}
                                {q.questionText}
                            </Typography>
                            
                            <FormControl > {/* Creates radio-based questions */}
                                <RadioGroup>
                                    {q.answers && q.answers.map((ans, index) => (
                                        <>
                                            <FormControlLabel className="qRadio" label={ans.answerText} control={<Radio />} key={index} name={q.qId} sx={{ml:2,}} onClick={(e) => {
                                                const form = {...formValues};
                                                form.answers.set(q.qId, {
                                                    qId: q.qId,
                                                    answer: ans.answerId
                                                    
                                                })
                                                isFilled(true);
                                                console.log(ans.answerId);
                                                setFormValues(form);
                                            }} type="radio" value={ans.answerId} />
                                        </>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            
                            {!q.answers && <TextField /* Creates textbox-based questions */
                                id="outlined-multiline-static"
                                sx={{ml:2.5, mr: 2.5, mt: 1, mb: 1}}
                                rows={6}
                                multiline 
                                onKeyUp={(e) => {
                                    const form = {...formValues};
                                    form.answers.set(q.qId, {
                                         qId: q.qId,
                                         answer: e.target.value
                                    })
                                    setFormValues(form);
                                    isFilled(true);
                                }}>
                            </TextField>}
                            <Stack className="ButtonStack" spacing={16} direction="row" container alignItems="center" justifyContent="center"> {/* Back and next navigation buttons */}
                                <Button variant="outlined" disabled={q.qId === 1} onClick={() => {handleBack(q.qId)}}>Back</Button> {/* Submits to the server after completing the last question */}
                                <StyledButton variant="contained" className="NextButton" disabled={!filled} onClick={() => {handleNext(q.qId)}}>Next</StyledButton>
                            </Stack>
                        </div >
                    )
                })
            }
            {/* <button style={{marginBottom: '20px'}} onClick={() => {
                handleSubmit();
            }}>Submit</button> */}
            <>
                
            </ >
        </React.Fragment>

        
    );

    
};



export default Survey;