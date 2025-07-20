import React from 'react';
import Banner from '../../../Components/Frontend/Home/Banner';
import TagsSection from '../../../Components/Frontend/Home/TagsSection';
import AnnouncementSection from '../../../Components/Frontend/Home/AnnouncementSection';
import PostCard from '../../../Components/Frontend/Home/PostCard';

const Home = () => {
    return (
        <>
        <Banner></Banner>
        <TagsSection></TagsSection>
        <AnnouncementSection></AnnouncementSection>
        <PostCard></PostCard>
            
        </>
    );
};

export default Home;