import React, { Fragment, useState, useEffect } from 'react'
import "./UpdatePassword.css"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { clearErrors } from '../../actions/userAction';
import { updatePassword } from '../../actions/userAction';
import { useAlert } from 'react-alert';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader/Loader';
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const alert = useAlert();
    const { error, isUpdated, loading } = useSelector((state) => state.profile)
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const updatePasswordSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);

        // myForm.set("avatar", avatar);
        // console.log("Sign up form submitted");
        dispatch(updatePassword(myForm))
    }


    useEffect(() => {
        if (error) {
            console.log(error);
            alert.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Profile Updated Successfully");
            navigate("/account");

            dispatch({
                type: UPDATE_PASSWORD_RESET,
            })
        }
    }, [dispatch, error, alert, isUpdated]);
    return (
        <Fragment>
            {loading ? (<Loader />) : (<Fragment><MetaData title="Change Password" />
                <div className="updatePasswordContainer">
                    <div className='updatePasswordBox'>
                        <h2 className='updatePasswordHeading'>Update Profile</h2>
                        <form className='updatePasswordForm'
                            encType='multipart/form-data'
                            onSubmit={updatePasswordSubmit}>

                            <div className='loginPassword'>
                                <VpnKeyIcon />
                                <input
                                    type='password'
                                    placeholder='Old Password'
                                    required
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                            </div>
                            <div className='loginPassword'>
                                <LockOpenIcon />
                                <input
                                    type='password'
                                    placeholder='New Password'
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className='loginPassword'>
                                <LockIcon />
                                <input
                                    type='password'
                                    placeholder='Confirm Password'
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <input type="submit" value="Change" className="updatePasswordBtn" />
                        </form>
                    </div>
                </div></Fragment>)}
        </Fragment>
    )
}

export default UpdatePassword
