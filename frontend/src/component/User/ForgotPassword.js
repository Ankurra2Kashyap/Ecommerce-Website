import React, { Fragment, useState, useEffect } from 'react'
import "./ForgotPassword.css"
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { clearErrors } from '../../actions/userAction';
import { forgotPassword } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader/Loader';
// import { Navigate } from 'react-router-dom';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const alert = useAlert();
    const { error, message, loading } = useSelector(
        (state) => state.forgotPassword
    );

    const [email, setEmail] = useState("");

    const forgotPasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("email", email);

        // myForm.set("avatar", avatar);
        // console.log("Sign up form submitted");
        dispatch(forgotPassword(myForm))
    }

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (message) {
            alert.success(message);

        }
    }, [dispatch, error, message]);


    return (
        <Fragment>
            {loading ? (<Loader />) : (<Fragment><MetaData title="Forgot Password" />
                <div className="forgotPasswordContainer">
                    <div className='forgotPasswordBox'>
                        <h2 className='forgotPasswordHeading'>Forgot Password</h2>
                        <form className='forgotPasswordForm'
                            onSubmit={forgotPasswordSubmit}>
                            <div className="forgotPasswordEmail">
                                <MailOutlineIcon />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <input type="submit" value="Send" className="forgotPasswordBtn" />
                        </form>
                    </div>
                </div></Fragment>)}
        </Fragment>
    )
}

export default ForgotPassword
