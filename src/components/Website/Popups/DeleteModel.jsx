import PropTypes from "prop-types";
const DeleteModel = ({ onDelete, onClose }) => {
    const handleDelete = () => {
        // Call onDelete function passed from parent component
        onDelete();
      };
    
      const handleClose = () => {
        // Call onClose function passed from parent component
        onClose();
      };
  return (
    <div
      className=" text-center p-4 rounded bg-white mx-auto"
      style={{ boxShadow: "0 0 10px rgba(0,0,0,0.5)" }}
    >
      <p>Are you sure you want to delete ?</p>
      <i className="fa-solid fa-exclamation fa-xl d-block my-4 fs-1 text-danger py-2"></i>
      <button onClick={handleDelete} className="btn btn-danger py-2 px-4 mx-3">
        Delete
      </button>
      <button
        onClick={handleClose}
        className="btn btn-secondary py-2 px-4 mx-3"
      >
        Cancel
      </button>
    </div>
  );
};
DeleteModel.propTypes = {
  onDelete: PropTypes.func.isRequired,
};
DeleteModel.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default DeleteModel;
