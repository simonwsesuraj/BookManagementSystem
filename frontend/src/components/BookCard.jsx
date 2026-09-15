import React, { useState } from "react";
import BookCarousel from "./BookCarousel";
import { FaHeart, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { bookUpdate } from "../services/bookServices";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function BookCard({ book }) {
    const { isLoggedIn } = useAuth();
    const { showToast } = useToast();
    const [isFavorite, setIsFavorite] = useState(book.favorite || false);
    const [isUpdatingFav, setIsUpdatingFav] = useState(false);

    let status = "";
    let statusClass = "";
    let statusTextClass = "";

    if (book.available && !book.borrowed) {
        status = "உள்ளது (Available)";
        statusClass = "bg-success pulse-green";
        statusTextClass = "text-success";
    } else if (book.borrowed) {
        status = "கடனாகப் பெற்றது (Borrowed)";
        statusClass = "bg-warning pulse-yellow";
        statusTextClass = "text-warning";
    } else {
        status = "இல்லை (Out of stock)";
        statusClass = "bg-danger";
        statusTextClass = "text-danger";
    }

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            showToast("விருப்பமானவைகளில் சேர்க்க நீங்கள் உள்நுழைய வேண்டும்.", "warning");
            return;
        }

        if (isUpdatingFav) return;
        setIsUpdatingFav(true);

        const newFavoriteStatus = !isFavorite;
        try {
            await bookUpdate(book.id, {
                favorite: newFavoriteStatus
            });
            setIsFavorite(newFavoriteStatus);
            showToast(
                newFavoriteStatus
                    ? "விருப்பமானவைகளில் சேர்க்கப்பட்டது!"
                    : "விருப்பமானவைகளிலிருந்து நீக்கப்பட்டது!",
                "success"
            );
        } catch (error) {
            console.error("Failed to update favorite:", error);
            showToast("பிடித்த மாற்றத்தில் பிழை ஏற்பட்டது.", "error");
        } finally {
            setIsUpdatingFav(false);
        }
    };

    return (
        <div className="col-12 col-sm-6 col-md-4 col-xl-3 mb-4">
            <div className="card h-100 border-0 book-card-modern position-relative overflow-hidden">
                {/* Availability Pulse Indicator */}
                <div
                    className="position-absolute top-0 start-0 m-3 d-flex align-items-center gap-2 px-2 py-1 rounded-pill status-pill-overlay"
                    title={status}
                    style={{ zIndex: 10 }}
                >
                    <span className={`status-indicator-dot ${statusClass}`} />
                    <span className="status-indicator-text">{status.split(" ")[0]}</span>
                </div>

                {/* Favorite Button */}
                <button
                    type="button"
                    onClick={handleFavorite}
                    className={`position-absolute top-0 end-0 m-3 modern-favorite-btn ${
                        isFavorite ? "favorite-active" : ""
                    }`}
                    style={{ zIndex: 10 }}
                    aria-label={isFavorite ? "Remove favorite" : "Add to favorites"}
                    title={isLoggedIn ? (isFavorite ? "பிடித்தமானது" : "விருப்பத்தில் சேர்க்க") : "உள்நுழையவும்"}
                >
                    <FaHeart
                        size={17}
                        color={isFavorite ? "#ff334b" : "rgba(255,255,255,0.7)"}
                    />
                </button>

                {/* Book Image Carousel */}
                <div className="book-card-carousel-wrapper">
                    <BookCarousel book={book} />
                </div>

                {/* Book Details */}
                <div className="card-body d-flex flex-column p-3 p-md-4">
                    {/* Category pill */}
                    <div className="mb-2">
                        <span className="badge-category-subtle">
                            {book.book_type}
                        </span>
                    </div>

                    {/* Book name */}
                    <h5
                        className="fw-bold text-white mb-1 text-truncate"
                        title={book.name}
                    >
                        {book.name}
                    </h5>

                    {/* Author */}
                    <p
                        className="text-secondary small mb-2 text-truncate"
                        title={book.author}
                    >
                        ஆசிரியர்: <span className="text-light-emphasis">{book.author}</span>
                    </p>

                    {/* Description */}
                    <p
                        className="text-muted small book-description mb-3"
                        title={book.description}
                    >
                        {book.description || "விளக்கம் எதுவும் சேர்க்கப்படவில்லை."}
                    </p>

                    {/* Bottom section */}
                    <div className="mt-auto pt-2 border-top border-secondary border-opacity-25">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fw-bold fs-5 text-warning">
                                ₹{book.price}
                            </span>
                            <span
                                className={`badge rounded-pill px-2 py-1 small ${
                                    book.is_read
                                        ? "bg-success bg-opacity-25 text-success border border-success border-opacity-25"
                                        : "bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-25"
                                }`}
                            >
                                {book.is_read ? "✓ படித்தது" : "படிக்கவில்லை"}
                            </span>
                        </div>

                        {/* Details button */}
                        <Link
                            to={`/books/${book.id}`}
                            className="btn btn-details-modern w-100 rounded-pill d-flex justify-content-center align-items-center gap-2"
                        >
                            <span>விவரங்களை பார்க்க</span>
                            <FaArrowRight size={12} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookCard;