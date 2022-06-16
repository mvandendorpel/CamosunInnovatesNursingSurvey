import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
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
import { useParams } from 'react-router-dom';

//import './SignUp.css'
const Survey = (props) => {
    const { surveyType } = useParams();
    const form = {
        nurseId: 2,
        surveyDate: new Date(),
        surveyTypeId: surveyType ? parseInt(surveyType) : 1,
        answers: new Map()
    }
    const [questions, setQuestions] = useState([]);
    const [formValues, setFormValues] = useState(form);
    const [filled, isFilled] = useState(false); //Used for next button disabling
    const params = useParams();
    const [surveyTitle, setSurveyTitle] = useState('Daily Survey');

    const [answers, setAnswers] = useState([]); // state to track questions ans answers
    const [formSubmitted, setFormSubmitted] = useState(false); // state to track when the form is submitted

    const apiURL = "http://localhost:3004/api/weeklysurvey";
    
    useEffect(() => {
        getSurveyQuestions();
    }, []);


    const getSurveyQuestions = async () => {
        try {
            console.log('surveyType', surveyType);
            setSurveyTitle(surveyType == 1 ? 'Daily Survey': 'Weekly Survey');
            const surveys = await axios(`${apiURL}/${surveyType}`);
            console.log(surveys.data);
            setQuestions(surveys.data);
            
        } catch (e) { }
    };

    const handleSubmit = async () => {
        const surveyData = { ...formValues };
        surveyData.answers = [...surveyData.answers.values()];
        const res = await axios.post(apiURL, surveyData);
        console.log('res', res);
        setAnswers(res.data);
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
                questions.map((q, qIndex) => {
                    return (
                        <div id={qIndex} className="question" key={qIndex}>
                            <Typography variant="h4" component="div" gutterBottom sx={{ ml: 3, mt: 3 }}> {/* Question text */}
                                {q.questionText}
                            </Typography>

                            <FormControl > {/* Creates radio-based questions */}
                                <RadioGroup>
                                    {q.answers && q.answers.map((ans, index) => (
                                      
                                            <FormControlLabel key={index} className="qRadio" label={ans.answerText} control={<Radio />} name={'q' + q.qId} sx={{ ml: 2, }} onClick={(e) => {
                                                handleSelectedAnswer(q, ans, qIndex);
                                            }} type="radio" value={ans.answerId} />
                                       
                                    ))}
                                </RadioGroup>
                            </FormControl>

                            {!q.answers && <TextField /* Creates textbox-based questions */
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
                            <Stack className="ButtonStack" spacing={16} direction="row" container="true" alignItems="center" justifyContent="center"> {/* Back and next navigation buttons */}
                                <Button variant="outlined" disabled={q.qId === 1} onClick={() => { handleBack(qIndex) }}>Back</Button> {/* Submits to the server after completing the last question */}
                                <StyledButton variant="contained" className="NextButton" disabled={!filled} onClick={() => { handleNext(qIndex) }}>Next</StyledButton>
                            </Stack>
                        </div >
                    )
                })
            }
            {/* <button style={{marginBottom: '20px'}} onClick={() => { Original submit to server button
                handleSubmit();
            }}>Submit</button> */}
        </React.Fragment>
    );
};

export default Survey;