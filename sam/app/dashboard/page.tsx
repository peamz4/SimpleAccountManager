"use client";
import React, { useEffect, useState } from 'react';
import LoadingScreen from '../components/loading';

const Dashboard: React.FC = () => {
    interface User {
        hn: string;
        name: string;
        phone: string;
        email: string;
    }

    const [data, setData] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/users/getall');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Animate elements on mount
    useEffect(() => {
        const elements = document.querySelectorAll(".animate-class");
        elements.forEach((el) => {
            el.classList.add("show");
        });
    }, [data]);

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    // Filter data based on search term
    const filteredData = data.filter((user) => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.hn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (isLoading) {
        return (
            <div className="flex w-screen h-screen items-center justify-center bg-[#FDFFE8]">
                <main>
                    <LoadingScreen />
                </main>
            </div>
        );
    }

    return (
        <div className='flex w-screen h-screen items-center justify-center flex-col text-black relative'>
            <div className='absolute top-0 left-0 p-4'>
                <button onClick={() => window.location.href = '/'}>back to home</button>
            </div>
            <div className="background absolute inset-0 -z-10">
                <style jsx>{`
                    .background {
                        background-image: url('../background/bg2.svg');
                        background-size: cover;
                        background-position: center;
                    }
                `}</style>
            </div>
            
            <div className="container mx-auto p-4">
                <div className='flex justify-center mb-4'>
                    <h1 className='text-[#F7770F] font-semibold text-4xl'>User Dashboard</h1>
                </div>
                
                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="border border-[#F7770F] rounded px-4 py-2 w-1/2 focus:outline-none"
                    />
                </div>

                <table className="table-auto w-full border border-[#F7770F]">
                    <thead>
                        <tr className="bg-[#F7770F] text-left text-white">
                            <th className="px-4 py-2 border-orange-900">HN</th>
                            <th className="px-4 py-2 border-orange-900">Name</th>
                            <th className="px-4 py-2 border-orange-900">Phone</th>
                            <th className="px-4 py-2 border-orange-900">Email</th>
                            <th className="px-4 py-2 border-orange-900 text-center">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((row, index) => (
                                <tr key={row.hn || index} className="hover:bg-orange-200 border-[#F7770F]">
                                    <td className="px-4 py-2 border-[#F7770F]">{row.hn}</td>
                                    <td className="px-4 py-2 border-[#F7770F]">{row.name}</td>
                                    <td className="px-4 py-2 border-[#F7770F]">{row.phone}</td>
                                    <td className="px-4 py-2 border-[#F7770F]">{row.email}</td>
                                    <td className="px-4 py-2 border-[#F7770F] text-center">
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center py-4">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="flex justify-center mt-4">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1} 
                        className="px-4 py-2 bg-[#F7770F] text-black rounded disabled:opacity-50 mr-2"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages} 
                        className="px-4 py-2 bg-[#F7770F] text-black rounded disabled:opacity-50 ml-2"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
