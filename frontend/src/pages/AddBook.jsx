import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { bookAdd } from "../services/bookServices";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { FaArrowLeft, FaPlus, FaBook, FaLock, FaExclamationCircle } from "react-icons/fa";

export default function AddBook() {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const { showToast } = useToast();

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

    const [images, setImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    if (!isLoggedIn) {
        return (
            <div className="container py-5">
                <div className="card-glass-modern p-4 p-md-5 text-center max-w-md mx-auto rounded-4">
                    <FaLock className="text-warning mb-3" size={48} />
                    <h3 className="fw-bold text-white mb-2">அனுமதி மறுக்கப்பட்டது</h3>
                    <p className="text-secondary mb-4">
                        புதிய புத்தகம் சேர்க்க நீங்கள் உள்நுழைய வேண்டும்.
                    </p>
                    <Link to="/login" className="btn btn-warning fw-bold px-4 py-2 rounded-pill">
                        உள்நுழையவும் (Login)
                    </Link>
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
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setErrorMsg("");

        try {
            const data = new FormData();
            data.append("name", formData.name.trim());
            data.append("author", formData.author.trim());
            data.append("book_type", formData.book_type);
            data.append("price", formData.price ? parseFloat(formData.price) : 0);
            data.append("available", formData.available);
            data.append("borrowed", formData.borrowed);
            data.append("is_read", formData.is_read);
            data.append("favorite", formData.favorite);

            if (formData.publisher.trim()) data.append("publisher", formData.publisher.trim());
            if (formData.edition) data.append("edition", parseInt(formData.edition, 10));
            if (formData.published_year) data.append("published_year", parseInt(formData.published_year, 10));
            if (formData.description.trim()) data.append("description", formData.description.trim());
            if (formData.buyed_on) data.append("buyed_on", formData.buyed_on);

            if (formData.borrowed) {
                if (formData.borrowed_by.trim()) data.append("borrowed_by", formData.borrowed_by.trim());
                if (formData.borrowed_on) data.append("borrowed_on", formData.borrowed_on);
            }

            images.forEach((img) => {
                data.append("images", img);
            });

            await bookAdd(data);
            showToast("புதிய புத்தகம் வெற்றிகரமாக சேர்க்கப்பட்டது!", "success");
            navigate("/books");
        } catch (err) {
            console.error("Add book failed:", err);
            const errData = err.response?.data;
            let msg = errData?.message || "புத்தகம் சேர்க்க முடியவில்லை.";
            if (errData?.errors) {
                const details = Object.entries(errData.errors)
                    .map(([f, m]) => `${f}: ${Array.isArray(m) ? m.join(", ") : m}`)
                    .join(" | ");
                msg += ` (${details})`;
            }
            setErrorMsg(msg);
            showToast(msg, "error");
        } finally {
            setSubmitting(false);
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
        <div className="add-book-page py-4 py-md-5">
            <div className="container px-3 px-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <Link
                        to="/books"
                        className="btn btn-outline-secondary btn-sm rounded-pill d-inline-flex align-items-center gap-2 px-3 py-2 text-decoration-none"
                    >
                        <FaArrowLeft size={12} />
                        <span>நூல் பட்டியல்</span>
                    </Link>
                    <span className="badge-glowing-gold">புதிய நூல் பதிவு</span>
                </div>

                <div className="card-glass-modern p-4 p-lg-5 rounded-4 shadow-lg">
                    <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-25">
                        <div className="icon-header-box">
                            <FaPlus size={20} className="text-warning" />
                        </div>
                        <div>
                            <h2 className="h4 fw-bold text-white mb-1">
                                புதிய புத்தகத்தை சேர்க்கவும்
                            </h2>
                            <p className="text-secondary small mb-0">
                                புத்தகத்தின் விபரங்களை பூர்த்தி செய்து சேமிக்கவும்.
                            </p>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="alert alert-danger rounded-3 d-flex align-items-center gap-2 mb-4">
                            <FaExclamationCircle className="flex-shrink-0" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Section 1 */}
                        <div className="form-section-modern mb-4 p-3 p-md-4 rounded-3">
                            <h5 className="section-title text-warning mb-3">1. அடிப்படை விபரங்கள்</h5>
                            <div className="row g-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label-modern" htmlFor="name">
                                        நூலின் பெயர் <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control-modern"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="நூலின் பெயர்"
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label-modern" htmlFor="author">
                                        ஆசிரியர் பெயர் <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="author"
                                        name="author"
                                        className="form-control-modern"
                                        value={formData.author}
                                        onChange={handleChange}
                                        required
                                        placeholder="ஆசிரியர் பெயர்"
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label-modern" htmlFor="publisher">
                                        பதிப்பகம்
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
                                <div className="col-12 col-md-6">
                                    <label className="form-label-modern" htmlFor="book_type">
                                        நூல் வகை
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

                        {/* Section 2 */}
                        <div className="form-section-modern mb-4 p-3 p-md-4 rounded-3">
                            <h5 className="section-title text-warning mb-3">2. பதிப்பு & விலை</h5>
                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <label className="form-label-modern" htmlFor="edition">
                                        பதிப்பு எண்
                                    </label>
                                    <input
                                        type="number"
                                        id="edition"
                                        name="edition"
                                        className="form-control-modern"
                                        value={formData.edition}
                                        onChange={handleChange}
                                        placeholder="1"
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label-modern" htmlFor="published_year">
                                        பதிப்பித்த ஆண்டு
                                    </label>
                                    <input
                                        type="number"
                                        id="published_year"
                                        name="published_year"
                                        className="form-control-modern"
                                        value={formData.published_year}
                                        onChange={handleChange}
                                        placeholder="2025"
                                    />
                                </div>
                                <div className="col-12 col-md-4">
                                    <label className="form-label-modern" htmlFor="price">
                                        விலை (₹) <span className="text-danger">*</span>
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
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label-modern" htmlFor="buyed_on">
                                        வாங்கிய தேதி
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

                        {/* Section 3 */}
                        <div className="form-section-modern mb-4 p-3 p-md-4 rounded-3">
                            <h5 className="section-title text-warning mb-3">3. இருப்பு மற்றும் விருப்பம்</h5>
                            <div className="row g-3">
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
                                <div className="col-12">
                                    <label className="form-label-modern" htmlFor="description">
                                        நூலைப் பற்றிய விபரம்
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="form-control-modern"
                                        rows={3}
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="விபரம் அல்லது சிறப்புக் குறிப்பு..."
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label-modern" htmlFor="images">
                                        நூலின் புகைப்படங்கள் (Photos)
                                    </label>
                                    <input
                                        type="file"
                                        id="images"
                                        className="form-control-modern"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="d-flex justify-content-end gap-3 pt-3 border-top border-secondary border-opacity-25">
                            <Link to="/books" className="btn btn-outline-secondary px-4 py-2 rounded-pill">
                                ரத்து செய்
                            </Link>
                            <button
                                type="submit"
                                className="btn btn-warning px-5 py-2 rounded-pill fw-bold shadow"
                                disabled={submitting}
                            >
                                {submitting ? "சேர்க்கப்படுகிறது..." : "புத்தகம் சேர்க்கவும்"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
