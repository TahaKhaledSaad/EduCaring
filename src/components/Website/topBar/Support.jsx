import { useState, useEffect, useRef } from "react";

export default function Support() {
  const [popupVisible, setPopupVisible] = useState(false);
  const suppRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (suppRef.current && !suppRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    }

    if (popupVisible) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [popupVisible]);

  function togglePopup() {
    setPopupVisible((prevState) => !prevState);
  }

  return (
    <>
      <div className="supp" ref={suppRef}>
        <div className="support" onClick={togglePopup}>
          <span>Support</span>
          <i className="bi bi-signpost-2"></i>
        </div>

        {popupVisible && (
          <div
            className={`support-popup shadow-lg ${
              popupVisible ? "slide-in" : "slide-out"
            }`}
          >
            <div className="head">
              <h4>support</h4>
              <i className="bi bi-x close" onClick={togglePopup}></i>
            </div>
            <div className="body">
              <i className="bi bi-signpost-2"></i>
              <div className="form">
                <div>
                  <input type="text" placeholder="title" />
                </div>
                <div>
                  <input
                    name="details"
                    placeholder="details"
                    className="detials"
                  />
                </div>
                <div className="btns">
                  <button>Send</button>
                  <button className="cancel" onClick={togglePopup}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
