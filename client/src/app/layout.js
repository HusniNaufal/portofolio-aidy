import './globals.css'

export const metadata = {
    title: 'MNARS | Architecture Portfolio',
    description: 'Portfolio arsitektur digital dengan koleksi proyek perumahan, komersial, interior, dan landscape.',
    keywords: ['architecture', 'portfolio', 'design', 'interior', 'landscape'],
}

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <body className="min-h-screen bg-gradient-radial">
                {children}
            </body>
        </html>
    )
}
