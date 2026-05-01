import { ReactNode } from 'react';

interface AuthCardProps {
    children: ReactNode;
    title?: string;
    description?: string;
    icon?: ReactNode;
}

export default function AuthCard({ children, title, description, icon }: AuthCardProps) {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-secondary p-8 rounded-lg border border-white/5 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                {(title || icon) && (
                    <div className="text-center mb-8 relative z-10">
                        {icon && (
                            <div className="w-16 h-16 text-primary mx-auto mb-4 bg-primary/10 p-3 rounded-full flex items-center justify-center">
                                {icon}
                            </div>
                        )}
                        {title && <h1 className="text-3xl font-bold uppercase tracking-wider">{title}</h1>}
                        {description && <p className="text-gray-400 mt-2 text-sm">{description}</p>}
                    </div>
                )}

                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
