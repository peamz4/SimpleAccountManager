"use client";
import React, { useEffect, useState } from 'react';
import LoadingScreen from '../components/loading';

const Dashboard: React.FC = () => {
    interface User {
        hn: string;
        name: string;
        phone: string;
        email: string;
        firstName?: string;
        lastName?: string;
    }

    const [data, setData] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [newUser, setNewUser] = useState<User | null>(null); // สำหรับ New User
    const [editUser, setEditUser] = useState<{ firstName: string, lastName: string, hn: string, phone: string, email: string } | null>(null);
    const itemsPerPage = 10;

    const [newUserData, setNewUserData] = useState<User | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
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

    const handleEdit = (user: User) => {
        const [firstName, lastName] = user.name.split(" "); // แยกชื่อและนามสกุล
        setEditUser({
            ...user,
            firstName: firstName || "", // ตั้งค่าให้กับ state ใหม่
            lastName: lastName || "",
        });
        console.log("Edit user:", user);
    };

    const handleNewUserClick = () => {
        setNewUser({ hn: "", name: "", phone: "", email: "" });
    };

    const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prev) => ({ ...prev!, [name]: value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditUser((prev) => ({
            ...prev!,
            [name]: value, // Ensure we are updating the correct field
        }));
    };

    const handleNewUserSave = async () => {
        if (newUser) {
            const { hn, name, phone, email } = newUser;
    
            // Validation checks
            if (!hn || !/^\d{5}$/.test(hn)) {
                alert('HN must be exactly 5 numbers.');
                return;
            }
            if (!name || name.trim() === '') {
                alert('Name cannot be empty.');
                return;
            }
            if (!phone || !/^\d{10,13}$/.test(phone)) {
                alert('Phone must be 10 to 13 digits.');
                return;
            }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Email must contain "@" and "." in a valid format.');
                return;
            }
    
            try {
                const checkResponse = await fetch('http://localhost:3001/api/users/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ hn, email, phone }),
                });
    
                if (!checkResponse.ok) throw new Error('Error checking user duplicates');
                
                const { hnExists, emailExists, phoneExists } = await checkResponse.json();
    
                if (hnExists) {
                    alert('HN already exists.');
                    return;
                }
                if (emailExists) {
                    alert('Email already exists.');
                    return;
                }
                if (phoneExists) {
                    alert('Phone already exists.');
                    return;
                }
    
                // If all checks pass, create the new user
                const response = await fetch('http://localhost:3001/api/users/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser),
                });
    
                if (!response.ok) throw new Error('Error adding new user');
    
                const addedUser = await response.json();
                setData((prevData) => [...prevData, addedUser]); // Add new user to the table
                alert('User added successfully!');
                setNewUser(null); // Close the modal
            } catch (error) {
                console.error('Error:', error);
                alert('Error adding new user. Please try again.');
            }
        }
    };
    

    const cancelNewUser = () => {
        setNewUser(null);
    };

    const handleSave = async () => {
        if (editUser) {
            // Phone number validation (only digits, between 10 and 13 characters)
            const phoneRegex = /^[0-9]{10,13}$/;
            if (!phoneRegex.test(editUser.phone)) {
                alert("Phone number must be between 10 and 13 digits.");
                return;
            }

            // Email validation (contains "@" and ".")
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(editUser.email)) {
                alert("Please enter a valid email address.");
                return;
            }

            try {
                console.log("Saving user:", editUser);  // Add a log to ensure the function is called
                const response = await fetch(`http://localhost:3001/api/users/updatehn/${editUser.hn}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: `${editUser.firstName} ${editUser.lastName}`,
                        phone: editUser.phone,
                        email: editUser.email,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Error updating user: ${response.status}`);
                }

                const updatedUser = await response.json();

                setData((prevData) =>
                    prevData.map((user) =>
                        user.hn === updatedUser.hn ? updatedUser : user
                    )
                );
                alert("User updated successfully!");
                window.location.reload();
                setEditUser(null);  // Close the modal after saving
            } catch (error) {
                console.error("Error saving changes:", error);
            }
        }
    };


    const handleDelete = async (hn: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
            try {
                // ส่งคำขอลบข้อมูลไปยัง API
                const response = await fetch(`http://localhost:3001/api/users/deletehn/${hn}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete the user');
                }

                // ถ้าการลบสำเร็จ ให้รีเฟรชข้อมูล
                setData((prevData) => prevData.filter(user => user.hn !== hn));
                alert("User deleted successfully.");
                window.location.reload();
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Error deleting user. Please try again later.");
            }
        }
    };
    const cancelEdit = () => {
        setEditUser(null);
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
                <button onClick={() => window.location.href = '/'} className='underline'>&lt;&lt; back to home</button>
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
                <div className='flex justify-end mb-4'>
                    <button onClick={handleNewUserClick} className='bg-green-400 xl:p-2 p-1 rounded-full'>New</button>
                </div>
                <table className="table-auto w-full border border-[#F7770F]">
                    <thead>
                        <tr className="bg-[#F7770F] text-left text-white text-[9px] xl:text-[16px] 2xl:text-lg  ">
                            <th className="px-4 py-2 border-orange-900">HN</th>
                            <th className="px-4 py-2 border-orange-900 ">Name</th>
                            <th className="px-4 py-2 border-orange-900">Phone</th>
                            <th className="px-4 py-2 border-orange-900 sm:block hidden">Email</th>
                            <th className="px-4 py-2 border-orange-900 text-center">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((row, index) => (
                                <tr key={row.hn || index} className="hover:bg-orange-200 border-[#F7770F] text-[9px] xl:text-[16px] 2xl:text-lg ">
                                    <td className="px-4 py-2 border-[#F7770F]">{row.hn}</td>
                                    <td className="px-4 py-2 border-[#F7770F] ">{row.name}</td>
                                    <td className="px-4 py-2 border-[#F7770F]">{row.phone}</td>
                                    <td className="px-4 py-2 border-[#F7770F] sm:block hidden">{row.email}</td>
                                    <td className="px-4 py-2 border-[#F7770F] text-center">
                                        <button onClick={() => handleEdit(row)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2">
                                            Edit
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
                        &lt;&lt;
                    </button>
                    <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-[#F7770F] text-black rounded disabled:opacity-50 ml-2"
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
            {/* Modal for New User */}
            {newUser && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-xl font-bold mb-4">Add New User</h2>

                        <div>
                            <label className="block">HN</label>
                            <input
                                type="text"
                                name="hn"
                                className="w-full px-4 py-2 border mb-4"
                                value={newUser.hn}
                                onChange={handleNewUserChange}
                            />
                        </div>

                        <div>
                            <label className="block">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full px-4 py-2 border mb-4"
                                value={newUser.name}
                                onChange={handleNewUserChange}
                            />
                        </div>

                        <div>
                            <label className="block">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                className="w-full px-4 py-2 border mb-4"
                                value={newUser.phone}
                                onChange={handleNewUserChange}
                            />
                        </div>

                        <div>
                            <label className="block">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-4 py-2 border mb-4"
                                value={newUser.email}
                                onChange={handleNewUserChange}
                            />
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={cancelNewUser}
                                className="px-4 py-2 bg-gray-300 rounded">
                                Cancel
                            </button>

                            <button
                                onClick={handleNewUserSave}
                                className="px-4 py-2 bg-green-500 text-white rounded">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editUser && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex justify-center items-center text-black">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <div className="flex justify-items-start mb-2">
                            <div className="flex justify-items-start gap-1 bg-orange-400 px-2 py-1 rounded-xl">
                                <label className="block">HN :</label>
                                <h1>{editUser?.hn || ""}</h1>
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                className="w-full px-4 py-2 mb-4 border"
                                value={editUser?.firstName || ""}
                                onChange={handleInputChange} // Bind to handleInputChange
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                className="w-full px-4 py-2 mb-4 border"
                                value={editUser?.lastName || ""}
                                onChange={handleInputChange} // Bind to handleInputChange
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                className="w-full px-4 py-2 mb-4 border"
                                value={editUser?.phone || ""}
                                onChange={handleInputChange} // Bind to handleInputChange
                            />
                        </div>
                        <div>
                            <label className="block mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-4 py-2 mb-4 border"
                                value={editUser?.email || ""}
                                onChange={handleInputChange} // Bind to handleInputChange
                            />
                        </div>
                        <div className="flex justify-between px-2">
                            {/* Delete button on the left */}
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleDelete(editUser.hn)}
                                    className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>

                            {/* Cancel and Save buttons on the right */}
                            <div className="flex gap-2 items-center">
                                <button
                                    className="px-2 py-2 bg-gray-300 rounded"
                                    onClick={cancelEdit}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-2 py-2 bg-green-500 hover:bg-primaryDark text-white rounded"
                                    onClick={handleSave} // Trigger save changes
                                >
                                    Save
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}


        </div>
    );
};

export default Dashboard;
