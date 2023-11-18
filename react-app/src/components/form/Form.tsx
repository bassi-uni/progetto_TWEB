import styles from "./SingleForm.module.css";


import React, {ChangeEvent, useMemo} from "react";
import InputGroup from "../UI/Input/InputGroup";
import Button from "../UI/Button";

import {useForm} from "../../hooks/useForm";
import {State} from "../../reducers/formReducer";

interface FormProps {
    onSwitch: () => void;
    isLogin: boolean;
    loginState: State;
    signupState: State;
    onSubmit: (state: State) => void;
}



const Form: React.FC<FormProps> = ({onSwitch, isLogin, loginState, signupState, onSubmit}) => {
    const {reset:resetSignUp, formState:formStateSignUp, handleInputChange: handleInputChangeSignUp, isValid: isValidSignUp} = useForm(signupState);
    const {reset: resetSignIn, formState: formStateSignIn,handleInputChange: handleInputChangeSignIn, isValid: isValidSignIn} = useForm(loginState);
    const reset = isLogin ? resetSignIn : resetSignUp;
    const formState = isLogin ? formStateSignIn : formStateSignUp;
    const handleInputChange = isLogin ? handleInputChangeSignIn : handleInputChangeSignUp;
    const isValid = isLogin ? isValidSignIn : isValidSignUp;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log({formState});
        reset();
        onSubmit(formState);
    }

    const inputs = useMemo(() => {
        return  Object.keys(formState).map((key) => {
            const {value, error, errorText} = formState[key];
            const inputProps = {
                type: "text",
                value,
                onChange: (e:  ChangeEvent<HTMLInputElement>)=>{
                    handleInputChange({
                        inputName: key,
                        value: e.target.value
                    })
                }
            }
            return <InputGroup key={key} className={styles.group} name={key} inputProps={inputProps} error={[error, errorText]}
            />
        })
    },[formState, handleInputChange]);



    return (
        <div className={styles.container}>
            <h1>SignIn</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                {
                   inputs
                }
                <div className={styles.controls}>
                    <Button className={styles['submit-btn']} type="submit" disabled={!isValid}>
                        Submit
                    </Button>
                    <Button className={styles['switch-form-btn']} onClick={onSwitch}>
                        {isLogin ?  "Sign-Up" : "Sign-In"}
                    </Button>
                </div>
            </form>
        </div>

    )
}

export default Form;