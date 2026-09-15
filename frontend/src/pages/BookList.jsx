import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import Spinner from "../components/spiner";
import useBooks from "../hooks/useBooks";
import { FaFilter, FaSearch, FaTimes, FaUndo, FaBookOpen } from "react-icons/fa";

function BookList() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Memoize filter object from searchParams
    const queryParams = useMemo(() => {
        const params = {};
        for (const [key, val] of searchParams.entries()) {
            if (val) params[key] = val;
        }
        return params;
    }, [searchParams]);

    const { books, count, error, loading } = useBooks(queryParams);

    const categories = [
        { key: "ALL", label: "அனைத்தும்" },
        { key: "HISTORY", label: "வரலாறு" },
        { key: "POLITICS", label: "அரசியல்" },
        { key: "FARMING", label: "விவசாயம்" },
        { key: "ECONOMIC", label: "பொருளாதாரம்" },
        { key: "SCIENCE", label: "அறிவியல்" },
        { key: "LITRATURE", label: "இலக்கியம்" },
        { key: "OTHER", label: "பிற" }
    ];

    const currentCategory = searchParams.get("book_type") || "ALL";
    const currentSearch = searchParams.get("search") || "";
    const currentStatus = searchParams.get("status");
    const currentRead = searchParams.get("is_read");
    const isFavorite = searchParams.get("favorite") === "true";

    const handleCategoryClick = (catKey) => {
        const newParams = new URLSearchParams(searchParams);
        if (catKey === "ALL") {
            newParams.delete("book_type");
        } else {
            newParams.set("book_type", catKey);
        }
        setSearchParams(newParams);
    };

    const handleRemoveFilter = (key) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(key);
        setSearchParams(newParams);
    };

    const handleResetAll = () => {
        setSearchParams(new URLSearchParams());
    };

    const hasActiveFilters = !!(
        currentSearch ||
        (currentCategory && currentCategory !== "ALL") ||
        currentStatus ||
        currentRead ||
        isFavorite
    );

    return (
        <div className="book-list-page">
            <div className="container-fluid px-3 px-md-5 py-4">
                
                {/* Header Banner */}
                <div className="book-list-hero text-center py-4 mb-4">
                    <span className="badge-glowing-gold mb-2">
                        நூல் களஞ்சியம்
                    </span>
                    <h1 className="display-6 fw-bold text-white mb-2">
                        புத்தகங்களின் தொகுப்பு
                    </h1>
                    <p className="text-secondary mb-0 max-w-lead mx-auto">
                        அனைத்து புத்தகங்களையும் பார்வையிடலாம், தேடலாம் மற்றும் வடிகட்டலாம்.
                    </p>
                </div>

                {/* Quick Category Chips Bar */}
                <div className="quick-category-bar mb-4">
                    <div className="d-flex align-items-center gap-2 overflow-auto pb-2 scrollbar-hidden">
                        {categories.map((cat) => {
                            const active = currentCategory === cat.key;
                            return (
                                <button
                                    key={cat.key}
                                    type="button"
                                    className={`category-pill ${active ? "active" : ""}`}
                                    onClick={() => handleCategoryClick(cat.key)}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Filters Row & Results Count */}
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                    {/* Left: Active Badges */}
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        {currentSearch && (
                            <span className="active-filter-badge">
                                <FaSearch size={10} className="me-1" />
                                தேடல்: "{currentSearch}"
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFilter("search")}
                                    className="btn-filter-remove"
                                >
                                    <FaTimes size={10} />
                                </button>
                            </span>
                        )}

                        {currentCategory && currentCategory !== "ALL" && (
                            <span className="active-filter-badge">
                                வகை: {categories.find((c) => c.key === currentCategory)?.label || currentCategory}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFilter("book_type")}
                                    className="btn-filter-remove"
                                >
                                    <FaTimes size={10} />
                                </button>
                            </span>
                        )}

                        {currentStatus && (
                            <span className="active-filter-badge">
                                இருப்பு: {
                                    currentStatus === "available" ? "உள்ளது" :
                                    currentStatus === "borrowed" ? "கடனாகப் பெற்றது" : "இல்லை"
                                }
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFilter("status")}
                                    className="btn-filter-remove"
                                >
                                    <FaTimes size={10} />
                                </button>
                            </span>
                        )}

                        {currentRead && (
                            <span className="active-filter-badge">
                                வாசிப்பு: {currentRead === "read" ? "படித்தது" : "படிக்கவில்லை"}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFilter("is_read")}
                                    className="btn-filter-remove"
                                >
                                    <FaTimes size={10} />
                                </button>
                            </span>
                        )}

                        {isFavorite && (
                            <span className="active-filter-badge">
                                விருப்பமானவை
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFilter("favorite")}
                                    className="btn-filter-remove"
                                >
                                    <FaTimes size={10} />
                                </button>
                            </span>
                        )}

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="btn-reset-filters"
                            >
                                <FaUndo size={11} className="me-1" />
                                அனைத்தும் மீட்டமை
                            </button>
                        )}
                    </div>

                    {/* Right: Results Count */}
                    <div className="results-count-badge">
                        <FaBookOpen size={12} className="me-1 text-warning" />
                        <span>கிடைத்த புத்தகங்கள்: <strong className="text-white">{books.length}</strong></span>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div
                        className="d-flex justify-content-center align-items-center py-5"
                        style={{ minHeight: "35vh" }}
                    >
                        <Spinner />
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="container py-4">
                        <div className="alert alert-danger text-center rounded-4 shadow-sm">
                            {error}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && books.length === 0 && (
                    <div className="empty-books-state text-center py-5 my-4">
                        <div className="empty-icon-wrapper mb-3">
                            <FaBookOpen size={48} />
                        </div>
                        <h4 className="fw-bold text-white mb-2">
                            புத்தகங்கள் எதுவும் கிடைக்கவில்லை
                        </h4>
                        <p className="text-secondary mb-4 max-w-sm mx-auto">
                            உங்கள் தேடல் அல்லது வடிகட்டி தேர்வுக்கு ஏற்ற புத்தகங்கள் எதுவும் கிடைக்கவில்லை.
                        </p>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                className="btn btn-warning fw-semibold px-4 py-2 rounded-pill"
                                onClick={handleResetAll}
                            >
                                அனைத்து புத்தகங்களையும் காட்டு
                            </button>
                        )}
                    </div>
                )}

                {/* Books Grid */}
                {!loading && !error && books.length > 0 && (
                    <div className="row g-3 g-md-4 pb-5">
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookList;