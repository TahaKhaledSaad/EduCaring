import "./LandingPage.css";
import { Link, NavLink } from "react-router-dom";
import logo from "../../../assets/logo.jpg";
import landing1 from "../../../assets/landing1.png";
import landing2 from "../../../assets/landing2.png";
import landing3 from "../../../assets/landing3.png";
import landing4 from "../../../assets/landing4.png";
import spotify from "../../../assets/spotify.png";
import google from "../../../assets/google.png";
import stripe from "../../../assets/stripe.png";
import youtube from "../../../assets/youtube.png";
import microsoft from "../../../assets/microsoft.png";
import medium from "../../../assets/medium.png";
import zoom from "../../../assets/zoom.png";
import uber from "../../../assets/uber.png";
import grab from "../../../assets/grab.png";
import photo2 from "../../../assets/photos2.png";
import photo3 from "../../../assets/photos3.png";
import photo1 from "../../../assets/photos1.png";
import photo4 from "../../../assets/photos4.png";
import photo5 from "../../../assets/photos5.png";
import photo6 from "../../../assets/photos6.png";
import photo7 from "../../../assets/photos7.png";
import photo8 from "../../../assets/photos8.png";
import photo9 from "../../../assets/photos9.png";
import photo10 from "../../../assets/photos10.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import s1 from "../../../assets/speaker1.png";
import s2 from "../../../assets/speaker2.png";
import s3 from "../../../assets/speaker3.png";
import s4 from "../../../assets/speaker4.png";
import Role from "../Popups/Role";
import { useState } from "react";

