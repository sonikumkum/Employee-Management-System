// STEP 41 FIX: Loading Spinner

import { FaSpinner } from "react-icons/fa";

function LoadingSpinner({
  message = "Loading...",
}) {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center py-5"
      style={{ minHeight: "180px" }}
    >
      <FaSpinner
        className="text-primary"
        size={32}
        style={{
          animation:
            "emsSpin 1s linear infinite",
        }}
      />

      <div className="text-muted mt-3">
        {message}
      </div>

      <style>
        {`
          @keyframes emsSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

export default LoadingSpinner;