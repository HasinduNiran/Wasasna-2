import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Added axios import
import Logo from '../../images/logo.png';
import profile from '../../images/pro.png';

const NavBar1 = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isNavOpen, setNavOpen] = useState(false);
    const [userData, setUserData] = useState(null); // Define userData state
    const [loading, setLoading] = useState(true); // Define loading state
    const { cusID } = useParams();

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8077/Customer/${cusID}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cusID) {
            fetchData();
        }
    }, [cusID]);

    if (loading) {
        return <div>Loading...</div>; // Show loading indicator while fetching data
    }

    return (
        <nav className="bg-white border-gray-200 dark:bg-black">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img
                        src={Logo}
                        alt="logo"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: '30%' }}
                    />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Wasana</span>
                </a>
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <button
                        type="button"
                        className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                        id="user-menu-button"
                        aria-expanded={isDropdownOpen}
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                    >
                        <span className="sr-only">Open user menu</span>
                        <img className="w-8 h-8 rounded-full" src={userData.image} alt="profile" />
                    </button>
                    {isDropdownOpen && (
                        <div className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">

                            <ul className="py-2" aria-labelledby="user-menu-button">
                                <li>
                                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                        Settings
                                    </Link>
                                </li>
                                <li>
                                    <Link to={`/`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                        Sign out
                                    </Link>

                                </li>
                            </ul>
                        </div>
                    )}
                    <button
                        data-collapse-toggle="navbar-user"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-user"
                        aria-expanded={isNavOpen}
                        onClick={() => setNavOpen(!isNavOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>
                <div className={`items-center justify-between ${isNavOpen ? 'flex' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-user">
                    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-red-800 md:dark:bg-black dark:border-black">
                        <li>
                            <Link to={`/Readonehome/${cusID}`} className="block py-2 px-3 text-white bg-black rounded md:bg-transparent md:text-gray-100 md:p-0 md:dark:text-gray-200" aria-current="page">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-red-800 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-red-800 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-red-800 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Pricing
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-red-700 md:p-0 dark:text-white md:dark:hover:text-red-800 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar1;
