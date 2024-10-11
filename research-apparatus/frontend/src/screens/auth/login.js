import React, { useContext, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import {
    IconButton,
    HelperText,
    Text,
    TextInput,
    useTheme,
} from 'react-native-paper';
import validator from 'validator';

import { GlobalState } from '@utils/global-state';


export default function LoginScreen({ route, navigation }) {
    const theme = useTheme();

    const { signIn } = useContext(GlobalState);

    const [email, setEmail] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);

    const [password, setPassword] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(true);

    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [infoMessage, setInfoMessage] = useState('');

    const authenticateUser = async (data) => {
        setSubmitDisabled(true);
        setInfoMessage('');

        const validEmail = validator.isEmail(data.email);
        setIsEmailValid(validEmail);

        const validPassword = validator.isLength(data.password, {min: 4}) && validator.isAlphanumeric(data.password);
        setIsPasswordValid(validPassword);

        if (validEmail && validPassword) {
            setInfoMessage('Signing you in...');
            await signIn(data);
            setInfoMessage('E-mail address and password are incorrect. Please try again.');
        }

        setSubmitDisabled(false);
    };

    return (
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Sign In</Text>
                <View style={styles.inputView}>
                    <TextInput
                      style={styles.input}
                      label="Email"
                      value={email}
                      error={!isEmailValid}
                      onChangeText={(email) => setEmail(email)}
                    />
                    {!isEmailValid ? (
                        <HelperText type="error" style={{marginTop: -10}}>
                            Please enter a valid e-mail address.
                        </HelperText>
                    ) : (
                        null
                    )}
                    <TextInput
                      label="Password"
                      value={password}
                      error={!isPasswordValid}
                      onChangeText={(password) => setPassword(password)}
                      secureTextEntry={true}
                    />
                    {!isPasswordValid ? (
                        <HelperText type="error" style={{marginTop: -10}}>
                            Password must be 4+ characters with letters & numbers.
                        </HelperText>
                    ) : (
                        null
                    )}
                </View>
                {(infoMessage.length > 0) ? (
                    <Text style={styles.infoMessage}>{infoMessage}</Text>
                ) : (
                    null
                )}
                <View style={styles.buttonView}>
                    <IconButton
                      icon="arrow-right"
                      mode="contained"
                      iconColor={theme.colors.onPrimary}
                      containerColor={theme.colors.primary}
                      size={40}
                      disabled={submitDisabled}
                      onPress={() => authenticateUser({ email, password })}
                    />
                </View>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title : {
        fontSize: 30,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputView: {
        gap: 10,
        width: '100%',
        paddingHorizontal: 32,
    },
    buttonView: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 16,
    },
    infoMessage: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 32,
        paddingTop: 32,
    },
});