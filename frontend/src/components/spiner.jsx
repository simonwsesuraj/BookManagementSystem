import React from "react";

function Spinner() {
    return (
        <div className="spinner-container">

            <div className="book-spinner">
                <div className="spinner-ring"></div>
                <span>📚</span>
            </div>

            <p className="loading-text">
                Loading books...
            </p>

        </div>
    );
}

export default Spinner;