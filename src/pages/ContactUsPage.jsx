import React from 'react';
import Layout from '../components/Layout';
import '../pages-css/ContactUsPage.css'; // Import the CSS file
import Cookies from 'js-cookie';
const token = Cookies.get("token");

const ContactUsPage = () => {
    return (
        <Layout>
            <div className="contact-us-page">
                <h1>Contact Us</h1>
                <p>If you have any questions or need assistance, please feel free to reach out to us.</p>
                <p>Email: findbooks@gmail.com</p>
                <p>Phone: 7046691783 , 6355831203</p>
                <p>Address: Shahpur, Ahmedabad</p>
                <p>We are here to help you!</p>
            </div>
        </Layout>
    );
};

export default ContactUsPage; 