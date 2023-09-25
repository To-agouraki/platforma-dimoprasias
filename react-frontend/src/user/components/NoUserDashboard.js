import React from 'react';
import './AdminDashboard.css';
import Card from '../../shared/components/UIElements/Card';
import { Link } from 'react-router-dom';

const NoUserDashboard = () => {
    return (
        <div className="center">
            <div className="nouser-dashboard">
                <Card className="dashboard-card">
                    <h1 className="dashboard-title-nouser">Welcome User</h1>
                    <p className="dashboard-text">
                        You may browse items by clicking the Market button.
                    </p>
                    <p className="dashboard-text">
                        If you already have an account, you can log in.
                    </p>
                    <div className="button-container">
                        <Link to="/market" className="dashboard-button">
                            Market
                        </Link>
                        <Link to="/login" className="dashboard-button">
                            Log in
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default NoUserDashboard;
