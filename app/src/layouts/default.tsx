import type React from 'react';



type DefaultLayoutProps = {
    children: React.ReactNode;
};

export default function DefaultLayout({ children }: DefaultLayoutProps): React.ReactNode {
    return (
        <div>
            {children}
        </div>
    )
}

