import React from "react";
import { BASE_URL } from "../api/api";

function BookCarousel({ book }) {

    return (
        <div
            id={`bookCarousel-${book.id}`}
            className="carousel slide book-image-container"
        >

            <div className="carousel-inner">

                {book.images && book.images.length > 0 ? (

                    book.images.map((image, index) => (

                        <div
                            className={`carousel-item ${
                                index === 0 ? "active" : ""
                            }`}
                            key={image.id}
                        >

                            <div className="book-image-wrapper">

                                <img
                                    src={`${BASE_URL}${image.image}`}
                                    className="book-image"
                                    alt={book.name}
                                />

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="book-image-wrapper">

                        <div className="text-muted">
                            படம் இல்லை
                        </div>

                    </div>

                )}

            </div>


            {book.images && book.images.length > 1 && (

                <>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#bookCarousel-${book.id}`}
                        data-bs-slide="prev"
                    >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                        />
                    </button>

                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#bookCarousel-${book.id}`}
                        data-bs-slide="next"
                    >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                        />
                    </button>
                </>

            )}

        </div>
    );
}

export default BookCarousel;