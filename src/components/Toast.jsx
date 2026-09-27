import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

function Toast({
  message,
  type = "success",
  onClose,
}) {
  if (!message) return null;

  const config = {
    success: {
      icon: <FaCheckCircle />,
      title: "Success",
      className: "toast-success",
    },
    error: {
      icon: <FaExclamationCircle />,
      title: "Error",
      className: "toast-error",
    },
    info: {
      icon: <FaInfoCircle />,
      title: "Information",
      className: "toast-info",
    },
    warning: {
      icon: <FaExclamationCircle />,
      title: "Warning",
      className: "toast-warning",
    },
  };

  const current =
    config[type] || config.success;

  return (
    <>
      <div
        className={`ems-toast ${current.className}`}
      >
        <div className="ems-toast-icon">
          {current.icon}
        </div>

        <div className="ems-toast-content">
          <div className="ems-toast-title">
            {current.title}
          </div>

          <div className="ems-toast-message">
            {message}
          </div>
        </div>

        <button
          type="button"
          className="ems-toast-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>
      </div>

      <style>
        {`
          .ems-toast {
            position: fixed;
            top: 85px;
            right: 25px;
            z-index: 9999;
            min-width: 320px;
            max-width: 420px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 15px 16px;
            border-radius: 12px;
            background: #ffffff;
            box-shadow: 0 10px 35px rgba(0,0,0,0.15);
            border-left: 4px solid;
            animation: emsToastSlide 0.3s ease;
          }

          .toast-success {
            border-left-color: #198754;
          }

          .toast-error {
            border-left-color: #dc3545;
          }

          .toast-info {
            border-left-color: #0d6efd;
          }

          .toast-warning {
            border-left-color: #ffc107;
          }

          .ems-toast-icon {
            font-size: 20px;
            margin-top: 2px;
          }

          .toast-success .ems-toast-icon {
            color: #198754;
          }

          .toast-error .ems-toast-icon {
            color: #dc3545;
          }

          .toast-info .ems-toast-icon {
            color: #0d6efd;
          }

          .toast-warning .ems-toast-icon {
            color: #ffc107;
          }

          .ems-toast-content {
            flex: 1;
          }

          .ems-toast-title {
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 3px;
          }

          .ems-toast-message {
            color: #6c757d;
            font-size: 13px;
            line-height: 1.4;
          }

          .ems-toast-close {
            border: none;
            background: transparent;
            color: #6c757d;
            cursor: pointer;
            padding: 2px;
          }

          .ems-toast-close:hover {
            color: #212529;
          }

          @keyframes emsToastSlide {
            from {
              opacity: 0;
              transform: translateX(30px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @media (max-width: 576px) {
            .ems-toast {
              left: 15px;
              right: 15px;
              top: 75px;
              min-width: auto;
              max-width: none;
            }
          }
        `}
      </style>
    </>
  );
}

export default Toast;