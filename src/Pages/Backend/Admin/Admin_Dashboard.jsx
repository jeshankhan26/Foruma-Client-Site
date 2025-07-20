import React from 'react';
import StatCard from '../../../Components/Backend/Admin/StatCard';
import AnnouncementBanner from '../../../Components/Backend/Admin/AnnouncementBanner';
import ActivityTimeline from '../../../Components/Backend/Admin/ActivityTimeline';
import Profile from '../../../Components/Backend/Admin/Profile';
import NotificationPanel from '../../../Components/Backend/Admin/NotificationPanel';

const Admin_Dashboard = () => {
    return (
        <>

    <StatCard></StatCard>
    <AnnouncementBanner></AnnouncementBanner>
    <ActivityTimeline></ActivityTimeline>
            
        </>
    );
};

export default Admin_Dashboard;