import React from 'react';
import dayjs from 'dayjs';
import {
    Button,
    Portal,
    Snackbar,
    Text,
    useTheme,
} from 'react-native-paper';

import {
    setConnectRequests,
    connectRequestExists,
    setDiscardedRecommendations,
    isRecommendationDiscarded,
} from '@utils/connect';
import { GlobalState } from '@utils/global-state';


export function ConnectMenu({ user, bottomTabs=true }) {
    const theme = useTheme();

    const { sendConnectRequest } = React.useContext(GlobalState);

    const [request, setRequest] = React.useState(false);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);

    const sendRequest = () => {
        sendConnectRequest({ date: dayjs(), user: user });
        setConnectRequests(user.id);
        setRequest(true);
        setSnackbarVisible(true);
    };

    const onDismissSnackBar = () => setSnackbarVisible(false);

    return (
        <>
            {(request || connectRequestExists(user.id)) ? (
                <>
                    <Button
                      mode="contained"
                      disabled={true}
                    >
                        Pending
                    </Button>
                    <Portal>
                        <Snackbar
                          visible={snackbarVisible}
                          action={{
                            label: 'Dismiss',
                            onPress: () => onDismissSnackBar(),
                          }}
                          duration={5000}
                          onDismiss={onDismissSnackBar}
                          style={{
                            position: 'absolute',
                            bottom: 80,
                            left: 0,
                            right: 0,
                          }}
                        >
                            <Text style={{color: theme.colors.background}}>
                                Request sent to {user.username}
                            </Text>
                        </Snackbar>
                    </Portal>
                </>
            ) : (
                <Button
                  mode="contained"
                  onPress={sendRequest}
                >
                    Connect
                </Button>
            )}
        </>
    );
}

export function ConnectMenuInRecommendation({ user }) {
    const theme = useTheme();

    const { sendConnectRequest } = React.useContext(GlobalState);

    const [request, setRequest] = React.useState(false);
    const [discard, setDiscard] = React.useState(false);

    const sendRequest = () => {
        sendConnectRequest({ date: dayjs(), user: user });
        setConnectRequests(user.id);
        setRequest(true);
    }

    const discardRecommendation = () => {
        setDiscardedRecommendations(user.id);
        setDiscard(true);
    };

    return (
        <>
            {(request || connectRequestExists(user.id)) ? (
                <Text style={{color: theme.colors.tertiary, fontWeight: 'bold'}}>
                    Request sent to {user.username}
                </Text>
            ) : (discard || isRecommendationDiscarded(user.id)) ? (
                <Text style={{color: theme.colors.tertiary, marginVertical: 8, fontWeight: 'bold'}}>
                    Removed
                </Text>
            ) : (
                <>
                    <Button
                      mode="contained"
                      onPress={sendRequest}
                    >
                        Connect
                    </Button>
                    <Button
                      mode="outlined"
                      onPress={discardRecommendation}
                      style={{marginLeft: 8}}
                    >
                        Remove
                    </Button>
                </>
            )}
        </>
    );
}