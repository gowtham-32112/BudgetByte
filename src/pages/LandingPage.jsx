import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ProblemSection from '../components/ProblemSection';
import FeatureSection from '../components/FeatureSection';
import ProductPreview from '../components/ProductPreview';
import CTASection from '../components/CTASection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    return (
        <div className="min-h-screen bg-[#0F0F0F] text-white">
            <Navbar />
            <main>
                <HeroSection />
                <ProblemSection />
                <FeatureSection />
                <ProductPreview />
                <ContactSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
