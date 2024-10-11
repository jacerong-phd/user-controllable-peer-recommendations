import {
    createContext,
    useEffect,
    useMemo,
    useReducer,
} from "react";
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import validator from 'validator';

import { ApiClient } from '@utils/axios-api-instance';
import {
    APP_ENV,
    API_EMAIL,
    API_PASSWORD,
    DATE_TIME_FORMAT,
    EXPIRATION_DELTA,
} from "@utils/constants";
import { sessionStorage } from '@utils/storage';


/*
 * Source:
 * https://frontendbyte.com/how-to-use-react-context-api-usereducer-hooks/
 */

const GLOBAL_STATE = {
    isSignedIn: false,
    userToken: null,
    isThemeDark: false,
    recommEngine: 'clinical',
    userControl: false,
    connectRequests: [],
};


const globalReducer = (state, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...state,
                userToken: action.token,
            };
        case 'SIGN_IN':
            return {
                ...state,
                isSignedIn: true,
                userToken: action.token,
            };
        case 'SIGN_OUT':
            return {
                ...state,
                isSignedIn: false,
                userToken: null
            };
        case 'LIGHT_THEME':
            return {
                ...state,
                isThemeDark: false,
            };
        case 'DARK_THEME':
            return {
                ...state,
                isThemeDark: true,
            };
        case 'ENABLE_CONTROL':
            return {
                ...state,
                userControl: true,
            };
        case 'DISABLE_CONTROL':
            return {
                ...state,
                userControl: false,
            };
        case 'SET_RECOMM_ENGINE':
            return {
                ...state,
                recommEngine: action.value,
            };
        case 'SEND_REQUEST':
            return {
                ...state,
                connectRequests: [
                    ...state.connectRequests,
                    action.request,
                ]
            };
        default:
            return state;
    }
};


export const GlobalState = createContext();
GlobalState.displayName = 'GlobalState';


export const GlobalStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(globalReducer, GLOBAL_STATE);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const bootstrapAsync = async () => {
            /*
             * Log the user into the app automatically if a session is still active.
             */
            let autoLogIn = false;
            let userToken;

            if (
                sessionStorage.contains('userToken') &&
                validator.isJWT(sessionStorage.getString('userToken')) &&
                sessionStorage.contains('expiration') &&
                validator.isBase64(sessionStorage.getString('expiration'))
            ) {
                userToken = sessionStorage.getString('userToken');

                const now = dayjs();
                const expiration = atob(sessionStorage.getString('expiration'));

                autoLogIn = now.isBefore(dayjs(expiration, DATE_TIME_FORMAT));
            }

            if (!autoLogIn)
                sessionStorage.clearAll();

            // Delete certain cookies even if a session is still active.
            const keys = ['connectRequests', 'discardedRecommendations', 'recommPreferences'];
            keys.forEach((key) => {
                if (autoLogIn && sessionStorage.contains(key))
                    sessionStorage.delete(key);
            });

            if (autoLogIn && userToken !== undefined) {
                dispatch({ type: 'SIGN_IN', token: userToken });
            } else if (APP_ENV === 'DEV') {
                const response = await authenticateUser(API_EMAIL, API_PASSWORD);
                dispatch({ type: 'SIGN_IN', token: response.body });
            }

            /*
             * Look for app settings in the URL.
             */

            if (
                searchParams.has('setting') &&
                validator.isBase64(searchParams.get('setting'))
            ) {
                let setting = atob(searchParams.get('setting'));
                setting = JSON.parse(setting);

                if (
                    'recommEngine' in setting &&
                    typeof setting['recommEngine'] === 'string' &&
                    ['clinical', 'likeness'].includes(setting['recommEngine'].toLowerCase())
                )
                    dispatch({ type: 'SET_RECOMM_ENGINE', value: setting['recommEngine'].toLowerCase() });

                if (
                    'userControl' in setting &&
                    typeof setting['userControl'] === 'boolean'
                )
                    dispatch({ type: setting['userControl'] ? 'ENABLE_CONTROL' : 'DISABLE_CONTROL' });
            }
        };

        bootstrapAsync();
    }, []);

    const value = useMemo(
        () => ({
            ...state,
            signIn: async (data) => {
                const response = await authenticateUser(data.email, data.password);
                if (response.status === '200')
                    dispatch({ type: 'SIGN_IN', token: response.body });
            },
            signOut: () => dispatch({ type: 'SIGN_OUT' }),
            setLightTheme: () => {
                dispatch({ type: 'LIGHT_THEME' });
            },
            setDarkTheme: () => {
                dispatch({ type: 'DARK_THEME' });
            },
            sendConnectRequest: (data) => {
                dispatch({ type: 'SEND_REQUEST', request: data });
            },
        }),
        [state, dispatch]
    );

    return <GlobalState.Provider value={value}>{children}</GlobalState.Provider>;
};


const authenticateUser = async (email, password) => {
    const request = await ApiClient().login(email, password);

    let userToken;
    let status;

    if (typeof request === 'string' && request.length > 0) {
        status = '200';

        userToken = request;
        sessionStorage.set('userToken', userToken);

        const now = dayjs();
        const exp = now.add(EXPIRATION_DELTA, 'm');
        sessionStorage.set('expiration', btoa(exp.format(DATE_TIME_FORMAT)));

        const user = await ApiClient().get("/users/me");
        sessionStorage.set('userId', user.id);
        sessionStorage.set('username', user.username);
    } else if (
        typeof request === 'object' &&
        'response' in request &&
        'status' in request['response']
    ) {
        status = request['response']['status'];
    }

    return {status: status, body: userToken};
};