export default function LandingPage() {
  let [role, setRole] = useState(false);

  function handleRoleFromChild(role) {
    setRole(role);
  }
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <Arrow />,
    prevArrow: <Arrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="landing-page">
        {/* Start navBar */}
        <nav className="navbar navbar-expand-lg bg-transparent px-2">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="logo" width={"184px"} height={"62px"} />
            </Link>
            {/* Toggle button always visible */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            {/* Menu content */}
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav mx-auto m-2 mb-lg-0">
                <li className="nav-item active">
                  <NavLink className="nav-link" to="/home">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/home/myevents">
                    Events
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#photos">
                    Photos and Videos
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#speakers">
                    Speakers
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact">
                    Contact us
                  </a>
                </li>
              </ul>

              <ul className="navbar-nav m-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className="btn btn-info text-white m-2 order-lg-last order-first"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <button className="btn btn-info text-white m-2" onClick={() => setRole(!role)}>
                    Register
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* End navBar */}

        {/* Start Landing Section*/}

        <div className="home">
          <div className="ellips1"></div>
          <div className="ellips2"></div>
          <div className="ellips3"></div>
          <div className="landing">
            <div className="text">
              <h1>
                Welcome To <span>Edu Caring</span>
              </h1>
              <span>
                Morbi sit egestas dignissim pharetra, sed amet. Tempus justo senectus risus ac vel,
                velit, nunc. Eget commodo eget in aliquam facilisi facilisi nec magna hendrerit.
                Placerat ipsum sit tellus urna, faucibus aenean lorem faucibus integer.
              </span>
              <a className="button" onClick={() => setRole(!role)}>
                Register <i className="fas fa-chevron-right"></i>
              </a>
            </div>

            <div className="images">
              <div>
                <img
                  src={landing1}
                  className="landing1"
                  width="200px"
                  height="397px"
                  alt="landing1"
                />
                <img
                  src={landing4}
                  className="landing4"
                  width="200px"
                  height="185px"
                  alt="landing4"
                />
              </div>

              <div>
                <img
                  src={landing2}
                  className="landing2"
                  width="200px"
                  height="192px"
                  alt="landing2"
                />
                <img
                  src={landing3}
                  className="landing3"
                  width="200px"
                  height="390px"
                  alt="landing3"
                />
              </div>
            </div>
          </div>
        </div>
        {/* End Landing Section*/}

        {/* Start Social Media */}
        <div className="container-fluid">
          <div className="social-media">
            <img src={spotify} width="167px" height="50px" alt="spotify" />
            <img src={google} width="150px" height="50px" alt="google" />
            <img src={stripe} width="132px" height="62px" alt="stripe" />
            <img src={youtube} width="212px" height="131px" alt="youtube" />
            <img src={microsoft} width="278px" height="124px" alt="microsoft" />
            <img src={medium} width="275px" height="83px" alt="medium" />
            <img src={zoom} width="170px" height="30px" alt="zoom" />
            <img src={uber} width="125px" height="44px" alt="uber" />
            <img src={grab} width="136px" height="52px" alt="grab" />
          </div>
        </div>
        {/* End Social Media */}

        {/* Start About Section */}
        <div className="about">
          <svg
            className="shape"
            xmlns="http://www.w3.org/2000/svg"
            width="79"
            height="78"
            viewBox="0 0 79 78"
            fill="none"
          >
            <path
              d="M10.6872 21.6883C10.6872 24.361 8.51635 26.5319 5.84363 26.5319C3.1709 26.5319 1 24.361 1 21.6883C1 19.0156 3.1709 16.8447 5.84363 16.8447C8.51635 16.8447 10.6872 19.01 10.6872 21.6883Z"
              stroke="#3296D4"
              strokeOpacity="0.1"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M57.6799 63.6963C60.3549 63.6963 62.5235 61.5277 62.5235 58.8527C62.5235 56.1776 60.3549 54.009 57.6799 54.009C55.0048 54.009 52.8362 56.1776 52.8362 58.8527C52.8362 61.5277 55.0048 63.6963 57.6799 63.6963Z"
              stroke="#3296D4"
              strokeOpacity="0.1"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M39.4444 48.8949C45.1495 48.8949 49.7744 44.27 49.7744 38.5649C49.7744 32.8598 45.1495 28.2349 39.4444 28.2349C33.7393 28.2349 29.1144 32.8598 29.1144 38.5649C29.1144 44.27 33.7393 48.8949 39.4444 48.8949Z"
              stroke="#3296D4"
              strokeOpacity="0.1"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M57.4431 38.5648L53.9978 44.5869L52.1709 51.2913L45.4722 53.1125L39.4444 56.5634L33.4167 53.1125L26.7124 51.2913L24.891 44.5869L21.4402 38.5648L24.891 32.5371L26.7124 25.8327L33.4167 24.0114L39.4444 20.5605L45.4722 24.0114L52.1709 25.8327L53.9978 32.5371L57.4431 38.5648Z"
              stroke="#3296D4"
              strokeOpacity="0.1"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M52.8363 58.8528C52.8363 56.18 55.0072 54.0091 57.6799 54.0091C59.1234 54.0091 60.4203 54.6463 61.3055 55.65C64.9932 50.936 67.198 45.0098 67.198 38.5592C67.198 23.2277 54.7704 10.8 39.4388 10.8C24.1073 10.8 11.6797 23.2277 11.6797 38.5592C11.6797 53.8907 24.1073 66.3184 39.4388 66.3184C44.8294 66.3184 49.8534 64.779 54.1106 62.1232C53.3268 61.2605 52.8363 60.1158 52.8363 58.8528Z"
              stroke="#3296D4"
              strokeOpacity="0.1"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M39.4444 1C26.4924 1 15.0685 7.55777 8.31902 17.5326C9.73432 18.3784 10.6872 19.9234 10.6872 21.6939C10.6872 24.3666 8.51636 26.5375 5.84364 26.5375C5.18391 26.5375 4.55803 26.4022 3.98853 26.1654C2.62961 30.0504 1.88528 34.2174 1.88528 38.5648C1.88528 59.3094 18.7054 76.1296 39.4501 76.1296C60.1947 76.1296 77.0148 59.3094 77.0148 38.5648C77.0148 17.8201 60.1891 1 39.4444 1Z"
              stroke="#3296D4"
              strokeOpacity="0.1"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2>About Us</h2>
          <span>
            Morbi sit egestas dignissim pharetra, sed amet. Tempus justo senectus risus ac vel,
            velit, nunc. Eget commodo eget in aliquam facilisi facilisi nec magna hendrerit.
            Placerat ipsum sit tellus urna, faucibus aenean lorem faucibus integer.
          </span>

          <svg
            className="vector"
            xmlns="http://www.w3.org/2000/svg"
            width="514"
            height="700"
            viewBox="0 0 514 970"
            fill="none"
          >
            <path
              opacity="0.1"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M560.944 2.39439C684.672 26.7969 697.932 239.758 714.679 399.718C726.874 516.191 695.003 635.237 638.339 741.603C587.759 836.549 513.304 898.047 430.636 932.906C336.629 972.546 250.845 984.677 160.019 943.297C55.2689 895.574 -16.8452 755.234 3.911 608.091C24.0338 465.438 158.984 406.568 249.634 307.999C354.711 193.742 437.854 -21.8823 560.944 2.39439Z"
              fill="#9DB2CE"
            />
          </svg>
        </div>
        {/* End About Section */}

        {/* Start Photos and Videos */}
        <div className="photos" id="photos">
          <svg
            className="shape"
            xmlns="http://www.w3.org/2000/svg"
            width="123"
            height="108"
            viewBox="0 0 123 108"
            fill="none"
          >
            <path
              opacity="0.2"
              d="M116.309 47.2915C114.045 36.9157 110.763 24.6694 105.439 15.3813C102.523 10.2696 97.8836 6.42323 92.27 4.71298C86.1084 2.88168 80.443 3.86399 74.2965 4.97518C63.3797 6.561 52.4903 9.21095 41.8017 12.6107C32.2487 15.4383 21.0518 17.9027 13.2248 24.2859C1.84498 33.7639 3.75033 46.6468 6.95251 60.5215C9.21716 70.8973 12.4985 83.1435 17.8227 92.4316C22.1302 99.8492 30.0573 104.422 38.2221 104.109C48.9927 103.902 70.7717 98.602 81.2867 95.5166C90.3587 92.8179 100.527 90.3613 108.314 84.7924C121.338 75.6775 119.913 62.6657 116.309 47.2915ZM44.2911 41.1412C43.2866 37.3924 44.8758 35.6272 48.538 36.7889C58.3618 39.7818 68.4931 42.9603 78.3169 45.9532C81.9791 47.1149 82.5818 49.3642 80.058 52.4512C73.0468 59.9551 66.1026 67.7089 59.0914 75.2128C56.2602 78.1143 54.3088 77.5657 53.1308 74.1312C52.729 72.6317 45.2287 44.6402 44.2911 41.1412Z"
              fill="white"
              stroke="#C5CCDA"
              strokeWidth="7.24801"
              strokeMiterlimit="10"
            />
          </svg>
          <div className="images">
            <div className="col">
              <img src={photo1} alt="photos1" width="128px" height="192px" />
              <img src={photo2} alt="photos2" width="172px" height="258px" />
            </div>
            <div className="col">
              <img src={photo3} alt="photos3" width="128px" height="212px" />
              <img src={photo4} alt="photos4" width="128px" height="215px" />
              <img src={photo5} alt="photos5" width="128px" height="160px" />
            </div>
            <div className="col">
              <img src={photo6} alt="photos6" width="128px" height="171px" />
              <img src={photo7} alt="photos7" width="128px" height="172px" />
              <img src={photo8} alt="photos8" width="128px" height="192px" />
            </div>
            <div className="col">
              <img src={photo9} alt="photos9" width="160px" height="255px" />
              <img src={photo10} alt="photos10" width="128px" height="165px" />
            </div>
          </div>

          <div className="text">
            <h2>Photos and Videos</h2>
            <span>
              Morbi sit egestas dignissim pharetra, sed amet. Tempus justo senectus risus ac vel,
              velit, nunc. Eget commodo eget in aliquam facilisi facilisi nec magna hendrerit.
              Placerat ipsum sit tellus urna, faucibus aenean lorem faucibus integer.
            </span>
            <div className="more">
              <Link to="#">view more</Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M15.586 10.657L11.636 6.70704C11.4538 6.51844 11.353 6.26584 11.3553 6.00364C11.3576 5.74144 11.4628 5.49063 11.6482 5.30522C11.8336 5.11981 12.0844 5.01465 12.3466 5.01237C12.6088 5.01009 12.8614 5.11088 13.05 5.29304L18.707 10.95C18.8002 11.0427 18.8741 11.1529 18.9246 11.2742C18.9751 11.3955 19.001 11.5256 19.001 11.657C19.001 11.7884 18.9751 11.9186 18.9246 12.0399C18.8741 12.1612 18.8002 12.2714 18.707 12.364L13.05 18.021C12.9578 18.1166 12.8474 18.1927 12.7254 18.2451C12.6034 18.2976 12.4722 18.3251 12.3394 18.3263C12.2066 18.3274 12.0749 18.3021 11.952 18.2519C11.8291 18.2016 11.7175 18.1273 11.6236 18.0334C11.5297 17.9395 11.4555 17.8279 11.4052 17.705C11.3549 17.5821 11.3296 17.4504 11.3307 17.3176C11.3319 17.1849 11.3595 17.0536 11.4119 16.9316C11.4643 16.8096 11.5405 16.6993 11.636 16.607L15.586 12.657H6C5.73478 12.657 5.48043 12.5517 5.29289 12.3641C5.10536 12.1766 5 11.9223 5 11.657C5 11.3918 5.10536 11.1375 5.29289 10.9499C5.48043 10.7624 5.73478 10.657 6 10.657H15.586Z"
                  fill="#3296D4"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* End Photos and Videos */}

        {/* Start Contact US */}
        <div className="contact" id="contact">
          <svg
            className="rectangle"
            xmlns="http://www.w3.org/2000/svg"
            width="486"
            height="288"
            viewBox="0 0 486 288"
            fill="none"
          >
            <path
              opacity="0.5"
              d="M113.752 644.465C-16.5688 719.676 -183.21 675.042 -258.45 544.773C-333.691 414.503 -289.04 247.928 -158.719 172.717L77.2479 36.5353C207.569 -38.6759 374.21 5.9578 449.45 136.227C524.691 266.497 480.04 433.072 349.719 508.283L113.752 644.465Z"
              fill="white"
            />
          </svg>
          <div className="text">
            <h2>Contact Us</h2>
            <div className="form">
              <input type="text" placeholder="Email address" />
              <button>
                Send
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M16.14 2.96004L7.11 5.96004C1.04 7.99004 1.04 11.3 7.11 13.32L9.79 14.21L10.68 16.89C12.7 22.96 16.02 22.96 18.04 16.89L21.05 7.87004C22.39 3.82004 20.19 1.61004 16.14 2.96004ZM16.46 8.34004L12.66 12.16C12.51 12.31 12.32 12.38 12.13 12.38C11.94 12.38 11.75 12.31 11.6 12.16C11.31 11.87 11.31 11.39 11.6 11.1L15.4 7.28004C15.69 6.99004 16.17 6.99004 16.46 7.28004C16.75 7.57004 16.75 8.05004 16.46 8.34004Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="shapes">
            <div className="quarter"></div>
            <div className="half"></div>
            <div className="three-quarter">
              <svg
                width="200px"
                height="200px"
                viewBox="0 0 24.00 24.00"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                transform="rotate(90)"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="#CCCCCC"
                  strokeWidth="0.144"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M12 21C16.9706 21 21 16.9706 21 12H12V3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                    stroke="#ffffff"
                    strokeWidth="0.12000000000000002"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
        {/* End Contact US */}

        {/* Start Speaker */}
        <div className="speakers" id="speakers">
          <h2>Our speakers</h2>

          <div className="arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="85"
              height="56"
              viewBox="0 0 85 56"
              fill="none"
            >
              <g clipPath="url(#clip0_744_6735)">
                <path
                  d="M1.00567 32.4003C7.33002 36.8537 15.0455 40.1437 22.9177 38.8615C29.3404 37.816 35.232 33.6194 37.331 27.3635L35.671 27.5834C38.2906 31.2133 41.8692 34.0487 46.0074 35.7735C50.1457 37.4982 54.6811 38.0444 59.1077 37.3511C63.2489 36.6298 67.1334 34.8625 70.3905 32.218C74.4192 28.9899 76.6513 24.4512 79.3273 20.16C79.9876 19.1133 78.3216 18.1393 77.6676 19.1877C75.2953 22.9785 73.3397 27.0431 69.957 30.0711C67.0087 32.6855 63.424 34.4847 59.5587 35.29C51.1648 37.0335 42.3672 33.4435 37.2483 26.6512C37.155 26.502 37.0204 26.3827 36.8608 26.3077C36.7011 26.2327 36.5233 26.2053 36.3485 26.2287C36.1738 26.2521 36.0097 26.3254 35.8759 26.4396C35.7422 26.5539 35.6445 26.7043 35.5946 26.8728C33.6665 32.7464 27.8586 36.5102 21.8916 37.3376C14.6732 38.3416 7.48763 35.3292 1.54048 31.4937C0.968163 31.1243 0.466865 32.0064 1.00905 32.3878L1.00567 32.4003Z"
                  fill="#9DB2CE"
                />
                <path
                  d="M76.976 19.3083C72.9771 19.5238 68.8855 20.6519 64.9621 21.4571C63.8655 21.6823 64.1311 23.3818 65.222 23.3761C69.6619 23.3333 74.0624 22.5569 78.2445 21.0787L77.0812 20.4084L78.3569 26.4203C78.7388 28.2116 78.8848 30.3275 79.758 31.9438C79.8517 32.093 79.9909 32.2083 80.1551 32.2729C80.3193 32.3375 80.4999 32.3479 80.6702 32.3026C80.8406 32.2573 80.9918 32.1587 81.1015 32.0213C81.2112 31.8838 81.2738 31.7149 81.2799 31.5392C81.4117 29.713 80.6484 27.6911 80.2585 25.9043L78.9466 19.9027C78.8772 19.6627 78.7172 19.4588 78.5002 19.3338C78.2832 19.2088 78.0263 19.1724 77.7833 19.2324C73.7574 20.6635 69.5178 21.4116 65.2409 21.4456L65.5009 23.3646C69.3359 22.4885 73.477 21.8226 77.1416 20.3846C77.6617 20.1773 77.6594 19.2926 76.9977 19.3276L76.976 19.3083Z"
                  fill="#9DB2CE"
                />
                <path
                  d="M64.7335 22.6477C67.3982 24.5263 70.0587 26.4128 72.7147 28.3069L76.554 31.0621C77.7667 31.9467 78.9461 33.1035 80.374 33.591C80.512 33.6248 80.6569 33.618 80.7909 33.5714C80.9249 33.5248 81.0424 33.4403 81.129 33.3282C81.2156 33.2162 81.2677 33.0815 81.2789 32.9404C81.29 32.7992 81.2598 32.6579 81.1918 32.5334C80.3757 31.4013 79.1043 30.7085 77.964 29.9038C76.5969 28.9439 75.2156 27.9868 73.8098 27.07C70.9984 25.2364 68.1208 23.5144 65.1771 21.9039C65.0783 21.8495 64.9621 21.8354 64.8532 21.8648C64.7444 21.8941 64.6513 21.9645 64.5937 22.0611C64.5361 22.1577 64.5184 22.2729 64.5445 22.3823C64.5706 22.4918 64.6384 22.5869 64.7335 22.6477Z"
                  fill="#9DB2CE"
                />
              </g>
              <defs>
                <clipPath id="clip0_744_6735">
                  <rect
                    width="78"
                    height="36"
                    fill="white"
                    transform="translate(9.41724) rotate(15.1645)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <span className="no-speakers">54 speakers</span>

          <Slider {...settings}>
            <div className="speaker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="238"
                height="237"
                viewBox="0 0 238 237"
                fill="none"
              >
                <circle
                  cx="119"
                  cy="118.342"
                  r="118"
                  transform="rotate(35 119 118.342)"
                  fill="url(#paint0_linear_734_4437)"
                  fillOpacity="0.1"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_734_4437"
                    x1="119"
                    y1="0.341965"
                    x2="102"
                    y2="83.342"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#5CA9C3" />
                    <stop offset="1" stopColor="#5CA9C3" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <img src={s1} alt="speaker1" width="249px" height="249px" />
              <h4>Osama Montaser</h4>
              <span>xDoctor</span>
            </div>
            <div className="speaker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="238"
                height="237"
                viewBox="0 0 238 237"
                fill="none"
              >
                <circle
                  cx="119"
                  cy="118.342"
                  r="118"
                  transform="rotate(35 119 118.342)"
                  fill="url(#paint0_linear_734_4437)"
                  fillOpacity="0.1"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_734_4437"
                    x1="119"
                    y1="0.341965"
                    x2="102"
                    y2="83.342"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#5CA9C3" />
                    <stop offset="1" stopColor="#5CA9C3" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <img src={s2} alt="speaker1" width="249px" height="249px" />
              <h4>Osama Montaser</h4>
              <span>xDoctor</span>
            </div>
            <div className="speaker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="238"
                height="237"
                viewBox="0 0 238 237"
                fill="none"
              >
                <circle
                  cx="119"
                  cy="118.342"
                  r="118"
                  transform="rotate(35 119 118.342)"
                  fill="url(#paint0_linear_734_4437)"
                  fillOpacity="0.1"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_734_4437"
                    x1="119"
                    y1="0.341965"
                    x2="102"
                    y2="83.342"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#5CA9C3" />
                    <stop offset="1" stopColor="#5CA9C3" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <img src={s3} alt="speaker1" width="249px" height="249px" />
              <h4>Osama Montaser</h4>
              <span>xDoctor</span>
            </div>
            <div className="speaker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="238"
                height="237"
                viewBox="0 0 238 237"
                fill="none"
              >
                <circle
                  cx="119"
                  cy="118.342"
                  r="118"
                  transform="rotate(35 119 118.342)"
                  fill="url(#paint0_linear_734_4437)"
                  fillOpacity="0.1"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_734_4437"
                    x1="119"
                    y1="0.341965"
                    x2="102"
                    y2="83.342"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#5CA9C3" />
                    <stop offset="1" stopColor="#5CA9C3" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <img src={s4} alt="speaker1" width="249px" height="249px" />
              <h4>Osama Montaser</h4>
              <span>xDoctor</span>
            </div>
            <div className="speaker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="238"
                height="237"
                viewBox="0 0 238 237"
                fill="none"
              >
                <circle
                  cx="119"
                  cy="118.342"
                  r="118"
                  transform="rotate(35 119 118.342)"
                  fill="url(#paint0_linear_734_4437)"
                  fillOpacity="0.1"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_734_4437"
                    x1="119"
                    y1="0.341965"
                    x2="102"
                    y2="83.342"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#5CA9C3" />
                    <stop offset="1" stopColor="#5CA9C3" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <img src={s1} alt="speaker1" width="249px" height="249px" />
              <h4>Osama Montaser</h4>
              <span>xDoctor</span>
            </div>
            <div className="speaker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="238"
                height="237"
                viewBox="0 0 238 237"
                fill="none"
              >
                <circle
                  cx="119"
                  cy="118.342"
                  r="118"
                  transform="rotate(35 119 118.342)"
                  fill="url(#paint0_linear_734_4437)"
                  fillOpacity="0.1"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_734_4437"
                    x1="119"
                    y1="0.341965"
                    x2="102"
                    y2="83.342"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#5CA9C3" />
                    <stop offset="1" stopColor="#5CA9C3" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <img src={s2} alt="speaker1" width="249px" height="249px" />
              <h4>Osama Montaser</h4>
              <span>xDoctor</span>
            </div>
            <div className="speaker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="238"
                height="237"
                viewBox="0 0 238 237"
                fill="none"
              >
                <circle
                  cx="119"
                  cy="118.342"
                  r="118"
                  transform="rotate(35 119 118.342)"
                  fill="url(#paint0_linear_734_4437)"
                  fillOpacity="0.1"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_734_4437"
                    x1="119"
                    y1="0.341965"
                    x2="102"
                    y2="83.342"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#5CA9C3" />
                    <stop offset="1" stopColor="#5CA9C3" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <img src={s3} alt="speaker1" width="249px" height="249px" />
              <h4>Osama Montaser</h4>
              <span>xDoctor</span>
            </div>
            <div className="speaker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="238"
                height="237"
                viewBox="0 0 238 237"
                fill="none"
              >
                <circle
                  cx="119"
                  cy="118.342"
                  r="118"
                  transform="rotate(35 119 118.342)"
                  fill="url(#paint0_linear_734_4437)"
                  fillOpacity="0.1"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_734_4437"
                    x1="119"
                    y1="0.341965"
                    x2="102"
                    y2="83.342"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#5CA9C3" />
                    <stop offset="1" stopColor="#5CA9C3" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <img src={s4} alt="speaker1" width="249px" height="249px" />
              <h4>Osama Montaser</h4>
              <span>xDoctor</span>
            </div>
            <div className="speaker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="238"
                height="237"
                viewBox="0 0 238 237"
                fill="none"
              >
                <circle
                  cx="119"
                  cy="118.342"
                  r="118"
                  transform="rotate(35 119 118.342)"
                  fill="url(#paint0_linear_734_4437)"
                  fillOpacity="0.1"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_734_4437"
                    x1="119"
                    y1="0.341965"
                    x2="102"
                    y2="83.342"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#5CA9C3" />
                    <stop offset="1" stopColor="#5CA9C3" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <img src={s1} alt="speaker1" width="249px" height="249px" />
              <h4>Osama Montaser</h4>
              <span>xDoctor</span>
            </div>
          </Slider>
        </div>
        {/* End Speaker */}

        {/* Start Register */}
        <div className="register">
          <div className="person">
            <span>Register</span>
            <h3>Attendance</h3>
            <button>
              <Link className="text-dark" to="/register-attendance">
                Sign up now
              </Link>
            </button>
          </div>
          <div className="person">
            <span>Register</span>
            <h3>Speaker</h3>
            <button>
              <Link className="text-dark" to="/register-speaker">
                Sign up now
              </Link>
            </button>
          </div>
        </div>
        {/* End Register */}

        {/* Start Footer */}
        <div className="footer">
          <div className="info">
            <h4>eduCaring</h4>
            <div className="icons">
              <i className="fa-brands fa-x-twitter"></i>
              <i className="fa-brands fa-youtube"></i>
              <i className="fa-brands fa-instagram"></i>
              <i className="fa-brands fa-facebook"></i>
            </div>
            <span>&copy; educaring . All rights reserved </span>
          </div>

          <div className="links">
            <div className="col">
              <h6>Company</h6>
              <ul>
                <li>
                  <a href="#">Events</a>
                </li>
                <li>
                  <a href="#">Speakers</a>
                </li>
                <li>
                  <a href="#">Photos and Videos</a>
                </li>
              </ul>
            </div>
            <div className="col">
              <h6>support</h6>
              <ul>
                <li>
                  <a href="#">contact us</a>
                </li>
                <li>
                  <a href="#">Terms of service</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
            <div className="col">
              <h6>Subscribe</h6>
              <div className="subscribe">
                <input type="text" placeholder="mail" className="p-1"></input>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 18 19"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0.969664 1.46966C0.765936 1.67339 0.69692 1.97581 0.792101 2.24775L6.0421 17.2478C6.14369 17.538 6.41216 17.7368 6.71942 17.7494C7.02668 17.7619 7.31046 17.5856 7.43535 17.3046L10.3182 10.8182L16.8046 7.93535C17.0856 7.81046 17.2619 7.52668 17.2494 7.21942C17.2368 6.91216 17.038 6.64368 16.7478 6.5421L1.74776 1.2921C1.47582 1.19692 1.17339 1.26593 0.969664 1.46966ZM8.85544 10.4161L6.83295 14.9667L3.2936 4.85425L8.85544 10.4161ZM4.35426 3.79359L14.4667 7.33294L9.9161 9.35543L4.35426 3.79359Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* End Footer */}
      </div>

      {/* Role */}
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: role ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        {role && <Role roleCase={handleRoleFromChild}></Role>}
      </div>
    </>
  );
}

function Arrow(props) {
  // eslint-disable-next-line react/prop-types
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        background: "#3296D4",
        height: "30px",
        width: "30px",
        borderRadius: "9px",
        color: "#c9c9c9",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
    />
  );
}
