import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import './Survey.css';
import SurveyHeader from './SurveyHeader';
import Stack from '@mui/material/Stack';
import { useParams } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { useLocation } from 'react-router-dom';

const Survey = (props) => {
    const location = useLocation();

    const date = location.state?.date;

    const authToken = window.localStorage.getItem('authToken'); // retrieves the saved token from localstorage
    const decoded = jwtDecode(authToken); // decodes token
    const userID = decoded.userID; // gets userID from token
    const { surveyType } = useParams();
    const form = {
        nurseId: userID,
        surveyDate: date ? new Date(date) : new Date(), // If no date passed in from dashboard, then date is today's date
        surveyTypeId: surveyType ? parseInt(surveyType) : 1,
        answers: new Map(),
        dateStarted: new Date(),
        startShift: new Date(),
        endShift:  new Date()
    }
    const [questions, setQuestions] = useState([]);
    const [formValues, setFormValues] = useState(form);
    const [filled, isFilled] = useState(false); //Used for next button disabling
    const [surveyTitle, setSurveyTitle] = useState('Daily Survey');

    const [answers, setAnswers] = useState([]); // state to track questions ans answers
    const [formSubmitted, setFormSubmitted] = useState(false); // state to track when the form is submitted
    const [startShiftValue, setStartShiftValue] = useState(form.startShift);
    const [endShiftValue, setEndShiftValue] = useState(form.endShift);
    const [surveyTaken, setSurveyTaken] = useState(false);
    const [surveyTakenMessage, setSurveyTakenMessage] = useState('');
    const apiURL = "https://10.51.253.2:3004/api/";
    
    useEffect(() => {
        getSurveyQuestions();
    }, []);

    const isSurveyTaken = async () => {
        const surveyData = {
            surveyDate: date ? new Date(date) : new Date(),
            surveyTypeId:  surveyType ? parseInt(surveyType) : 1,
            nurseId: userID
        }
        return await axios.post(`${apiURL}/surveytaken`, surveyData);
    }


    const getSurveyQuestions = async () => {
        try {
            console.log('surveyType', surveyType);
            setSurveyTitle(surveyType == 1 ? 'Daily Survey': 'Weekly Survey');
            const survey = (await isSurveyTaken()).data;
            setSurveyTaken(survey.alreadyTaken)
            console.log('survey taken', survey);
            if (survey.alreadyTaken) {
                setSurveyTakenMessage(`Survey already taken for ${survey.surveyDate}!`);
            } else {
                setSurveyTakenMessage('');
                const surveys = await axios(`${apiURL}/weeklysurvey/${surveyType}`);
                console.log(surveys.data);
                setQuestions(surveys.data);
            }
            
            
        } catch (e) { }
    };

    const handleSubmit = async () => {
        const surveyData = { ...formValues };
        surveyData.answers = [...surveyData.answers.values()];
        surveyData.dateCompleted = new Date();
        const res = await axios.post(apiURL+'weeklysurvey', surveyData);
        if (surveyData.surveyTypeId == 1) {
            window.location.href =`https://10.51.253.2:3004/authorize?surveyId=${res.data}`;
        } 
        else {
            setAnswers(surveyData.answers);
        }
        setFormSubmitted(true); // updates the state to show that the form is submitted
    }

    function handleNext(index) {
        let x = document.getElementById(index); //The current question HTML element block
        x.style.display = 'none'; //Hides it
        console.log(index);
        if ((questions.length - 1) === index) { //Hardcoded for this quiz length, TODO: Find new solution for variable length quizzes.
            handleSubmit();
        }
        isFilled(false);
    }

    function handleBack(index) {
        let x = document.getElementById(index -= 1); //The previous question
        x.style.display = 'block'; //Shows it

    }

    const StyledButton = styled(Button)({ //Colours the 'next' button
        backgroundColor: '#214971',
    });

    const handleSelectedAnswer = (q, ans, qIndex) => {
        const form = { ...formValues };
        form.answers.set(q.qId, {
            qId: q.qId,
            answer: ans.answerText
        });
        if (qIndex === 0) {
           let filteredQuestions = [...questions].filter((q, index) => q.dailySurveyType === ans.answerId || index === 0);
           console.log('filteredQuestions', filteredQuestions);
           setQuestions(filteredQuestions);
        }
        // const queAns = {question: q.questionText, answer: ans.answerText}; // an object for the current selected answer for the current question
        // answers[qIndex] = queAns; // updates the answers using the index of the question
        // setAnswers(answers); // updates the answers state
        isFilled(true);
        console.log(ans.answerId);
        setFormValues(form);
    }

    return (
        <React.Fragment >
            <SurveyHeader title={ surveyTitle} /> {/* Use the 'title' prop to edit the heading text */}
            
            {/* when the form is submitted, this loops through the questions and their selected answers and displays them */}
            {formSubmitted && answers.map((item, i) => (
                <p key={i}>Question {i+1} - {item.questionText} - {item.answer} </p>
            ))}

            {
                !surveyTaken && questions.map((q, qIndex) => {
                    return (
                        <div id={qIndex} className="question" key={qIndex}>
                            <Typography variant="h4" component="div" gutterBottom sx={{ ml: 3, mt: 3 }}> {/* Question text */}
                                {q.questionText}
                            </Typography>

                            <FormControl > {/* Creates radio-based questions */}
                                <RadioGroup>
                                    {q.answers && q.answers.map((ans, index) => (
                                      
                                            <FormControlLabel key={index}  label={ans.answerText} control={<Radio className="qRadio" />} name={'q' + q.qId} sx={{ ml: 2, }} onClick={(e) => {
                                                handleSelectedAnswer(q, ans, qIndex);
                                            }} type="radio" value={ans.answerId} />
                                       
                                    ))}
                                </RadioGroup>
                            </FormControl>

                            {!q.answers && q.qId != 2 && <TextField /* Creates textbox-based questions */
                                id="outlined-multiline-static"
                                sx={{ ml: 2.5, mr: 2.5, mt: 1, mb: 1 }}
                                rows={6}
                                multiline
                                onKeyUp={(e) => {
                                    const form = { ...formValues };
                                    form.answers.set(q.qId, {
                                        qId: q.qId,
                                        answer: e.target.value
                                    })
                                    // const queAns = {question: q.questionText, answer: e.target.value};
                                    // answers[qIndex] = queAns;
                                    // setAnswers(answers);                                    
                                    setFormValues(form);
                                    isFilled(true);
                                }}>
                            </TextField>}
                            <Box sx={{ mx: "auto", width: "96%" }} >
                                {!q.answers && q.qId == 2 && <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker label="Start Shift" value={startShiftValue} onChange={(value) => {
                                        setStartShiftValue(value);
                                        const form = { ...formValues };
                                        form.startShift = value;
                                        const filled = !!(form.startShift && form.endShift);
                                        const start = moment(form.startShift).format('YYYY-MM-DD hh:mm:ss');
                                        const end = moment(form.endShift).format('YYYY-MM-DD hh:mm:ss');
                                        if (filled) {
                                            form.answers.set(q.qId, {
                                                qId: q.qId,
                                                answer: `${start} - ${end}`
                                            })
                                        }
                                        isFilled(filled);
                                        setFormValues(form);
                                    }} renderInput={(params) => <TextField sx={{ mb: 2 }} {...params}/>} />
                                    <DateTimePicker label="End Shift" value={endShiftValue} onChange={(value) => {
                                        setEndShiftValue(value);
                                        const form = { ...formValues };
                                        form.endShift = value;
                                        const filled = !!(form.startShift && form.endShift);
                                        const start = moment(form.startShift).format('YYYY-MM-DD hh:mm:ss');
                                        const end = moment(form.endShift).format('YYYY-MM-DD hh:mm:ss');
                                        if (filled) {
                                            form.answers.set(q.qId, {
                                                qId: q.qId,
                                                answer: `${start} - ${end}`
                                            })
                                        }
                                        isFilled(filled);
                                        setFormValues(form);
                                    }} renderInput={(params) => <TextField sx={{ mb: 2 }} {...params}/>} />
                                    </LocalizationProvider>}
                                </Box>
                            <Stack className="ButtonStack" spacing={16} direction="row" container="true" alignItems="center" justifyContent="center"> {/* Back and next navigation buttons */}
                                <Button variant="outlined" disabled={q.qId === 1} onClick={() => { handleBack(qIndex) }}>Back</Button> {/* Submits to the server after completing the last question */}
                                <StyledButton variant="contained" className="NextButton" disabled={!filled} onClick={() => { handleNext(qIndex) }}>Next</StyledButton>
                            </Stack>
                        </div >
                    )
                })
            }
            {
                surveyTaken && <Typography variant="h4" component="div" gutterBottom sx={{ ml: 3, mt: 3 }}> {/* Question text */}
                {surveyTakenMessage}
            </Typography>
            }
            {/* <button style={{marginBottom: '20px'}} onClick={() => { Original submit to server button
                handleSubmit();
            }}>Submit</button> */}
        </React.Fragment>
    );
};

export default Survey;