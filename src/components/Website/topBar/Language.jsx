import ar from "../../../assets/sudia-arabia-flag.png";
import en from "../../../assets/united-state-flag.png";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Language() {
  // Translation Work
  const { i18n } = useTranslation();
  // console.log(t("key")); // to translate the key to the current language

  //
  const [chosenLang, setChosenLang] = useState({
    img: en,
    name: "english",
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [activeChoice, setActiveChoice] = useState(null);

  function handleChosenClick() {
    setPopupVisible((prevState) => !prevState);
  }

  function handleChoiceClick(imgSrc, langName, option) {
    return () => {
      setChosenLang({ img: imgSrc, name: langName });
      setPopupVisible(false);
      setActiveChoice(option);
      langName === "english" ? i18n.changeLanguage("en") : i18n.changeLanguage("ar");
    };
  }

  return (
    <>
      <div className="chosen" onClick={handleChosenClick}>
        <img src={chosenLang.img} alt="" width="30" height="30" />
        <span>{chosenLang.name}</span>
        <i className={`fa-solid fa-chevron-${popupVisible ? "up" : "down"} fa-xs`}></i>
        <div
          className="chosLang"
          style={{
            top: popupVisible ? "45px" : "-150px",
            left: popupVisible ? "10px" : "-100px",
          }}
        >
          <p>choose language</p>
          <div className="choice">
            <div
              onClick={handleChoiceClick(ar, "العربية", ar)}
              style={{ color: activeChoice === ar ? "#3296D4" : "" }}
            >
              <img
                src={ar}
                alt=""
                width="30"
                height="30"
                style={{
                  border: activeChoice === ar ? "1px solid #3296D4" : "",
                }}
              />
              <p>العربية</p>
            </div>
            <div
              onClick={handleChoiceClick(en, "english", en)}
              style={{ color: activeChoice === en ? "#3296D4" : "" }}
            >
              <img
                src={en}
                alt=""
                width="30"
                height="30"
                style={{
                  border: activeChoice === en ? "1px solid #3296D4" : "",
                }}
              />
              <p>english</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
