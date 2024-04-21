import { Image } from "primereact/image";
import React from "react";
import "./style.css";

export default function SpeakerResorses({ speakerResorses }) {
  function getYoutubeId(url) {
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    let match;
    let params = {};
    while ((match = regex.exec(url))) {
      params[match[1]] = match[2];
    }
    return params["v"];
  }

  return (
    <div className="my-2 card-body ">
      <>
        {speakerResorses?.resorsesURL?.includes(".png") ||
        speakerResorses?.resorsesURL?.includes(".jpg") ? (
          <a
            href={speakerResorses.resorsesURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={speakerResorses.resorsesURL}
              className="img-fluid"
              alt="speakerResorses"
              width="120"
            />
          </a>
        ) : speakerResorses?.resorsesURL?.includes(".pdf") ? (
          <a
            href={speakerResorses.resorsesURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image width="120" src="/pdf.png" className="img-fluid" alt="PDF" />
          </a>
        ) : speakerResorses?.link?.includes("youtube.com") ||
          speakerResorses?.link?.includes("youtu.be") ? (
          <a
            href={speakerResorses?.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-100"
          >
            <Image
              src={`https://img.youtube.com/vi/${getYoutubeId(
                speakerResorses.link
              )}/0.jpg`}
              width="120"
              className="img-fluid"
              alt="YouTube Thumbnail"
            />
          </a>
        ) : speakerResorses?.link ? (
          <a
            href={speakerResorses?.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary "
          >
            <i className="fas fa-link py-2 px-3"></i>
            {speakerResorses?.link &&
              speakerResorses?.link.replace(
                /^https?:\/\/(www\.)?|\.com$/gi,
                ""
              )}
          </a>
        ) : (
          <p>No preview available</p>
        )}
      </>
    </div>
  );
}
