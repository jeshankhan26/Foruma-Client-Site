import React from 'react';
import Navbar from '../../Components/Frontend/Common/Navbar';
import { Outlet } from 'react-router';
import Footer from '../../Components/Frontend/Common/Footer';

const Root = () => {
    return (
        <>
        <Navbar></Navbar>
        <Outlet></Outlet>
        <Footer></Footer>
            
        </>
    );
};

export default Root;