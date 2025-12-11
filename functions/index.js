
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { VertexAI } = require("@google-cloud/vertexai");

admin.initializeApp();

const vertex_ai = new VertexAI({project: process.env.GCLOUD_PROJECT, location: 'us-central1'});

exports.extractInsuranceInfo = functions.https.onCall(async (data, context) => {
    // TODO: Add authentication check

    const model = 'gemini-1.5-flash-001';

    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generationConfig: {
            "maxOutputTokens": 8192,
            "temperature": 1,
            "topP": 0.95,
        },
        safetySettings: [],
    });

    const req = {
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        inlineData: {
                            mimeType: data.mimeType,
                            data: data.data
                        }
                    },
                    {text: `Analyze this insurance card image. Extract the Member ID, Group Number, Pager Name (e.g. Aetna, Delta Dental), and Plan Type (e.g. PPO, HMO). Return JSON.`}
                ]
            }
        ],
    };

    const result = await generativeModel.generateContent(req);
    const response = result.response.candidates[0].content.parts[0].text;
    return JSON.parse(response);
});

exports.mineNotes = functions.https.onCall(async (data, context) => {
    const model = 'gemini-1.5-flash-001';

    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generationConfig: {
            "maxOutputTokens": 8192,
            "temperature": 1,
            "topP": 0.95,
        },
        safetySettings: [],
    });

    const req = {
        contents: [
            {
                role: 'user',
                parts: [
                    {text: `Analyze the following dental clinical notes. Identify any treatments that were diagnosed, recommended, or \"watched\", but effectively unscheduled.\n\nNotes: \"${data.notes}\"\n\nReturn a JSON array of objects with fields: treatmentName, status (Diagnosed or Watch), confidence (0-100 integer), and snippet (the specific text).`}
                ]
            }
        ],
    };

    const result = await generativeModel.generateContent(req);
    const response = result.response.candidates[0].content.parts[0].text;
    return JSON.parse(response);
});

exports.generateScript = functions.https.onCall(async (data, context) => {
    const model = 'gemini-1.5-flash-001';

    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: model,
        generationConfig: {
            "maxOutputTokens": 8192,
            "temperature": 1,
            "topP": 0.95,
        },
        safetySettings: [],
    });

    const req = {
        contents: [
            {
                role: 'user',
                parts: [
                    {text: `Create a script for a front desk team member to call a patient about an unscheduled dental treatment. Use a friendly, helpful, and slightly urgent tone. The script should be concise, under 100 words, and clearly state the reason for the call. \n\nPatient Name: ${data.patientName}\nTreatment: ${data.treatment}\nPractice Name: ${data.practiceName}`}
                ]
            }
        ],
    };

    const result = await generativeModel.generateContent(req);
    return result.response.candidates[0].content.parts[0].text;
});
