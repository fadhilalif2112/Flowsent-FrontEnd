import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

/**
 * Notification Component
 *
 * @component
 * @description Komponen notifikasi yang reusable dengan berbagai tipe dan auto-dismiss
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Tipe notifikasi ('success', 'error', 'info', 'warning')
 * @param {string} props.message - Pesan yang akan ditampilkan
 * @param {boolean} props.show - State untuk menampilkan/menyembunyikan notifikasi
 * @param {Function} props.onClose - Handler ketika notifikasi ditutup
 * @param {number} props.duration - Durasi auto-dismiss dalam milidetik (default: 5000, 0 = tidak auto-dismiss)
 * @param {string} props.position - Posisi notifikasi ('top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center')
 *
 * @example
 * <Notification
 *   type="success"
 *   message="Email sent successfully!"
 *   show={showNotification}
 *   onClose={() => setShowNotification(false)}
 * />
 */
const Notification = ({
  type = "info",
  message,
  show = false,
  onClose,
  duration = 5000,
  position = "top-right",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-dismiss timer
  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  // Handle visibility animation
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Trigger enter animation
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      // Trigger exit animation
      setIsAnimating(false);
      // Hide after animation completes
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [show]);

  /**
   * Handler untuk menutup notifikasi
   */
  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  /**
   * Mendapatkan konfigurasi icon dan style berdasarkan tipe
   */
  const getNotificationConfig = () => {
    const configs = {
      success: {
        icon: CheckCircle,
        bgColor: "bg-green-50 border-green-200",
        textColor: "text-green-800",
        iconColor: "text-green-600",
        progressColor: "bg-green-600",
      },
      error: {
        icon: AlertCircle,
        bgColor: "bg-red-50 border-red-200",
        textColor: "text-red-800",
        iconColor: "text-red-600",
        progressColor: "bg-red-600",
      },
      warning: {
        icon: AlertTriangle,
        bgColor: "bg-yellow-50 border-yellow-200",
        textColor: "text-yellow-800",
        iconColor: "text-yellow-600",
        progressColor: "bg-yellow-600",
      },
      info: {
        icon: Info,
        bgColor: "bg-blue-50 border-blue-200",
        textColor: "text-blue-800",
        iconColor: "text-blue-600",
        progressColor: "bg-blue-600",
      },
    };

    return configs[type] || configs.info;
  };

  /**
   * Mendapatkan class CSS untuk posisi notifikasi
   */
  const getPositionClasses = () => {
    const positions = {
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-center": "top-4 left-1/2 transform -translate-x-1/2",
      "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    };

    return positions[position] || positions["top-right"];
  };

  /**
   * Mendapatkan class CSS untuk animasi berdasarkan posisi
   */
  const getAnimationClasses = () => {
    const isTop = position.includes("top");
    const isBottom = position.includes("bottom");
    const isLeft = position.includes("left");
    const isRight = position.includes("right");

    let translateClass = "";
    if (isTop)
      translateClass = isAnimating ? "translate-y-0" : "-translate-y-full";
    if (isBottom)
      translateClass = isAnimating ? "translate-y-0" : "translate-y-full";
    if (isLeft && !isTop && !isBottom)
      translateClass = isAnimating ? "translate-x-0" : "-translate-x-full";
    if (isRight && !isTop && !isBottom)
      translateClass = isAnimating ? "translate-x-0" : "translate-x-full";

    const opacityClass = isAnimating ? "opacity-100" : "opacity-0";

    return `${translateClass} ${opacityClass}`;
  };

  if (!isVisible) return null;

  const config = getNotificationConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`
        fixed z-[60] max-w-sm w-full transition-all duration-300 ease-in-out
        ${getPositionClasses()}
        ${getAnimationClasses()}
      `}
    >
      <div
        className={`
          border rounded-lg shadow-lg p-4 flex items-start gap-3 relative overflow-hidden
          ${config.bgColor}
        `}
      >
        {/* Icon */}
        <div className="flex-shrink-0">
          <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.textColor} break-words`}>
            {message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`
            flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors
            ${config.textColor}
          `}
          title="Close notification"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress Bar untuk Auto-dismiss */}
        {duration > 0 && show && (
          <div
            className={`
              absolute bottom-0 left-0 h-1 ${config.progressColor} 
              animate-shrink origin-left
            `}
            style={{
              animationDuration: `${duration}ms`,
              animationTimingFunction: "linear",
              animationFillMode: "forwards",
            }}
          />
        )}
      </div>

      {/* Custom CSS untuk progress bar animation */}
      <style jsx>{`
        @keyframes shrink {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
        .animate-shrink {
          animation-name: shrink;
        }
      `}</style>
    </div>
  );
};

/**
 * NotificationProvider Component
 *
 * @description Provider untuk mengelola multiple notifications
 * Context-based notification system (opsional, untuk penggunaan global)
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      ...notification,
      show: true,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, show: false } : notif))
    );

    // Remove from array after animation
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 300);
  };

  return (
    <>
      {children}
      {/* Render all notifications */}
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => removeNotification(notification.id)}
          position={notification.position || "top-right"}
          style={{
            zIndex: 60 + index, // Stack notifications
          }}
        />
      ))}
    </>
  );
};

/**
 * Hook untuk menggunakan notification system
 *
 * @example
 * const notify = useNotification();
 * notify.success('Email sent successfully!');
 * notify.error('Failed to send email');
 */
export const useNotification = () => {
  // Untuk implementasi sederhana tanpa context
  const show = (type, message, options = {}) => {
    // Implementasi sederhana dengan event
    window.dispatchEvent(
      new CustomEvent("show-notification", {
        detail: { type, message, ...options },
      })
    );
  };

  return {
    success: (message, options) => show("success", message, options),
    error: (message, options) => show("error", message, options),
    warning: (message, options) => show("warning", message, options),
    info: (message, options) => show("info", message, options),
    show,
  };
};

export default Notification;
