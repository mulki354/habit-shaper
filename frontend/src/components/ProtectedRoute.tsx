import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContent';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-zinc-950 px-4">
                <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl space-y-6">
                    <div className="h-8 bg-zinc-800 rounded-md w-3/4 animate-pulse"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-zinc-800 rounded-md animate-pulse"></div>
                        <div className="h-4 bg-zinc-800 rounded-md w-5/6 animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
