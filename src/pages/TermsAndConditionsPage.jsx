import React from 'react';
import Layout from '../components/Layout';
import '../pages-css/TermsAndConditionsPage.css'; 

const TermsAndConditionsPage = () => {
    return (
        <Layout>
            <div className="terms-and-conditions-page">
                <h1>Terms and Conditions</h1>
                <p>By using our service, you agree to the following terms:</p>
                <ul>
                    <li>You are responsible for maintaining the confidentiality of your account.</li>
                    <li>You agree to provide accurate and complete information.</li>
                    <li>We reserve the right to terminate your account if you violate these terms.</li>
                </ul>
            </div>
        </Layout>
    );
};

export default TermsAndConditionsPage; 