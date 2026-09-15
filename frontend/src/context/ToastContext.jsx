import React, { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "info", duration = 3500) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-container-modern position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
                {toasts.map(toast => {
                    let bg = "linear-gradient(135deg, #1e2229 0%, #29303d 100%)";
                    let border = "rgba(255, 255, 255, 0.1)";
                    let icon = <FaInfoCircle className="text-info me-2 flex-shrink-0" size={18} />;

                    if (toast.type === "success") {
                        bg = "linear-gradient(135deg, #12281e 0%, #1a3c2c 100%)";
                        border = "rgba(40, 167, 69, 0.4)";
                        icon = <FaCheckCircle className="text-success me-2 flex-shrink-0" size={18} />;
                    } else if (toast.type === "warning" || toast.type === "error") {
                        bg = "linear-gradient(135deg, #2d1819 0%, #401f22 100%)";
                        border = "rgba(220, 53, 69, 0.4)";
                        icon = <FaExclamationCircle className="text-danger me-2 flex-shrink-0" size={18} />;
                    }

                    return (
                        <div
                            key={toast.id}
                            className="toast-modern mb-2 p-3 d-flex align-items-center justify-content-between rounded-3 shadow-lg"
                            style={{
                                background: bg,
                                border: `1px solid ${border}`,
                                color: "#fff",
                                minWidth: "280px",
                                maxWidth: "380px",
                                backdropFilter: "blur(12px)",
                                animation: "slideInRight 0.3s ease",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                            }}
                        >
                            <div className="d-flex align-items-center">
                                {icon}
                                <span className="small fw-medium">{toast.message}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeToast(toast.id)}
                                className="btn btn-link text-muted p-0 ms-2"
                                style={{ textDecoration: "none" }}
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export default ToastContext;
