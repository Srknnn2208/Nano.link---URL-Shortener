import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const RedirectHandler: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    const hasRun = React.useRef(false);

    useEffect(() => {
        if (!code || hasRun.current) return;
        hasRun.current = true;

        const resolveLink = async () => {
            try {
                const linkData = await api.getUrl(code);
                if (linkData && linkData.longUrl) {
                    // Record click before redirecting
                    await api.trackClick(code);
                    window.location.href = linkData.longUrl;
                } else {
                    setErrorMessage('Invalid Link Configuration');
                }
            } catch (error) {
                console.error('Failed to resolve link:', error);
                setErrorMessage('Link Not Found or Expired');
            }
        };

        resolveLink();
    }, [code]);

    if (errorMessage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500 font-mono">
                <div className="text-center p-8 border border-red-500/30 rounded bg-red-500/10">
                    <h1 className="text-2xl mb-2">ERROR</h1>
                    <p>{errorMessage}</p>
                    <button onClick={() => navigate('/')} className="mt-6 px-4 py-2 border border-red-500 text-sm hover:bg-red-500 hover:text-white transition-colors">
                        RETURN HOME
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="animate-pulse">Redirecting...</div>
        </div>
    );
};
