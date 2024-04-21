import "./style.css";

function LoadingScreen(props) {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="loading-text">{props.status || "Loading..."}</div>
        <span className="line line-1"></span>
        <span className="line line-2"></span>
        <span className="line line-3"></span>
        <span className="line line-4"></span>
        <span className="line line-5"></span>
        <span className="line line-6"></span>
        <span className="line line-7"></span>
        <span className="line line-8"></span>
        <span className="line line-9"></span>
        <span className="line line-10"></span>
        <span className="line line-11"></span>
      </div>
    </div>
  );
}

export default LoadingScreen;
