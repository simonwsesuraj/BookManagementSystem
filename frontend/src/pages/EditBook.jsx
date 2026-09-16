import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import useBookDetails from "../hooks/useBookDetails";
import {
    bookUpdate,
    addBookImages,
    deleteBookImage,
    addBookNotes,
    deleteBookNotes
} from "../services/bookServices";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Spinner from "../components/spiner";
import { BASE_URL } from "../api/api";
import {
    FaArrowLeft,
    FaSave,
    FaTrash,
    FaUpload,
    FaBook,
    FaInfoCircle,
    FaExclamationCircle,
    FaCheckCircle,
    FaLock
} from "react-icons/fa";

function EditBook() {
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { showToast } = useToast();

    const { book, loading, error } = useBookDetails(bookId);

    const [formData, setFormData] = useState({
        name: "",
        author: "",
        publisher: "",
        edition: "",
        published_year: "",
        book_type: "HISTORY",
        price: "",
        available: true,
        borrowed: false,
        borrowed_by: "",
        borrowed_on: "",
        description: "",
        is_read: false,
        favorite: false,
        buyed_on: ""
    });

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [newImages, setNewImages] = useState([]);
    const [deletingImageId, setDeletingImageId] = useState(null);
    const [bookNotes, setBookNotes] = useState(null);
    const [removeExistingNotes, setRemoveExistingNotes] = useState(false);

    // Load book data into state
    useEffect(() => {
        if (book) {
            setFormData({
                name: book.name || "",
                author: book.author || "",
                publisher: book.publisher || "",
                edition: book.edition !== null && book.edition !== undefined ? String(book.edition) : "",
                published_year: book.published_year !== null && book.published_year !== undefined ? String(book.published_year) : "",
                book_type: book.book_type || "HISTORY",
                price: book.price !== null && book.price !== undefined ? String(book.price) : "",
                available: book.available ?? true,
                borrowed: book.borrowed ?? false,
                borrowed_by: book.borrowed_by || "",
                borrowed_on: book.borrowed_on || "",
                description: book.description || "",
                is_read: book.is_read ?? false,
                favorite: book.favorite ?? false,
                buyed_on: book.buyed_on || ""
            });
        }
    }, [book]);

    // Access check: only logged in user can edit
    if (!isLoggedIn) {
        return (
            <div className="container py-5">
                <div className="card-glass-modern p-4 p-md-5 text-center max-w-md mx-auto rounded-4">
                    <FaLock className="text-warning mb-3" size={48} />
                    <h3 className="fw-bold text-white mb-2">அனுமதி மறுக்கப்பட்டது</h3>
                    <p className="text-secondary mb-4">
                        நூல் தகவல்களை திருத்த நீங்கள் உள்நுழைய வேண்டும். அனுமதியற்ற பயனர்கள் பார்வையிட மட்டுமே இயலும்.
                    </p>
                    <Link to="/login" className="btn btn-warning fw-bold px-4 py-2 rounded-pill">
                        உள்நுழையவும் (Login)
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);
    };

    const handleCameraChange = (e) => {
        const file = e.target.files?.[0];

        if (file) {
            setNewImages(prev => [...prev, file]);
        }

        e.target.value = "";
    };

    const handleDeleteImage = async (imageId) => {
        if (!window.confirm("இந்த படத்தை நீக்க விரும்புகிறீர்களா?")) return;

        setDeletingImageId(imageId);
        try {
            await deleteBookImage(imageId);
            showToast("படம் நீக்கப்பட்டது", "info");
            // Remove image locally from book
            if (book && book.images) {
                book.images = book.images.filter(img => img.id !== imageId);
            }
        } catch (err) {
            console.error("Failed to delete image:", err);
            showToast("படத்தை நீக்க முடியவில்லை.", "error");
        } finally {
            setDeletingImageId(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveError("");

        try {
            // Clean and sanitize payload to prevent DRF 400 validation errors
            const payload = {
                name: formData.name.trim(),
                author: formData.author.trim(),
                book_type: formData.book_type,
                price: formData.price ? parseFloat(formData.price) : 0.0,
                available: Boolean(formData.available),
                borrowed: Boolean(formData.borrowed),
                is_read: Boolean(formData.is_read),
                favorite: Boolean(formData.favorite),
                publisher: formData.publisher.trim() || null,
                edition: formData.edition !== "" && !isNaN(Number(formData.edition)) ? parseInt(formData.edition, 10) : null,
                published_year: formData.published_year !== "" && !isNaN(Number(formData.published_year)) ? parseInt(formData.published_year, 10) : null,
                borrowed_by: formData.borrowed ? (formData.borrowed_by.trim() || null) : null,
                borrowed_on: formData.borrowed && formData.borrowed_on ? formData.borrowed_on : null,
                buyed_on: formData.buyed_on ? formData.buyed_on : null,
                description: formData.description.trim() || null
            };

            await bookUpdate(bookId, payload);

            // Upload new images if selected
            if (newImages.length > 0) {
                await addBookImages(bookId, newImages);
            }

            // Upload or delete notes
            if (bookNotes) {
                await addBookNotes(bookId, bookNotes);
            } else if (removeExistingNotes && book.book_notes) {
                await deleteBookNotes(bookId);
            }

            showToast("நூல் தகவல்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!", "success");
            navigate(`/books/${bookId}`);
        } catch (err) {
            console.error("Save error:", err);
            const errData = err.response?.data;
            let errMsg = errData?.message || "நூல் தகவலை சேமிக்க முடியவில்லை.";
            if (errData?.errors) {
                const fieldErrors = Object.entries(errData.errors)
                    .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
                    .join(" | ");
                errMsg += ` (${fieldErrors})`;
            }
            setSaveError(errMsg);
            showToast(errMsg, "error");
        } finally {
            setSaving(false);
        }
    };

    const categories = [
        { key: "HISTORY", label: "வரலாறு (History)" },
        { key: "POLITICS", label: "அரசியல் (Politics)" },
        { key: "FARMING", label: "விவசாயம் (Farming)" },
        { key: "ECONOMIC", label: "பொருளாதாரம் (Economic)" },
        { key: "SCIENCE", label: "அறிவியல் (Science)" },
        { key: "LITRATURE", label: "இலக்கியம் (Literature)" },
        { key: "GENERAL", label: "பொது (General)" },
        { key: "OTHER", label: "பிற (Other)" }
    ];

    return (
        <div className="edit-book-page py-4 py-md-5">
            <div className="container px-3 px-md-5">
                
                {/* Header Navigation */}
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <Link
                        to={`/books/${bookId}`}
                        className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                    >
                        <FaArrowLeft size={12} />
                        <span>புத்தக விவரங்களுக்கு திரும்பு</span>
                    </Link>

                    <div className="badge-glowing-gold">
                        நூல் திருத்தம் (Editor Mode)
                    </div>
                </div>

                {/* Form Card */}
                <div className="card-glass-modern p-4 p-lg-5 rounded-4 shadow-lg">
                    <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                        <div className="icon-header-box">
                            <FaBook size={22} className="text-warning" />
                        </div>
                        <div>
                            <h2 className="h4 fw-bold text-white mb-1">
                                நூல் தகவல்களை திருத்துதல்
                            </h2>
                            <p className="text-secondary small mb-0">
                                மாற்றங்களை செய்து "சேமி" பொத்தானை அழுத்தவும்.
                            </p>
                        </div>
                    </div>

                    {saveError && (
                        <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2 mb-4">
                            <FaExclamationCircle className="flex-shrink-0" />
                            <span>{saveError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Basic Information */}
                        <div className="form-section-modern mb-4 p-3 p-md-4 rounded-3">
                            <h5 className="section-title text-warning mb-3">1. அடிப்படை விபரங்கள் (Basic Info)</h5>
                            
                            <div className="row g-3">
                                {/* Title */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label-modern" htmlFor="name">
                                        நூலின் பெயர் (Book Title) <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control-modern"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="நூலின் பெயரை உள்ளிடவும்"
                                    />
                                </div>

                                {/* Author */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label-modern" htmlFor="author">
                                        ஆசிரியர் பெயர் (Author) <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        className="form-control-modern"
                                        value={formData.author}
                                        onChange={handleChange}
                                        required
                                        placeholder="ஆசிரியர் பெயரை உள்ளிடவும்"
                                    />
                                </div>

                                {/* Publisher */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label-modern" htmlFor="publisher">
                                        பதிப்பகம் (Publisher)
                                    </label>
                                    <input
                                        type="text"
                                        id="publisher"
                                        name="publisher"
                                        className="form-control-modern"
                                        value={formData.publisher}
                                        onChange={handleChange}
                                        placeholder="பதிப்பகத்தின் பெயர்"
                                    />
                                </div>

                                {/* Book Type / Category */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label-modern" htmlFor="book_type">
                                        நூல் வகை (Category)
                                    </label>
                                    <select
                                        id="book_type"
                                        name="book_type"
                                        className="form-select-modern"
                                        value={formData.book_type}
                                        onChange={handleChange}
                                    >
                                        {categories.map((c) => (
                                            <option key={c.key} value={c.key}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Edition, Year & Price */}
                        <div className="form-section-modern mb-4 p-3 p-md-4 rounded-3">
                            <h5 className="section-title text-warning mb-3">2. பதிப்பு மற்றும் விலை விபரம்</h5>
                            
                            <div className="row g-3">
                                {/* Edition */}
                                <div className="col-12 col-md-4">
                                    <label className="form-label-modern" htmlFor="edition">
                                        பதிப்பு எண் (Edition)
                                    </label>
                                    <input
                                        type="number"
                                        id="edition"
                                        name="edition"
                                        className="form-control-modern"
                                        value={formData.edition}
                                        onChange={handleChange}
                                        placeholder="எ.கா. 1, 2"
                                        min="1"
                                    />
                                </div>

                                {/* Published Year */}
                                <div className="col-12 col-md-4">
                                    <label className="form-label-modern" htmlFor="published_year">
                                        பதிப்பித்த ஆண்டு (Year)
                                    </label>
                                    <input
                                        type="number"
                                        id="published_year"
                                        name="published_year"
                                        className="form-control-modern"
                                        value={formData.published_year}
                                        onChange={handleChange}
                                        placeholder="எ.கா. 2024"
                                    />
                                </div>

                                {/* Price */}
                                <div className="col-12 col-md-4">
                                    <label className="form-label-modern" htmlFor="price">
                                        விலை (Price ₹) <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        className="form-control-modern"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                    />
                                </div>

                                {/* Bought on */}
                                <div className="col-12 col-md-6">
                                    <label className="form-label-modern" htmlFor="buyed_on">
                                        வாங்கிய தேதி (Purchased Date)
                                    </label>
                                    <input
                                        type="date"
                                        id="buyed_on"
                                        name="buyed_on"
                                        className="form-control-modern"
                                        value={formData.buyed_on}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Availability & Borrow Status */}
                        <div className="form-section-modern mb-4 p-3 p-md-4 rounded-3">
                            <h5 className="section-title text-warning mb-3">3. இருப்பு மற்றும் கடன் விபரம்</h5>
                            
                            <div className="row g-3">
                                {/* Available Toggle */}
                                <div className="col-12 col-md-6">
                                    <div className="form-check form-switch modern-switch p-3 rounded-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="available"
                                            name="available"
                                            checked={formData.available}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label ms-2 text-white fw-semibold" htmlFor="available">
                                            நூல் கையிருப்பில் உள்ளது (Available)
                                        </label>
                                    </div>
                                </div>

                                {/* Borrowed Toggle */}
                                <div className="col-12 col-md-6">
                                    <div className="form-check form-switch modern-switch p-3 rounded-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="borrowed"
                                            name="borrowed"
                                            checked={formData.borrowed}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label ms-2 text-white fw-semibold" htmlFor="borrowed">
                                            கடனாக வழங்கப்பட்டுள்ளது (Borrowed)
                                        </label>
                                    </div>
                                </div>

                                {/* If Borrowed: Name & Date */}
                                {formData.borrowed && (
                                    <>
                                        <div className="col-12 col-md-6">
                                            <label className="form-label-modern" htmlFor="borrowed_by">
                                                வாங்கியவர் பெயர் (Borrower Name)
                                            </label>
                                            <input
                                                type="text"
                                                id="borrowed_by"
                                                name="borrowed_by"
                                                className="form-control-modern"
                                                value={formData.borrowed_by}
                                                onChange={handleChange}
                                                placeholder="பெயரை உள்ளிடவும்"
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label-modern" htmlFor="borrowed_on">
                                                வாங்கிய தேதி (Borrowed Date)
                                            </label>
                                            <input
                                                type="date"
                                                id="borrowed_on"
                                                name="borrowed_on"
                                                className="form-control-modern"
                                                value={formData.borrowed_on}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Section 4: Read status & Favorites */}
                        <div className="form-section-modern mb-4 p-3 p-md-4 rounded-3">
                            <h5 className="section-title text-warning mb-3">4. வாசிப்பு நிலை & விருப்பம்</h5>
                            
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <div className="form-check form-switch modern-switch p-3 rounded-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="is_read"
                                            name="is_read"
                                            checked={formData.is_read}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label ms-2 text-white fw-semibold" htmlFor="is_read">
                                            இந்த நூலை வாசித்துவிட்டேன் (Mark as Read)
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <div className="form-check form-switch modern-switch p-3 rounded-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            role="switch"
                                            id="favorite"
                                            name="favorite"
                                            checked={formData.favorite}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label ms-2 text-white fw-semibold" htmlFor="favorite">
                                            பிடித்தமான நூல்களில் சேர்க்க (Favorite)
                                        </label>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-12">
                                    <label className="form-label-modern" htmlFor="description">
                                        நூலைப் பற்றிய விபரம் (Description)
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="form-control-modern"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="நூலின் சுருக்கக் குறிப்பு அல்லது விபரம்..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Photos & Notes Management */}
                        <div className="form-section-modern mb-4 p-3 p-md-4 rounded-3">
                            <h5 className="section-title text-warning mb-3">5. புகைப்படங்கள் & குறிப்புகள்</h5>

                            {/* Existing Images */}
                            {book?.images && book.images.length > 0 && (
                                <div className="mb-4">
                                    <label className="form-label-modern mb-2">தற்போதுள்ள புகைப்படங்கள்:</label>
                                    <div className="d-flex gap-3 flex-wrap">
                                        {book.images.map((img) => (
                                            <div key={img.id} className="position-relative existing-img-box rounded-3 overflow-hidden">
                                                <img
                                                    src={`${BASE_URL}${img.image}`}
                                                    alt="Book"
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-1"
                                                    onClick={() => handleDeleteImage(img.id)}
                                                    disabled={deletingImageId === img.id}
                                                    title="படத்தை நீக்கு"
                                                >
                                                    <FaTrash size={11} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add New Images */}
                            <div className="mb-4">
                                <label className="form-label-modern mb-3">
                                    புதிய புகைப்படங்கள் சேர்க்க
                                </label>

                                <div className="d-flex gap-3 flex-wrap">

                                    {/* Upload Photo */}
                                    <label
                                        htmlFor="gallery-images"
                                        className="photo-action-btn"
                                    >
                                        <FaUpload size={18} />
                                        <span>புகைப்படம் தேர்வு செய்</span>
                                        <small>Gallery / Files</small>
                                    </label>

                                    <input
                                        type="file"
                                        id="gallery-images"
                                        className="d-none"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />

                                    {/* Take Picture */}
                                    <label
                                        htmlFor="camera-image"
                                        className="photo-action-btn"
                                    >
                                        <span style={{ fontSize: "20px" }}>📷</span>
                                        <span>புகைப்படம் எடு</span>
                                        <small>Camera</small>
                                    </label>

                                    <input
                                        type="file"
                                        id="camera-image"
                                        className="d-none"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleCameraChange}
                                    />

                                </div>

                                {newImages.length > 0 && (
                                    <small className="text-warning mt-3 d-block">
                                        {newImages.length} புதிய படங்கள் தேர்ந்தெடுக்கப்பட்டுள்ளன.
                                    </small>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="form-label-modern mb-2" htmlFor="notes">
                                    நூல் குறிப்புகள் கோப்பு (Upload Notes Document / PDF)
                                </label>
                                <input
                                    type="file"
                                    id="notes"
                                    className="form-control-modern"
                                    onChange={(e) => {
                                        setBookNotes(e.target.files[0] || null);
                                        setRemoveExistingNotes(false);
                                    }}
                                />
                                {book?.book_notes && !removeExistingNotes && (
                                    <div className="mt-2 d-flex align-items-center gap-2">
                                        <small className="text-success">ஏற்கனவே குறிப்பு கோப்பு உள்ளது.</small>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger py-0 px-2"
                                            onClick={() => setRemoveExistingNotes(true)}
                                        >
                                            நீக்கு
                                        </button>
                                    </div>
                                )}
                                {removeExistingNotes && (
                                    <small className="text-danger mt-1 d-block">
                                        சேமிக்கும் போது முந்தைய குறிப்பு நீக்கப்படும்.
                                    </small>
                                )}
                            </div>
                        </div>

                        {/* Submit Action Buttons */}
                        <div className="d-flex align-items-center justify-content-end gap-3 pt-3 border-top border-secondary border-opacity-25">
                            <Link
                                to={`/books/${bookId}`}
                                className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                            >
                                ரத்து செய் (Cancel)
                            </Link>
                            <button
                                type="submit"
                                className="btn btn-warning px-5 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-2 shadow"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                        <span>சேமிக்கப்படுகிறது...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave size={16} />
                                        <span>மாற்றங்களை சேமிக்கவும்</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditBook;