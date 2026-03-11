import LoginForm from '@/components/admin/shared/LoginForm';
import React from 'react';

const Login = () => {
    return (
        <div>
            <div
                className="h-screen w-screen bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url('https://melamine.vn/wp-content/uploads/2023/11/Gioi-thieu-doi-net-ve-Manwah.png')",
                }}
            >
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;
