import React, {Component} from 'react';
import {Text, View, ScrollView, StyleSheet, Button, Picker, Alert} from 'react-native';
import {MKTextField} from "react-native-material-kit";
import CheckBox from 'react-native-check-box'
import * as MKColor from "react-native-material-kit/lib/MKColor";
import Loader from "./Loader";

const styles = StyleSheet.create({
    fieldStyles: {
        height: 40,
    },
    buttonArea: {
        marginBottom: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        width: 350,
        paddingBottom: 20,
        paddingTop: 20
    },
    outerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorMessage: {
        marginTop: 15,
        fontSize: 15,
        color: 'red',
        alignSelf: 'center'
    },
});


export default class Register extends Component {
    state = {
        userName: '',
        password: '',
        age: '',
        ethnicity: '',
        gender: '',
        disabiltiy: false,
        mobileExp: '',
        psycoMeds: '',
        color: false,
        education: '',
        regCode: '',
        loading: false,
        error: '',
        confirmPassword: '',
    };

    renderLoader() {
        if (this.state.loading) {
            return <Loader size='large'/>
        }
        else {
            return <Button title='Register' onPress={this.getAgreement.bind(this)}/>
        }
    }

    getAgreement() {

        fetch('http://testpsych-env.6mijsua8pr.us-east-2.elasticbeanstalk.com/Register?queryType=getAgreement', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        })
            .then((responseJson) => {
                var resp = responseJson._bodyInit;
                if (responseJson.status === 200) {
                    Alert.alert(
                        'User Agreement',
                        resp,
                        [
                            {text: 'Agree', onPress: () => this.onRegister()},
                            {
                                text: 'Disagree', onPress: () => {
                                    return null
                                }
                            },
                        ],
                        {cancelable: false}
                    );
                }
                else {
                    this.setState({
                        loading: false,
                        error: 'Could not fetch user agreement.',
                        loggedIn: false
                    });
                }
                return responseJson;
            });
    }

    onRegister() {
        this.setState({error: '', loading: true});

        if (this.state.age === '') {
            this.setState({
                error: 'Invalid age.',
                loading: false,
            });
            return null;
        }

        var formBody = [];
        for (var property in this.state) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(this.state[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        fetch('http://ec2-18-218-193-117.us-east-2.compute.amazonaws.com:8080/Psych-1/Register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: formBody,
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === '1') {
                    this.setState({
                        loading: false,
                        error: '',
                        loggedIn: true
                    });
                    this.props.navigation.navigate('Login');
                }
                else {
                    this.setState({
                        loading: false,
                        error: responseJson.message,
                        loggedIn: false
                    });
                }
                return responseJson;
            })
    }

    static navigationOptions = {title: 'Welcome', header: null};

    render() {
        const {fieldStyles, buttonArea, errorMessage, container, outerContainer} = styles;
        const {navigate} = this.props.navigation;
        return (
            <View style={outerContainer}>
                <View style={container}>
                    <ScrollView>
                        <MKTextField
                            style={{paddingBottom: 10}}
                            text={this.state.userName}
                            onTextChange={userName => this.setState({userName})}
                            textInputStyle={fieldStyles}
                            placeholder={'Username'}
                            tintColor={MKColor.Black}/>
                        <MKTextField
                            style={{paddingBottom: 10}}
                            text={this.state.password}
                            onTextChange={password => this.setState({password})}
                            textInputStyle={fieldStyles}
                            placeholder={'Password'}
                            tintColor={MKColor.Black}
                            password={true}/>
                        <MKTextField
                            style={{paddingBottom: 10}}
                            text={this.state.confirmPassword}
                            onTextChange={confirmPassword => this.setState({confirmPassword})}
                            textInputStyle={fieldStyles}
                            placeholder={'ConfirmPassword'}
                            tintColor={MKColor.Black}
                            password={true}/>
                        <Picker
                            selectedValue={this.state.age}
                            onValueChange={(itemValue, itemIndex) => this.setState({age: itemValue})}>
                            <Picker.Item label="Age" value="0"/>
                            <Picker.Item label="18" value="18"/>
                            <Picker.Item label="19" value="19"/>
                            <Picker.Item label="20" value="20"/>
                            <Picker.Item label="21" value="21"/>
                            <Picker.Item label="22" value="22"/>
                            <Picker.Item label="23" value="23"/>
                            <Picker.Item label="24" value="24"/>
                            <Picker.Item label="25" value="25"/>
                            <Picker.Item label="26" value="26"/>
                            <Picker.Item label="27" value="27"/>
                            <Picker.Item label="28" value="28"/>
                            <Picker.Item label="29" value="29"/>
                            <Picker.Item label="30" value="30"/>
                            <Picker.Item label="31" value="31"/>
                            <Picker.Item label="32" value="32"/>
                            <Picker.Item label="33" value="33"/>
                            <Picker.Item label="34" value="34"/>
                            <Picker.Item label="35" value="35"/>
                            <Picker.Item label="36" value="36"/>
                            <Picker.Item label="37" value="37"/>
                            <Picker.Item label="38" value="38"/>
                            <Picker.Item label="39" value="39"/>
                            <Picker.Item label="40" value="40"/>
                            <Picker.Item label="41" value="41"/>
                            <Picker.Item label="42" value="42"/>
                            <Picker.Item label="43" value="43"/>
                            <Picker.Item label="44" value="44"/>
                            <Picker.Item label="45" value="45"/>
                            <Picker.Item label="46" value="46"/>
                            <Picker.Item label="47" value="47"/>
                            <Picker.Item label="48" value="48"/>
                            <Picker.Item label="49" value="49"/>
                            <Picker.Item label="50" value="50"/>
                            <Picker.Item label="51" value="51"/>
                            <Picker.Item label="52" value="52"/>
                            <Picker.Item label="53" value="53"/>
                            <Picker.Item label="54" value="54"/>
                            <Picker.Item label="55" value="55"/>
                            <Picker.Item label="56" value="56"/>
                            <Picker.Item label="57" value="57"/>
                            <Picker.Item label="58" value="58"/>
                            <Picker.Item label="59" value="59"/>
                            <Picker.Item label="60" value="60"/>
                            <Picker.Item label="61" value="61"/>
                            <Picker.Item label="62" value="62"/>
                            <Picker.Item label="63" value="63"/>
                            <Picker.Item label="64" value="64"/>
                            <Picker.Item label="65" value="65"/>
                            <Picker.Item label="66" value="66"/>
                            <Picker.Item label="67" value="67"/>
                            <Picker.Item label="68" value="68"/>
                            <Picker.Item label="69" value="69"/>
                            <Picker.Item label="70" value="70"/>
                        </Picker>
                        <Picker
                            selectedValue={this.state.ethnicity}
                            onValueChange={(itemValue, itemIndex) => this.setState({ethnicity: itemValue})}>
                            <Picker.Item label="Ethnicity" value="0"/>
                            <Picker.Item label="African American/Black" value="africanAmerican/black"/>
                            <Picker.Item label="Hispanic/Latino" value="hispanic/latino"/>
                            <Picker.Item label="Asian" value="asian"/>
                            <Picker.Item label="Middle Eastern" value="middleEastern"/>
                            <Picker.Item label="Pacific Islander" value="pacificIslander"/>
                            <Picker.Item label="Native American/Alaskan" value="nativeAmerican/alaskan"/>
                            <Picker.Item label="Other" value="other"/>
                            <Picker.Item label="Choose not to specify" value="notSpecify"/>
                        </Picker>
                        <Picker
                            selectedValue={this.state.gender}
                            onValueChange={(itemValue, itemIndex) => this.setState({gender: itemValue})}>
                            <Picker.Item label="Gender" value="0"/>
                            <Picker.Item label="Male" value="male"/>
                            <Picker.Item label="Female" value="female"/>
                            <Picker.Item label="Choose not to disclose" value="notSpecified"/>
                        </Picker>
                        <Picker
                            selectedValue={this.state.education}
                            onValueChange={(itemValue, itemIndex) => this.setState({education: itemValue})}>
                            <Picker.Item label="Education" value="0"/>
                            <Picker.Item label="High School" value="highSchool"/>
                            <Picker.Item label="Under Graduate" value="underGraduate"/>
                            <Picker.Item label="Graduate" value="graduate"/>
                            <Picker.Item label="doctorate" value="Doctorate"/>
                            <Picker.Item label="Choose not to disclose" value="notSpecified"/>
                        </Picker>
                        <Picker
                            selectedValue={this.state.mobileExp}
                            onValueChange={(itemValue, itemIndex) => this.setState({mobileExp: itemValue})}>
                            <Picker.Item label="Mobile Experience" value="0"/>
                            <Picker.Item label="New User" value="newUser"/>
                            <Picker.Item label="Average" value="average"/>
                            <Picker.Item label="Above Average" value="aboveAverage"/>
                            <Picker.Item label="Expert" value="expert"/>
                            <Picker.Item label="Choose not to disclose" value="notSpecified"/>
                        </Picker>
                        <MKTextField
                            style={{paddingBottom: 10}}
                            text={this.state.psycoMeds}
                            onTextChange={psycoMeds => this.setState({psycoMeds})}
                            textInputStyle={fieldStyles}
                            placeholder={'Psychotherapeutic Medication'}
                            tintColor={MKColor.Black}/>
                        <CheckBox
                            style={{flex: 1, padding: 10}}
                            onClick={() => {
                                this.setState({
                                    color: !this.state.color
                                })
                            }}
                            isChecked={this.state.color}
                            leftText={"Color Blind"}
                        />
                        <CheckBox
                            style={{flex: 1, padding: 10}}
                            onClick={() => {
                                this.setState({
                                    disabiltiy: !this.state.disabiltiy
                                })
                            }}
                            isChecked={this.state.disabiltiy}
                            leftText={"Disability Status"}
                        />
                        <MKTextField
                            text={this.state.regCode}
                            onTextChange={regCode => this.setState({regCode})}
                            textInputStyle={fieldStyles}
                            placeholder={'Registration Code'}
                            tintColor={MKColor.Black}/>
                        <Text style={errorMessage}>
                            {this.state.error}
                        </Text>
                        <View style={buttonArea}>
                            {this.renderLoader()}
                        </View>
                        <View style={buttonArea}>
                            <Button title='Cancel' onPress={() => navigate('Login')}/>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}