import {
  FaInbox,
  FaPlus,
} from "react-icons/fa";

function EmptyState({
  title = "No Data Found",
  message = "There is no data available at the moment.",
  actionText,
  onAction,
}) {
  return (
    <div className="text-center py-5 px-3">

      <div
        className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
        style={{
          width: "75px",
          height: "75px",
        }}
      >
        <FaInbox
          size={32}
          className="text-muted"
        />
      </div>

      <h5 className="fw-bold mb-2">
        {title}
      </h5>

      <p
        className="text-muted mx-auto mb-3"
        style={{ maxWidth: "450px" }}
      >
        {message}
      </p>

      {actionText && onAction && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onAction}
        >
          <FaPlus className="me-2" />
          {actionText}
        </button>
      )}

    </div>
  );
}

export default EmptyState;