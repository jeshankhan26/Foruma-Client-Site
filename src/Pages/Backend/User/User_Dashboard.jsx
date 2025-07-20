import React from 'react';
import WelcomeCard from '../../../Components/Backend/User/WelcomeCard';
import StatCard from '../../../Components/Backend/User/StatCard';
import AnnouncementBanner from '../../../Components/Backend/User/AnnouncementBanner';
import ActivityTimeline from '../../../Components/Backend/User/ActivityTimeline';

const User_Dashboard = () => {
    return (
        <>
        <WelcomeCard></WelcomeCard>
        <StatCard></StatCard>
        <AnnouncementBanner></AnnouncementBanner>
        <ActivityTimeline></ActivityTimeline>
            
        </>
    );
};

export default User_Dashboard;