import React from "react";
import { FaTimes, FaFilter, FaCheck, FaUndo } from "react-icons/fa";

export default function FilterModal({
    isOpen,
    onClose,
    filters,
    onFilterChange,
    onResetFilters,
    onApply
}) {
    if (!isOpen) return null;

    const bookTypes = [
        { key: "ALL", label: "அனைத்தும்" },
        { key: "HISTORY", label: "வரலாறு" },
        { key: "POLITICS", label: "அரசியல்" },
        { key: "FARMING", label: "விவசாயம்" },
        { key: "ECONOMIC", label: "பொருளாதாரம்" },
        { key: "SCIENCE", label: "அறிவியல்" },
        { key: "LITRATURE", label: "இலக்கியம்" },
        { key: "GENERAL", label: "பொது" },
        { key: "OTHER", label: "பிற" }
    ];

    const statuses = [
        { key: "ALL", label: "அனைத்தும்" },
        { key: "available", label: "உள்ளது" },
        { key: "borrowed", label: "கடனாகப் பெற்றது" },
        { key: "unavailable", label: "இல்லை" }
    ];

    const readStatuses = [
        { key: "ALL", label: "அனைத்தும்" },
        { key: "read", label: "படித்தது" },
        { key: "unread", label: "படிக்கவில்லை" }
    ];

    const sortOptions = [
        { key: "latest", label: "சமீபத்தியவை (Newest)" },
        { key: "oldest", label: "பழையவை (Oldest)" },
        { key: "name", label: "பெயர்: அ - ஔ (A - Z)" },
        { key: "-name", label: "பெயர்: Z - A" },
        { key: "price", label: "விலை: குறைந்தது முதல் (Low to High)" },
        { key: "-price", label: "விலை: அதிகம் முதல் (High to Low)" }
    ];

    return (
        <div className="filter-modal-overlay" onClick={onClose}>
            <div
                className="filter-modal-card"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="filter-modal-header d-flex align-items-center justify-content-between p-3 px-4 border-bottom border-secondary border-opacity-25">
                    <div className="d-flex align-items-center gap-2">
                        <div className="filter-icon-badge">
                            <FaFilter size={15} />
                        </div>
                        <h5 className="mb-0 fw-bold text-white">வடிகட்டி (Filter Books)</h5>
                    </div>
                    <button
                        type="button"
                        className="btn-close-filter"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="filter-modal-body p-4">
                    {/* Category / நூல் வகை */}
                    <div className="mb-4">
                        <label className="filter-section-title d-block mb-2">
                            நூல் வகை (Category)
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                            {bookTypes.map((type) => {
                                const active = (filters.book_type || "ALL") === type.key;
                                return (
                                    <button
                                        key={type.key}
                                        type="button"
                                        className={`filter-chip ${active ? "filter-chip-active" : ""}`}
                                        onClick={() => onFilterChange("book_type", type.key)}
                                    >
                                        {active && <FaCheck size={11} className="me-1" />}
                                        {type.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Availability / இருப்பு நிலை */}
                    <div className="mb-4">
                        <label className="filter-section-title d-block mb-2">
                            இருப்பு நிலை (Availability)
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                            {statuses.map((st) => {
                                const active = (filters.status || "ALL") === st.key;
                                return (
                                    <button
                                        key={st.key}
                                        type="button"
                                        className={`filter-chip ${active ? "filter-chip-active" : ""}`}
                                        onClick={() => onFilterChange("status", st.key)}
                                    >
                                        {active && <FaCheck size={11} className="me-1" />}
                                        {st.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reading status / வாசிப்பு நிலை */}
                    <div className="mb-4">
                        <label className="filter-section-title d-block mb-2">
                            வாசிப்பு நிலை (Reading Status)
                        </label>
                        <div className="d-flex flex-wrap gap-2">
                            {readStatuses.map((rs) => {
                                const active = (filters.is_read || "ALL") === rs.key;
                                return (
                                    <button
                                        key={rs.key}
                                        type="button"
                                        className={`filter-chip ${active ? "filter-chip-active" : ""}`}
                                        onClick={() => onFilterChange("is_read", rs.key)}
                                    >
                                        {active && <FaCheck size={11} className="me-1" />}
                                        {rs.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Favorites Toggle */}
                    <div className="mb-4 p-3 rounded-3 filter-toggle-box d-flex align-items-center justify-content-between">
                        <div>
                            <span className="fw-semibold text-white d-block">விருப்பமானவை மட்டும் (Favorites Only)</span>
                            <small className="text-secondary">பிடித்தமான புத்தகங்களை மட்டும் காட்டவும்</small>
                        </div>
                        <div className="form-check form-switch m-0 fs-5">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id="favSwitch"
                                checked={!!filters.favorite}
                                onChange={(e) => onFilterChange("favorite", e.target.checked)}
                            />
                        </div>
                    </div>

                    {/* Sorting / வரிசைப்படுத்து */}
                    <div className="mb-2">
                        <label className="filter-section-title d-block mb-2">
                            வரிசைப்படுத்து (Sort By)
                        </label>
                        <select
                            className="form-select filter-select"
                            value={filters.ordering || "latest"}
                            onChange={(e) => onFilterChange("ordering", e.target.value)}
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.key} value={opt.key}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="filter-modal-footer p-3 px-4 d-flex justify-content-between border-top border-secondary border-opacity-25">
                    <button
                        type="button"
                        className="btn btn-outline-light d-flex align-items-center gap-2"
                        onClick={onResetFilters}
                    >
                        <FaUndo size={12} />
                        மீட்டமை (Reset)
                    </button>
                    <button
                        type="button"
                        className="btn btn-warning fw-bold px-4 d-flex align-items-center gap-2"
                        onClick={() => {
                            if (onApply) onApply();
                            onClose();
                        }}
                    >
                        <FaCheck size={14} />
                        பயன்படுத்து (Apply)
                    </button>
                </div>
            </div>
        </div>
    );
}
