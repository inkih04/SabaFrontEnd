export default function LoginLayout({ children }) {
    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#bbb',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            margin: 0
        }}>
            {children}
        </div>
    );
}
