import {Dimensions} from 'react-native';

import {
    REACT_APP_DEV_MODE,
    REACT_APP_PROD_MODE,
    REACT_APP_API_EMAIL,
    REACT_APP_API_PASSWORD,
} from '@env';


export const APP_ENV = (process.env.NODE_ENV === 'development')
    ? 'DEV'
    : 'PROD';


export const API_URL = (APP_ENV === 'DEV') ? REACT_APP_DEV_MODE : REACT_APP_PROD_MODE;
export const API_EMAIL = (APP_ENV === 'DEV') ? REACT_APP_API_EMAIL : null;
export const API_PASSWORD = (APP_ENV === 'DEV') ? REACT_APP_API_PASSWORD : null;


export const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const EXPIRATION_DELTA = 90;


const windowDimensions = Dimensions.get('window');

const dimensions = [
    {width: 430, height: 932},
    {width: 390, height: 844},
    {width: 390, height: 740},
];

const filteredDimensions = dimensions.filter(obj => obj.height < windowDimensions.height);
const suitableDimensions = (filteredDimensions.length === 0)
    ? dimensions[dimensions.length - 1]
    : filteredDimensions[0];

export const PHONE_HEIGHT = suitableDimensions.height;
export const PHONE_WIDTH = suitableDimensions.width;
export const PHONE_THICKNESS = 14;
export const WINDOW_WIDTH = PHONE_WIDTH - PHONE_THICKNESS * 2;


export const MATCHING_CRITERIA = {
    'likeness': [
        {
            'key': 'demographics',
            'title': 'Demographics',
            'description': 'Demographics mean personal information such as gender and age.',
        },
        {
            'key': 'clinical',
            'title': 'Clinical profile',
            'description': 'A clinical profile means health information such as condition(s), symptoms, and treatments.',
        },
        {
            'key': 'lifestyle',
            'title': 'Lifestyle',
            'description': 'By lifestyle, we mean (daily) life information such as activity level and smoking status.',
        },
    ],
    'clinical': [
        {
            'key': 'conditions',
            'title': 'Conditions',
            'description': 'Conditions are diseases that a medical doctor diagnoses one with.',
        },
        {
            'key': 'symptoms',
            'title': 'Symptoms',
            'description': 'A symptom is something a person feels or experiences in their physical or mental health, often associated with a disease.',
        },
        {
            'key': 'treatments',
            'title': 'Treatments',
            'description': 'Treatments are medical approaches to diseases, including meds, therapies (physical or mental), and surgeries.',
        },
    ],
};