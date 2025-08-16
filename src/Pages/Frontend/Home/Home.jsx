import React from 'react';
import Banner from '../../../Components/Frontend/Home/Banner';
import TagsSection from '../../../Components/Frontend/Home/TagsSection';
import AnnouncementSection from '../../../Components/Frontend/Home/AnnouncementSection';
import PostCard from '../../../Components/Frontend/Home/PostCard';
import Newsletter from '../Newsletter';
import Reviews from '../Reviews';

const Home = () => {
    return (
        <>
        <Banner></Banner>
        <TagsSection></TagsSection>
        <AnnouncementSection></AnnouncementSection>
        <PostCard></PostCard>
        <Newsletter/>
        <Reviews/>
            
        </>
    );
};

export default Home;