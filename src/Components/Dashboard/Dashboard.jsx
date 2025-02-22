import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../../Context/DashboardContext";
import Swal from "sweetalert2";
import { Rings } from "react-loader-spinner";
import { IoPersonCircleOutline } from "react-icons/io5";

function Dashboard() {
    const { getUsers } = useContext(DashboardContext);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [DashPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Get the token from localStorage
    let Authorization = localStorage.getItem('Authorization');

    // Ensure the token has only one "Bearer" prefix
    const formattedToken = Authorization.startsWith("Bearer ") ? Authorization : `Bearer ${Authorization}`;

    // Set headers with the correctly formatted token
    let headers = {
        Authorization: formattedToken
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data } = await getUsers(currentPage, DashPerPage);
            setUsers(data?.data?.users || []);
            setTotalPages(data.pagination?.totalPages || 1); // Ensure totalPages is set correctly
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch data', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]); // Fetch data when the page changes

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleLoginAsUser = async (userId) => {
        const adminToken = localStorage.getItem("Authorization"); // Get the admin token
    
        try {
            console.log("Current Admin Token:", adminToken);
    
            // Ensure the token has only one "Bearer" prefix
            const formattedAdminToken = adminToken.startsWith("Bearer ") ? adminToken : `Bearer ${adminToken}`;
    
            const response = await axios.post(
                `https://farm-project-bbzj.onrender.com/admin/login-as/${userId}`,
                {},
                {
                    headers: {
                        Authorization: formattedAdminToken
                    }
                }
            );
    
            console.log(response);
            const newToken = response.data?.data?.token;
    
            if (newToken) {
                // Save the admin token for later restoration
                localStorage.setItem("AdminAuthorization", adminToken);
    
                // Set the new user token with only one "Bearer" prefix
                localStorage.setItem("Authorization", `Bearer ${newToken}`);
                localStorage.setItem("isAdmin", "false");
    
                // Reload the page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                Swal.fire("Error", "Failed to log in as user - No Token Received", "error");
            }
        } catch (error) {
            console.error("Error Details:", error.response?.data || error.message);
            Swal.fire("Error", error.response?.data?.message || "Failed to log in as user", "error");
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <Rings visible={true} height="100" width="100" color="#3f5c40" ariaLabel="rings-loading" />
                </div>
            ) : (
                <div className="container">
                    <h1 className="title2">Admin Dashboard</h1>
                    {error && <p className="text-danger mt-3">{error}</p>}

                    <table className="table table-hover mt-4" aria-label="Users Table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>User Type</th>
                                <th>Country</th>
                                <th>Login as User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <th scope="row">{(currentPage - 1) * DashPerPage + index + 1}</th>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.usertype}</td>
                                        <td>{item.country}</td>
                                        <td
                                            className="text-primary"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleLoginAsUser(item._id)}
                                        >
                                            <IoPersonCircleOutline /> Login as User
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No Users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <li key={i + 1} className={`page-item ${i + 1 === currentPage ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => paginate(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}

export default Dashboard;