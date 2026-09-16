import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { FaSearch, FaTimes, FaPlus, FaBook, FaHome, FaUserShield, FaSlidersH } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FilterModal from "./FilterModal";

export default function Navbar() {
    const { user, isLoggedIn, logout, loading } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Search query state
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionLoading, setSuggestionLoading] = useState(false);

    useEffect(() => {
        const query = searchQuery.trim();

        if (!query) {
            setSearchSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSuggestionLoading(true);

                const response = await fetch(
                    `http://127.0.0.1:8000/api/books/?search=${encodeURIComponent(query)}`
                );

                const result = await response.json();

                setSearchSuggestions(result.data?.slice(0, 5) || []);
                setShowSuggestions(true);

            } catch (error) {
                console.error("Suggestion error:", error);
                setSearchSuggestions([]);
            } finally {
                setSuggestionLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Sync input with URL search param
    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
    }, [searchParams]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Calculate active filter count
    const activeFilterCount = [
        searchParams.get("book_type"),
        searchParams.get("status"),
        searchParams.get("is_read"),
        searchParams.get("favorite"),
        searchParams.get("ordering") && searchParams.get("ordering") !== "latest"
            ? searchParams.get("ordering")
            : null
    ].filter(Boolean).length;

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const trimmed = searchQuery.trim();

        const newParams = new URLSearchParams(location.search);
        if (trimmed) {
            newParams.set("search", trimmed);
        } else {
            newParams.delete("search");
        }

        if (location.pathname === "/books") {
            setSearchParams(newParams);
        } else {
            navigate(`/books?${newParams.toString()}`);
        }
        setIsMobileMenuOpen(false);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        const newParams = new URLSearchParams(location.search);
        newParams.delete("search");
        if (location.pathname === "/books") {
            setSearchParams(newParams);
        }
    };

    const handleLogout = async () => {
        await logout();
        showToast("வெற்றிகரமாக வெளியேறினீர்கள்", "info");
        navigate("/");
    };

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(location.search);
        if (value === "ALL" || value === "" || value === false || value === null) {
            newParams.delete(key);
        } else {
            newParams.set(key, String(value));
        }

        if (location.pathname === "/books") {
            setSearchParams(newParams);
        } else {
            navigate(`/books?${newParams.toString()}`);
        }
    };

    const handleResetFilters = () => {
        const newParams = new URLSearchParams();
        const currentSearch = searchParams.get("search");
        if (currentSearch) {
            newParams.set("search", currentSearch);
        }

        if (location.pathname === "/books") {
            setSearchParams(newParams);
        } else {
            navigate(`/books?${newParams.toString()}`);
        }
        setIsFilterModalOpen(false);
        showToast("வடிகட்டிகள் மீட்டமைக்கப்பட்டன", "info");
    };

    // Build filter state for FilterModal
    const currentFilters = {
        book_type: searchParams.get("book_type") || "ALL",
        status: searchParams.get("status") || "ALL",
        is_read: searchParams.get("is_read") || "ALL",
        favorite: searchParams.get("favorite") === "true",
        ordering: searchParams.get("ordering") || "latest"
    };

    return (
        <>
            <nav className="modern-navbar sticky-top">
                <div className="container-fluid px-3 px-md-4">
                    <div className="d-flex align-items-center justify-content-between w-100 py-2">
                        
                        {/* LEFT: Brand Logo */}
                        <div className="d-flex align-items-center gap-3">
                            <Link to="/" className="navbar-brand-modern">
                                <span className="brand-badge-red">எனது</span>
                                <span className="brand-badge-gold">புத்தகம்</span>
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="d-none d-lg-flex align-items-center gap-1 ms-3">
                                <Link
                                    to="/"
                                    className={`nav-link-modern ${location.pathname === "/" ? "active" : ""}`}
                                >
                                    <FaHome className="me-1" />
                                    முகப்பு
                                </Link>
                                <Link
                                    to="/books"
                                    className={`nav-link-modern ${location.pathname === "/books" ? "active" : ""}`}
                                >
                                    <FaBook className="me-1" />
                                    நூல்கள்
                                </Link>
                            </div>
                        </div>

                        {/* CENTER: Search Bar & Filter Button (Desktop / Tablet) */}
                        <div className="d-none d-md-flex flex-grow-1 mx-4 max-w-search">
                            <form className="search-form-modern w-100" onSubmit={handleSearchSubmit}>
                                <button
                                    type="button"
                                    className={`filter-btn-modern ${activeFilterCount > 0 ? "has-filters" : ""}`}
                                    onClick={() => setIsFilterModalOpen(true)}
                                    title="வடிகட்டி (Filter)"
                                >
                                    <FaSlidersH size={15} />
                                    {activeFilterCount > 0 && (
                                        <span className="filter-count-badge">{activeFilterCount}</span>
                                    )}
                                </button>

                                <div className="search-input-wrapper flex-grow-1 position-relative">

                                    <input
                                        className="search-input-modern"
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => {
                                            if (searchQuery.trim()) {
                                                setShowSuggestions(true);
                                            }
                                        }}
                                        placeholder="புத்தகம் அல்லது ஆசிரியர் பெயர் தேடுக..."
                                        aria-label="தேடு"
                                    />

                                    {searchQuery && (
                                        <button
                                            type="button"
                                            className="clear-search-btn"
                                            onClick={handleClearSearch}
                                            aria-label="Clear search"
                                        >
                                            <FaTimes size={13} />
                                        </button>
                                    )}

                                    {/* Suggestions */}
                                    {showSuggestions && searchSuggestions.length > 0 && (
                                        <div className="search-suggestions">

                                            {searchSuggestions.map((book) => (
                                                <button
                                                    key={book.id}
                                                    type="button"
                                                    className="search-suggestion-item"
                                                    onClick={() => {
                                                        setSearchQuery(book.title);
                                                        setShowSuggestions(false);

                                                        navigate(
                                                            `/books?search=${encodeURIComponent(book.title)}`
                                                        );
                                                    }}
                                                >
                                                    <FaBook size={14} />

                                                    <div className="suggestion-content">
                                                        <div className="suggestion-title">
                                                            {book.title}
                                                        </div>

                                                        {book.author && (
                                                            <small>
                                                                {book.author}
                                                            </small>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}

                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn-search-submit"
                                    aria-label="Submit search"
                                >
                                    <FaSearch size={14} />
                                    <span className="ms-1 d-none d-lg-inline">தேடு</span>
                                </button>
                            </form>
                        </div>

                        {/* RIGHT: Desktop Auth Actions */}
                        <div className="d-none d-md-flex align-items-center gap-2">
                            {isLoggedIn ? (
                                <div className="d-flex align-items-center gap-2">
                                    <Link
                                        to="/books/add"
                                        className="btn btn-outline-warning btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3 py-1"
                                    >
                                        <FaPlus size={11} />
                                        <span>புத்தகம் சேர்க்க</span>
                                    </Link>

                                    <div className="user-badge d-inline-flex align-items-center gap-1">
                                        <FaUserShield className="text-warning" size={13} />
                                        <span className="user-phone">{user?.phone_number || "User"}</span>
                                    </div>

                                    <button
                                        className="btn btn-danger btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3"
                                        type="button"
                                        onClick={handleLogout}
                                        disabled={loading}
                                    >
                                        <IoMdLogOut size={16} />
                                        <span>வெளியேறு</span>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="btn btn-success btn-sm d-inline-flex align-items-center gap-1 rounded-pill px-3 py-2 shadow-sm"
                                >
                                    <IoMdLogIn size={18} />
                                    <span>உள்நுழைய</span>
                                </Link>
                            )}
                        </div>

                        {/* RIGHT CORNER: Mobile Hamburger Button */}
                        <div className="d-flex d-md-none align-items-center gap-2">
                            {/* Mobile Filter Button */}
                            <button
                                type="button"
                                className={`filter-btn-mobile ${activeFilterCount > 0 ? "has-filters" : ""}`}
                                onClick={() => setIsFilterModalOpen(true)}
                                aria-label="Filter"
                            >
                                <FaSlidersH size={15} />
                                {activeFilterCount > 0 && (
                                    <span className="filter-count-badge-mobile">{activeFilterCount}</span>
                                )}
                            </button>

                            {/* Hamburger Menu Toggle Button */}
                            <button
                                type="button"
                                className={`hamburger-btn ${isMobileMenuOpen ? "open" : ""}`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle navigation menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Row (Always accessible under brand on mobile) */}
                    <div className="d-md-none pb-2 pt-1">
                        <form className="search-form-modern w-100" onSubmit={handleSearchSubmit}>
                            <div className="search-input-wrapper flex-grow-1">
                                <input
                                    className="search-input-modern"
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="புத்தகம் அல்லது ஆசிரியர் பெயர் தேடுக..."
                                    aria-label="தேடு"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="clear-search-btn"
                                        onClick={handleClearSearch}
                                        aria-label="Clear search"
                                    >
                                        <FaTimes size={13} />
                                    </button>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn-search-submit"
                                aria-label="Submit search"
                            >
                                <FaSearch size={14} />
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            {/* Mobile Offcanvas Drawer Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        className="mobile-drawer-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="mobile-drawer-header d-flex align-items-center justify-content-between p-3 border-bottom border-secondary border-opacity-25">
                            <div className="navbar-brand-modern">
                                <span className="brand-badge-red">எனது</span>
                                <span className="brand-badge-gold">புத்தகம்</span>
                            </div>
                            <button
                                type="button"
                                className="btn-close-filter"
                                onClick={() => setIsMobileMenuOpen(false)}
                                aria-label="Close menu"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Drawer Body */}
                        <div className="mobile-drawer-body p-3">
                            {/* Nav Links */}
                            <div className="d-flex flex-column gap-2 mb-4">
                                <Link
                                    to="/"
                                    className={`mobile-nav-link ${location.pathname === "/" ? "active" : ""}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FaHome size={17} />
                                    <span>முகப்பு (Home)</span>
                                </Link>
                                <Link
                                    to="/books"
                                    className={`mobile-nav-link ${location.pathname === "/books" ? "active" : ""}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FaBook size={17} />
                                    <span>நூல் தொகுப்பு (All Books)</span>
                                </Link>
                                <button
                                    type="button"
                                    className="mobile-nav-link text-start"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setIsFilterModalOpen(true);
                                    }}
                                >
                                    <FaSlidersH size={17} />
                                    <span>வடிகட்டி (Filter Books) {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
                                </button>
                            </div>

                            <hr className="border-secondary border-opacity-25 my-3" />

                            {/* User Authentication Status */}
                            {isLoggedIn ? (
                                <div className="d-flex flex-column gap-3">
                                    <div className="mobile-user-card p-3 rounded-3">
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <FaUserShield className="text-warning" size={18} />
                                            <span className="fw-bold text-white">அங்கீகரிக்கப்பட்ட பயனர்</span>
                                        </div>
                                        <small className="text-muted d-block">{user?.phone_number}</small>
                                    </div>

                                    <Link
                                        to="/books/add"
                                        className="btn btn-warning w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2 fw-semibold"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <FaPlus size={14} />
                                        <span>புதிய புத்தகம் சேர்க்க</span>
                                    </Link>

                                    <button
                                        className="btn btn-danger w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2"
                                        type="button"
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        disabled={loading}
                                    >
                                        <IoMdLogOut size={19} />
                                        <span>வெளியேறு (Logout)</span>
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-muted small mb-3">
                                        புத்தகங்களை நிர்வகிக்க மற்றும் மாற்றியமைக்க உள்நுழையவும்.
                                    </p>
                                    <Link
                                        to="/login"
                                        className="btn btn-success w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2 fw-semibold shadow"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <IoMdLogIn size={20} />
                                        <span>உள்நுழைய (Login)</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                filters={currentFilters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
            />
        </>
    );
}