import db from '../models/index.mjs';
import { Survey } from '../models/Survey.model.mjs';
import {SurveyQuestion} from '../models/survey-question.model.mjs';
import { SurveyAnswer } from '../models/surveyanswer.model.mjs';

const getSurveyQuestions = async (req, res) => {
    const [surveys, metadata] = await db.sequelize.query(`SELECT q.id as qID, q.questionText, oa.Id as answerId, oa.AnswerText FROM mydb.question_answer qa INNER JOIN mydb.question q ON qa.Question_Id = q.id 
    LEFT JOIN mydb.offered_answer oa ON qa.OfferedAnswer_Id=oa.Id`);
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
                questionText: q.questionText,
                answers: ans
            });
        }
    });
    res.status(200).json([...map.values()]);
};

const saveSurveyAnswers = async (req, res) => {
    const surveyData = req.body;
    try {
        
        const survey = await Survey.create({
            Description: "Test Description",
            surveyDate: surveyData.surveyDate.split('T')[0],
            nurses_ID: surveyData.nurseId,
            survey_type_id: surveyData.surveyTypeId,
            fitbitData_id: null
        });
        console.log('survey', survey);
        const surveyId = survey.dataValues.id;
        for (let i = 0; i < surveyData.answers.length; i++) {
            const surveyQuestionId = await SurveyQuestion.create({
                Survey_Id: surveyId,
                Question_Id: surveyData.answers[i].qId
            });
            await SurveyAnswer.create({
                answer: surveyData.answers[i].answer,
                survey_question_id: surveyQuestionId.dataValues.id
            });
        }

        res.status(201).send("Success");
    } catch (error) {
        console.log(error)
        res.status(500).send("Error");
    }

};


export { getSurveyQuestions, saveSurveyAnswers };

