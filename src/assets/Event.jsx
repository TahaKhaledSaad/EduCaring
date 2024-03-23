import React from "react";
import eventImg1 from "../../../assets/event-img1.jpeg";
import eventImg2 from "../../../assets/event-img2.jpeg";
import eventImg3 from "../../../assets/event-img3.jpeg";
import map from "../../../assets/map.jpeg";
import speakerImg1 from "../../../assets/speaker-img1.jpeg";
import speakerImg2 from "../../../assets/speaker-img2.jpeg";
import speakerImg3 from "../../../assets/speaker-img3.jpeg";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";

export default function Event() {
  return (
    <>
      <div className="event-comp">
        <Carousel data-bs-theme="dark" className="coursel">
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={eventImg1}
              alt="First slide"
              style={{ height: "55vh" }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={eventImg2}
              alt="Second slide"
              style={{ height: "55vh" }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={eventImg3}
              alt="Third slide"
              style={{ height: "55vh" }}
            />
          </Carousel.Item>
        </Carousel>
        <div className="event-info m-3 d-flex gap-3">
          <div className="details">
            <div className="d-flex gap-2">
              <div
                className="p-1 border border-info text-center"
                style={{
                  width: "90px",
                  fontSize: "14px",
                  borderRadius: "20px",
                }}
              >
                <span>25</span>
                <span className="text-secondary mx-1">/120</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.81 6.43503V11.565C15.81 12.405 15.36 13.185 14.6325 13.6125L10.1775 16.185C9.44999 16.605 8.55 16.605 7.815 16.185L3.36 13.6125C2.6325 13.1925 2.1825 12.4125 2.1825 11.565V6.43503C2.1825 5.59503 2.6325 4.81499 3.36 4.38749L7.815 1.815C8.5425 1.395 9.44249 1.395 10.1775 1.815L14.6325 4.38749C15.36 4.81499 15.81 5.58753 15.81 6.43503Z"
                    stroke="#3296D4"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 8.24998C9.96512 8.24998 10.7475 7.46759 10.7475 6.50247C10.7475 5.53735 9.96512 4.755 9 4.755C8.03488 4.755 7.2525 5.53735 7.2525 6.50247C7.2525 7.46759 8.03488 8.24998 9 8.24998Z"
                    stroke="#3296D4"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 12.495C12 11.145 10.6575 10.05 9 10.05C7.3425 10.05 6 11.145 6 12.495"
                    stroke="#3296D4"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <Link
                to="/payment"
                className="p-1 border text-white text-center"
                style={{
                  background: "#3296D4",
                  borderRadius: "20px",
                  width: "170px",
                  fontSize: "14px",
                }}
              >
                <span className="mx-1">Buy ticket 520 SAR</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5.28V12.72C15 13.86 14.895 14.67 14.625 15.2475C14.625 15.255 14.6175 15.27 14.61 15.2775C14.445 15.4875 14.2275 15.5925 13.9725 15.5925C13.575 15.5925 13.095 15.33 12.5775 14.775C11.9625 14.115 11.0175 14.1675 10.4775 14.8875L9.72002 15.8925C9.42002 16.2975 9.0225 16.5 8.625 16.5C8.2275 16.5 7.82998 16.2975 7.52998 15.8925L6.76502 14.88C6.23251 14.1675 5.29499 14.115 4.67999 14.7675L4.67249 14.775C3.82499 15.6825 3.07501 15.8175 2.64001 15.2775C2.63251 15.27 2.625 15.255 2.625 15.2475C2.355 14.67 2.25 13.86 2.25 12.72V5.28C2.25 4.14 2.355 3.33 2.625 2.7525C2.625 2.745 2.62501 2.7375 2.64001 2.73C3.06751 2.1825 3.82499 2.3175 4.67249 3.225L4.67999 3.2325C5.29499 3.885 6.23251 3.8325 6.76502 3.12L7.52998 2.1075C7.82998 1.7025 8.2275 1.5 8.625 1.5C9.0225 1.5 9.42002 1.7025 9.72002 2.1075L10.4775 3.1125C11.0175 3.8325 11.9625 3.885 12.5775 3.225C13.095 2.67 13.575 2.4075 13.9725 2.4075C14.2275 2.4075 14.445 2.52 14.61 2.73C14.625 2.7375 14.625 2.745 14.625 2.7525C14.895 3.33 15 4.14 15 5.28Z"
                    stroke="white"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 7.6875H12"
                    stroke="white"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 10.3125H10.5"
                    stroke="white"
                    strokeWidth="1.125"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>

            <div
              className="general my-3"
              style={{ borderBottom: "1px solid #DCDCDC" }}
            >
              <h2>
                Programming : How to begin your first job! and more details.
              </h2>
              <div className="date my-3 d-flex gap-2 align-items-center">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="48"
                    height="48"
                    rx="8"
                    fill="#3296D4"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M28.75 15.56V14C28.75 13.59 28.41 13.25 28 13.25C27.59 13.25 27.25 13.59 27.25 14V15.5H20.75V14C20.75 13.59 20.41 13.25 20 13.25C19.59 13.25 19.25 13.59 19.25 14V15.56C16.55 15.81 15.24 17.42 15.04 19.81C15.02 20.1 15.26 20.34 15.54 20.34H32.46C32.75 20.34 32.99 20.09 32.96 19.81C32.76 17.42 31.45 15.81 28.75 15.56Z"
                    fill="#3296D4"
                  />
                  <path
                    d="M32 21.84H16C15.45 21.84 15 22.29 15 22.84V29C15 32 16.5 34 20 34H28C31.5 34 33 32 33 29V22.84C33 22.29 32.55 21.84 32 21.84ZM21.21 30.21C21.11 30.3 21 30.37 20.88 30.42C20.76 30.47 20.63 30.5 20.5 30.5C20.37 30.5 20.24 30.47 20.12 30.42C20 30.37 19.89 30.3 19.79 30.21C19.61 30.02 19.5 29.76 19.5 29.5C19.5 29.24 19.61 28.98 19.79 28.79C19.89 28.7 20 28.63 20.12 28.58C20.36 28.48 20.64 28.48 20.88 28.58C21 28.63 21.11 28.7 21.21 28.79C21.39 28.98 21.5 29.24 21.5 29.5C21.5 29.76 21.39 30.02 21.21 30.21ZM21.42 26.38C21.37 26.5 21.3 26.61 21.21 26.71C21.11 26.8 21 26.87 20.88 26.92C20.76 26.97 20.63 27 20.5 27C20.37 27 20.24 26.97 20.12 26.92C20 26.87 19.89 26.8 19.79 26.71C19.7 26.61 19.63 26.5 19.58 26.38C19.53 26.26 19.5 26.13 19.5 26C19.5 25.87 19.53 25.74 19.58 25.62C19.63 25.5 19.7 25.39 19.79 25.29C19.89 25.2 20 25.13 20.12 25.08C20.36 24.98 20.64 24.98 20.88 25.08C21 25.13 21.11 25.2 21.21 25.29C21.3 25.39 21.37 25.5 21.42 25.62C21.47 25.74 21.5 25.87 21.5 26C21.5 26.13 21.47 26.26 21.42 26.38ZM24.71 26.71C24.61 26.8 24.5 26.87 24.38 26.92C24.26 26.97 24.13 27 24 27C23.87 27 23.74 26.97 23.62 26.92C23.5 26.87 23.39 26.8 23.29 26.71C23.11 26.52 23 26.26 23 26C23 25.74 23.11 25.48 23.29 25.29C23.39 25.2 23.5 25.13 23.62 25.08C23.86 24.97 24.14 24.97 24.38 25.08C24.5 25.13 24.61 25.2 24.71 25.29C24.89 25.48 25 25.74 25 26C25 26.26 24.89 26.52 24.71 26.71Z"
                    fill="#3296D4"
                  />
                </svg>
                <div>
                  <p style={{ fontSize: "14px", margin: 0 }}>
                    05 Mars, 2023 - 09 Mars, 2023
                  </p>
                  <p style={{ fontSize: "14px", margin: 0, color: "#747688" }}>
                    Tuesday, 4:00PM - 9:00PM
                  </p>
                </div>
              </div>
            </div>

            <div
              className="desc py-2"
              style={{ borderBottom: "1px solid #DCDCDC" }}
            >
              <h3>Description</h3>
              <span style={{ color: "#747688", fontSize: "14px" }}>
                Ut enim ad minima veniam, quis nostrum ationem ullam corporis
                suscipit laboriosam, nisi ut al Sed ut perspiciatis unde omnis
                iste natus error sit ptatem accusantium doloremque laudantium.Ut
                enim ad minima veniam, quis nostrum ationem ullam corporis
                suscipit laboriosam, nisi ut al Sed ut perspiciatis unde
                omnisiste natus.
              </span>
              <p style={{ color: "#0092FC", cursor: "pointer" }}>
                {" "}
                Read More..
              </p>
            </div>

            <div className="location py-2">
              <h3>Location</h3>
              <p style={{ fontSize: "14px", color: "#747688" }}>
                riyadh, Saudi Arabia
              </p>
              <img
                src={map}
                alt="map"
                height={"220px"}
                width={"100%"}
                className="rounded"
              />
            </div>
          </div>

          <div
            className="speakers rounded py-3 px-2 w-50"
            style={{ backgroundColor: "#F5F7FB", height: "50%" }}
          >
            <h5>Speakers</h5>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link to="/speakerProfile">
                <img
                  src={speakerImg1}
                  alt="speakerImg"
                  className="rounded-circle mb-2"
                  width={"65px"}
                  height={"65px"}
                />
                <p className="text-dark">Mohamed</p>
              </Link>
              <Link to="/speakerProfile">
                <img
                  src={speakerImg2}
                  alt="speakerImg"
                  className="rounded-circle mb-2"
                  width={"65px"}
                  height={"65px"}
                />
                <p className="text-dark">Hossam</p>
              </Link>
              <Link to="/speakerProfile">
                <img
                  src={speakerImg3}
                  alt="speakerImg"
                  className="rounded-circle mb-2"
                  width={"65px"}
                  height={"65px"}
                />
                <p className="text-dark">Omar Abd.</p>
              </Link>
              <Link to="/speakerProfile">
                <img
                  src={speakerImg2}
                  alt="speakerImg"
                  className="rounded-circle mb-2"
                  width={"65px"}
                  height={"65px"}
                />
                <p className="text-dark">Ragab T.</p>
              </Link>
              <Link to="/speakerProfile">
                <img
                  src={speakerImg1}
                  alt="speakerImg"
                  className="rounded-circle mb-2"
                  width={"65px"}
                  height={"65px"}
                />
                <p className="text-dark">Mohamed</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
