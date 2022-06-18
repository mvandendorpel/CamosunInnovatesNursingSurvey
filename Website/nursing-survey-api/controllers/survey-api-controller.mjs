import db from '../models/index.mjs';
import { Survey } from '../models/survey.model.mjs';
import {SurveyQuestion} from '../models/survey-question.model.mjs';
import { SurveyAnswer } from '../models/surveyanswer.model.mjs';
// get all the questions and offered answers from the database
const getWeeklyQuestions = async (req, res) => {
    const surveyType = req.params.surveyType || 1;
    // query to get the questions in db
    const [surveys, metadata] = await db.sequelize.query(`SELECT q.id as qID, q.questionText, q.survey_type_id, q.daily_survey_type, oa.Id as answerId, oa.AnswerText FROM mydb.question_answer qa INNER JOIN mydb.question q ON qa.Question_Id = q.id 
    LEFT JOIN mydb.offered_answer oa ON qa.OfferedAnswer_Id=oa.Id WHERE  q.survey_type_id = ${surveyType}`);
    const map = new Map();
    
    surveys.forEach(q => {
        if (map.has(q.qID)) {
            let question = map.get(q.qID);
            if (question.answers.length) {
                question.answers.push({ answerId: q.answerId, answerText: q.AnswerText });
            }
        } else {
            let ans = q.AnswerText ? [{ answerId: q.answerId, answerText: q.AnswerText }] : null;
            map.set(q.qID, {
                qId: q.qID,
                dailySurveyType: q.daily_survey_type,
                questionText: q.questionText,
                answers: ans
            });
        }
    });
    res.status(200).json([...map.values()]);
};

// saves the survey information and answers from the user/nurses
const postWeeklySurvey = async (req, res) => {
    const surveyData = req.body;
    try {
        // creates the survey info and save to the database
        const survey = await Survey.create({
            Description: "Test Description",
            surveyDate: surveyData.surveyDate.split('T')[0],
            nurses_ID: surveyData.nurseId,
            survey_type_id: surveyData.surveyTypeId,
            fitbitData_id: null,
            dateStarted: surveyData.dateStarted,
            dateCompleted: surveyData.dateCompleted
        });
        console.log('survey', survey);
        const surveyId = survey.dataValues.id;
        for (let i = 0; i < surveyData.answers.length; i++) {
            // creates the survey question and save to db
            const surveyQuestionId = await SurveyQuestion.create({
                Survey_Id: surveyId,
                Question_Id: surveyData.answers[i].qId
            });
            // create/save the survey answer
            await SurveyAnswer.create({
                answer: surveyData.answers[i].answer,
                survey_question_id: surveyQuestionId.dataValues.id
            });
        }
        const query  = `SELECT q.*, sa.answer FROM mydb.survey s INNER JOIN mydb.survey_question sq ON s.Id=sq.Survey_Id
        INNER JOIN question q ON q.id = sq.Question_Id
        INNER JOIN surveyanswer sa ON sq.id=sa.survey_question_id 
        WHERE s.Id = ${surveyId}`;
        const [surveyResult, metadata] = await db.sequelize.query(query);

        res.status(201).json(surveyResult);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error");
    }

};


export { getWeeklyQuestions, postWeeklySurvey };

