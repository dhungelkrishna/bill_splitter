import type { Metadata } from "next";


// export const metadata: Metadata = {
//     title: "Paypasa",
//     description: "Collaborative Payment Tracker",
// };

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4">
                {children}
            </div>
        </>
    );
}
