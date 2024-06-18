import React, { Fragment, useState } from 'react';
import "./Header.css"
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import Backdrop from '@material-ui/core/Backdrop'
import { makeStyles } from '@material-ui/core/styles';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useAlert } from 'react-alert';
import { logout } from '../../../actions/userAction';
import { useDispatch, useSelector } from "react-redux"

const useStyles = makeStyles((theme) => ({
  // Add your styles here if needed
}));

const UserOptions = ({ user }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const alert = useAlert();
  const dispatch = useDispatch();

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    {
      icon: (
        <ShoppingCartIcon
          style={{ color: cartItems.length > 0 ? "tomato" : "unset" }}
        />
      ),
      name: `Cart(${cartItems.length})`,
      func: cart,
    },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (user.role === "admin") {
    options.unshift({ icon: <DashboardIcon />, name: "Dashboard", func: dashboard })
  }

  function dashboard() {
    navigate("/dashboard")
  }
  function orders() {
    navigate("/orders")
  }
  function account() {
    navigate("/account")
  }
  function cart() {
    navigate("/cart");
  }
  function logoutUser() {
    dispatch(logout())
    alert.success("Logout Successfully")
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        className='speedDial'
        ariaLabel="SpeedDial tooltip example"
        icon={
          <img
            className='speedDialIcon'
            src={user.avatar.url ? user.avatar.url : "./Profile.png"}
            alt="Profile"
          />
        }
        onClose={handleClose}
        onOpen={handleOpen}
        style={{ zIndex: "11" }}
        open={open}
        direction='down'
      >
        {options.map((item) => (
          <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} onClick={item.func}
          tooltipOpen={window.innerWidth <= 600 ? true : false} />
        ))}

      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
