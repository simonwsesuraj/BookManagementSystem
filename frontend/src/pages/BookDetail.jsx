import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaBookOpen,
    FaUser,
    FaBuilding,
    FaCalendarAlt,
    FaTag,
    FaCheckCircle,
    FaClock,
    FaShoppingCart,
    FaEdit,
    FaTrash,
    FaArrowLeft,
    FaDownload,
    FaExclamationTriangle
} from "react-icons/fa";
import { BASE_URL } from "../api/api";
import useBookDetails from "../hooks/useBookDetails";
import { bookDelete, bookUpdate } from "../services/bookServices";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Spinner from "../components/spiner";

function BookDetail() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { showToast } = useToast();

    const { book, loading, error } = useBookDetails(bookId);

    const [selectedImage, setSelectedImage] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Sync favorite state when book loads
    React.useEffect(() => {
        if (book) {
            setIsFavorite(book.favorite || false);
        }
    }, [book]);

    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "70vh" }}
            >
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center rounded-4 shadow-sm">
                    {error}
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning text-center rounded-4 shadow-sm">
                    புத்தகம் காணப்படவில்லை (Book not found).
                </div>
            </div>
        );
    }

    let availability = "";
    let availabilityClass = "";
    let availabilityIcon = null;

    if (book.available && !book.borrowed) {
        availability = "உள்ளது (Available)";
        availabilityClass = "text-success bg-success-subtle";
        availabilityIcon = <FaCheckCircle className="text-success" />;
    } else if (book.borrowed) {
        availability = "கடனாகப் பெறப்பட்டுள்ளது (Borrowed)";
        availabilityClass = "text-warning bg-warning-subtle";
        availabilityIcon = <FaClock className="text-warning" />;
    } else {
        availability = "இல்லை (Out of stock)";
        availabilityClass = "text-danger bg-danger-subtle";
        availabilityIcon = <FaExclamationTriangle className="text-danger" />;
    }

    const imageBaseUrl = BASE_URL;

    const handleToggleFavorite = async () => {
        if (!isLoggedIn) {
            showToast("விருப்பமானவைகளில் சேர்க்க உள்நுழைய வேண்டும்.", "warning");
            return;
        }

        const newFav = !isFavorite;
        try {
            await bookUpdate(book.id, { favorite: newFav });
            setIsFavorite(newFav);
            showToast(
                newFav ? "விருப்பமானவைகளில் சேர்க்கப்பட்டது!" : "விருப்பத்திலிருந்து நீக்கப்பட்டது!",
                "success"
            );
        } catch (err) {
            showToast("பிடித்த மாற்றத்தில் பிழை ஏற்பட்டது.", "error");
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await bookDelete(book.id);
            showToast("புத்தகம் வெற்றிகரமாக நீக்கப்பட்டது!", "success");
            navigate("/books");
        } catch (err) {
            console.error("Delete failed:", err);
            showToast(err.response?.data?.message || "புத்தகத்தை நீக்க முடியவில்லை.", "error");
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="book-detail-page py-4 py-md-5">
            <div className="container px-3 px-md-4">
                
                {/* Back Button & Breadcrumbs */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <Link
                        to="/books"
                        className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                    >
                        <FaArrowLeft size={12} />
                        <span>அனைத்து புத்தகங்கள்</span>
                    </Link>

                    {/* Authorized User Actions Top Bar */}
                    {isLoggedIn && (
                        <div className="d-flex align-items-center gap-2">
                            <Link
                                to={`/books/${book.id}/edit`}
                                className="btn btn-primary btn-sm rounded-pill d-inline-flex align-items-center gap-2 px-3 py-2"
                            >
                                <FaEdit size={14} />
                                <span>நூல் தகவல் திருத்த (Edit)</span>
                            </Link>

                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm rounded-pill d-inline-flex align-items-center gap-2 px-3 py-2"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <FaTrash size={12} />
                                <span>நீக்கு</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Product Card */}
                <div className="detail-card-modern rounded-4 overflow-hidden mb-5">
                    <div className="p-4 p-lg-5">
                        <div className="row g-4 g-lg-5 align-items-start">
                            
                            {/* Left Side: Images */}
                            <div className="col-12 col-lg-5">
                                <div className="book-image-section">
                                    <div className="main-book-image-box rounded-4 mb-3 d-flex justify-content-center align-items-center position-relative">
                                        {book.images && book.images.length > 0 ? (
                                            <img
                                                src={`${imageBaseUrl}${book.images[selectedImage].image}`}
                                                alt={book.name}
                                                className="img-fluid book-hero-image"
                                            />
                                        ) : (
                                            <div className="text-muted text-center py-5">
                                                <FaBookOpen size={48} className="mb-2 text-secondary" />
                                                <p className="mb-0">புகைப்படம் எதுவும் இல்லை</p>
                                            </div>
                                        )}

                                        {/* Favorite button on image */}
                                        <button
                                            type="button"
                                            onClick={handleToggleFavorite}
                                            className={`detail-fav-btn ${isFavorite ? "active" : ""}`}
                                            title={isLoggedIn ? "விருப்பத்தில் சேர்க்க" : "உள்நுழையவும்"}
                                        >
                                            <FaHeart size={18} color={isFavorite ? "#ff334b" : "rgba(255,255,255,0.7)"} />
                                        </button>
                                    </div>

                                    {/* Thumbnail gallery */}
                                    {book.images && book.images.length > 1 && (
                                        <div className="d-flex gap-2 flex-wrap">
                                            {book.images.map((img, index) => (
                                                <button
                                                    key={img.id}
                                                    type="button"
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`thumbnail-btn ${selectedImage === index ? "thumbnail-active" : ""}`}
                                                >
                                                    <img
                                                        src={`${imageBaseUrl}${img.image}`}
                                                        alt={`${book.name} thumbnail ${index + 1}`}
                                                        className="thumbnail-img"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Side: Details */}
                            <div className="col-12 col-lg-7">
                                {/* Type & Read status badges */}
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                                    <span className="badge-glowing-gold">
                                        {book.book_type}
                                    </span>
                                    <span
                                        className={`badge rounded-pill px-3 py-1 ${
                                            book.is_read ? "bg-success bg-opacity-25 text-success" : "bg-secondary bg-opacity-25 text-secondary"
                                        }`}
                                    >
                                        {book.is_read ? "✓ வாசிக்கப்பட்டது" : "வாசிக்கப்படவில்லை"}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="display-6 fw-bold text-white mb-2">
                                    {book.name}
                                </h1>

                                {/* Author */}
                                <p className="fs-5 text-secondary mb-4">
                                    <FaUser className="me-2 text-warning" />
                                    ஆசிரியர்: <span className="text-white fw-semibold">{book.author}</span>
                                </p>

                                {/* Price Box */}
                                <div className="price-box-modern p-3 rounded-3 mb-4 d-flex align-items-center justify-content-between">
                                    <div>
                                        <small className="text-secondary d-block">புத்தகத்தின் விலை</small>
                                        <div className="fs-2 fw-bold text-warning">
                                            ₹{book.price}
                                        </div>
                                    </div>
                                    <div className={`availability-badge d-flex align-items-center gap-2 px-3 py-2 rounded-pill ${availabilityClass}`}>
                                        {availabilityIcon}
                                        <span className="fw-semibold small">{availability}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <h5 className="fw-bold text-white mb-2">
                                        இந்த நூலைப் பற்றி (About this book)
                                    </h5>
                                    <p className="text-secondary book-detail-desc" style={{ lineHeight: "1.8" }}>
                                        {book.description || "விளக்கம் எதுவும் குறிப்பிடப்படவில்லை."}
                                    </p>
                                </div>

                                {/* Borrow info if borrowed */}
                                {book.borrowed && (
                                    <div className="alert alert-warning border-0 rounded-3 mb-4 p-3 d-flex align-items-center gap-3">
                                        <FaClock className="text-warning flex-shrink-0" size={24} />
                                        <div>
                                            <strong className="d-block text-dark">கடனாகப் பெறப்பட்ட விபரம்:</strong>
                                            <span className="text-dark small">
                                                வாங்கியவர்: {book.borrowed_by || "குறிப்பிடப்படவில்லை"} | தேதி: {book.borrowed_on || "குறிப்பிடப்படவில்லை"}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Specifications Table */}
                                <h5 className="fw-bold text-white mb-3">நூல் விபரங்கள் (Specifications)</h5>
                                <div className="table-responsive">
                                    <table className="table table-dark table-striped table-bordered align-middle">
                                        <tbody>
                                            <tr>
                                                <th style={{ width: "40%" }}>
                                                    <FaUser className="me-2 text-warning" />
                                                    ஆசிரியர் (Author)
                                                </th>
                                                <td>{book.author}</td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <FaBuilding className="me-2 text-warning" />
                                                    பதிப்பாளர் (Publisher)
                                                </th>
                                                <td>{book.publisher || "—"}</td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <FaTag className="me-2 text-warning" />
                                                    பதிப்பு (Edition)
                                                </th>
                                                <td>{book.edition ? `${book.edition} ஆம் பதிப்பு` : "—"}</td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <FaCalendarAlt className="me-2 text-warning" />
                                                    பதிப்பித்த ஆண்டு (Published Year)
                                                </th>
                                                <td>{book.published_year || "—"}</td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <FaBookOpen className="me-2 text-warning" />
                                                    நூல் வகை (Category)
                                                </th>
                                                <td>{book.book_type}</td>
                                            </tr>
                                            <tr>
                                                <th>
                                                    <FaCalendarAlt className="me-2 text-warning" />
                                                    வாங்கிய தேதி (Bought On)
                                                </th>
                                                <td>{book.buyed_on || "—"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Notes Download Section */}
                                {book.book_notes && (
                                    <div className="mt-4 p-3 rounded-3 notes-box d-flex align-items-center justify-content-between flex-wrap gap-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <FaBookOpen className="text-warning" size={18} />
                                            <span className="text-white fw-semibold">நூல் குறிப்புகள் (Notes) கிடைக்கின்றன</span>
                                        </div>
                                        <a
                                            href={`${imageBaseUrl}${book.book_notes}`}
                                            download
                                            className="btn btn-warning btn-sm d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill"
                                        >
                                            <FaDownload size={13} />
                                            <span>பதிவிறக்கவும் (Download)</span>
                                        </a>
                                    </div>
                                )}

                                {/* Bottom Authorized Edit Link */}
                                {isLoggedIn && (
                                    <div className="d-flex justify-content-end mt-4 pt-3 border-top border-secondary border-opacity-25">
                                        <Link
                                            to={`/books/${book.id}/edit`}
                                            className="btn btn-warning px-4 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2 shadow"
                                        >
                                            <FaEdit size={16} />
                                            <span>நூல் தகவல் திருத்த (Edit Details)</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="filter-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="filter-modal-card p-4" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
                        <div className="text-center mb-3">
                            <FaExclamationTriangle className="text-danger mb-3" size={42} />
                            <h5 className="fw-bold text-white">புத்தகத்தை நீக்கவா?</h5>
                            <p className="text-secondary small">
                                "<strong>{book.name}</strong>" புத்தகத்தை நிரந்தரமாக நீக்க விரும்புகிறீர்களா? இந்த செயலை மீண்டும் மாற்ற முடியாது.
                            </p>
                        </div>
                        <div className="d-flex gap-2 justify-content-end">
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-3"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                            >
                                ரத்து செய் (Cancel)
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger px-4"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "நீக்குகிறது..." : "ஆம், நீக்கு (Delete)"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BookDetail;