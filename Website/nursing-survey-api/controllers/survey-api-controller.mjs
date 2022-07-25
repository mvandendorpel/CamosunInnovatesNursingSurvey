import db from '../models/index.mjs';
import { Survey } from '../models/survey.model.mjs';
import {SurveyQuestion} from '../models/survey-question.model.mjs';
import { SurveyAnswer } from '../models/surveyanswer.model.mjs';
import { ShiftData } from '../models/shiftdata.mjs';
import { Sequelize } from 'sequelize';

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
            // shift data
            if (surveyData.answers[i].qId == 2) {
                const [startTime, endTime] = surveyData.answers[i].answer.split(' - ');
                await ShiftData.create({
                    startTime: startTime,
                    endTime: endTime,
                    survey_Id: surveyId
                })
            }
        }
        const query  = `SELECT q.*, sa.answer FROM mydb.survey s INNER JOIN mydb.survey_question sq ON s.Id=sq.Survey_Id
        INNER JOIN question q ON q.id = sq.Question_Id
        INNER JOIN surveyanswer sa ON sq.id=sa.survey_question_id 
        WHERE s.Id = ${surveyId}`;
        const [surveyResult, metadata] = await db.sequelize.query(query);

        res.status(201).json(surveyId);
        
    } catch (error) {
        console.log(error)
        res.status(500).send("Error");
    }

};

const getWeeklySurvey = async(req, res) => {
    try {
    const query = `SELECT s.nurses_ID,s.survey_type_id, q.id, q.questionText, sa.answer FROM mydb.survey s 
    INNER JOIN mydb.survey_question sq ON s.Id=sq.Survey_Id 
    INNER JOIN mydb.question q ON q.id=sq.Question_Id 
    LEFT JOIN mydb.surveyanswer sa ON sa.survey_question_id=sq.id
     WHERE DATE(s.dateCompleted) >= DATE(NOW()) - INTERVAL 7 DAY AND s.nurses_ID = ${req.query.nurses_id};`

     const [results, metadata] = await db.sequelize.query(query);
     res.status(200).send(results);
    }
    catch(error) {
        console.log(error);
        res.status(500).send(error);
    }

}

const getAllSurveys = async(req, res) => {
    try {
        const query = `SELECT q.*, sa.answer, q.id FROM mydb.survey s INNER JOIN mydb.survey_question sq ON s.Id=sq.Survey_Id
        INNER JOIN question q ON q.id = sq.Question_Id
        INNER JOIN surveyanswer sa ON sq.id=sa.survey_question_id 
        WHERE s.nurses_ID = ${req.query.nurses_id}`;

        const [results, metadata] = await db.sequelize.query(query);
        res.status(200).send(results);
    }
    catch(error) {
        console.log(error)
        res.status(500).send(error);
    }

}

const getLastSurvey = async(req, res) => {
    try {
        const query = `SELECT * from survey INNER JOIN fitbitdata ON survey.nurses_ID = fitbitdata.nurses_ID WHERE survey.nurses_ID = ${req.query.nurses_ID} ORDER BY survey.id DESC LIMIT 1;`;
        const [results, metadata] = await db.sequelize.query(query);
        res.status(200).send(results[0]);
    }
    catch(err) {
        console.log(err);
        res.status(500).send(error);
    }
}

const getDashboardInfo = async(req, res) => {
    try {
        let surveyDateCheck = new Date();
        const studyStart = new Date(2022, 4, 15);
        const dailySurveyPeriod = [];
        for (surveyDateCheck; surveyDateCheck >= studyStart; surveyDateCheck.setDate(surveyDateCheck.getDate() - 1)) {
            dailySurveyPeriod.push(`${surveyDateCheck.getFullYear()}-${('0' + (surveyDateCheck.getMonth()+1)).slice(-2)}-${('0' + surveyDateCheck.getDate()).slice(-2)}`);
        }
        //('0' + MyDate.getDate()).slice(-2) + '/'
        //+ ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
        const dailSurveyData = await Survey.findAll({
            where: {
                surveyDate: {
                    [Sequelize.Op.in]: dailySurveyPeriod
                },
                nurses_ID: req.query.nurses_id,
                survey_type_id: 1
            }
        })

        const dailySurveyDates = dailSurveyData.map(sd => sd.surveyDate);
        const dailySurveyList = dailySurveyPeriod.map(element => {
            return {
                surveyDate: element,
                surveyComplete: dailySurveyDates.includes(element)
            }
        })
        let weeklyDates = [];
        surveyDateCheck = studyStart;
        let now = new Date();
        for (surveyDateCheck; surveyDateCheck <= now; surveyDateCheck.setDate(surveyDateCheck.getDate() + 7)) {
            weeklyDates.push(`${surveyDateCheck.getFullYear()}-${('0' + (surveyDateCheck.getMonth()+1)).slice(-2)}-${('0' + surveyDateCheck.getDate()).slice(-2)}`);
        }
        const weeklySurveyData = await Survey.findAll({
            where: {
                surveyDate: {
                    [Sequelize.Op.in]: weeklyDates
                },
                nurses_ID: req.query.nurses_id,
                survey_type_id: 2
            }
        })
        const weeklySurveyDates = weeklySurveyData.map(sd => sd.surveyDate);
        const weeklySurveyList = weeklyDates.map(element => {
            return {
                surveyDate: element,
                surveyComplete: weeklySurveyDates.includes(element)
            }
        })
        
        const responseData = {
            dailySurveyList,
            weeklySurveyList
        };
        //console.log(responseData);
        res.status(200).send(responseData);

    }
    catch(err) {
        console.log(err);
        res.status(500).send(err);
    }

}




export { getWeeklyQuestions, postWeeklySurvey, getWeeklySurvey, getAllSurveys, getLastSurvey, getDashboardInfo};

