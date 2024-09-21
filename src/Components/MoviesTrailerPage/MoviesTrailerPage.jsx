import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import nProgress from "nprogress";
import { Alert } from "@mui/material";

import { useSession } from "../../Contexts/sessionContext";

import { IoArrowBackCircleOutline } from "react-icons/io5";

const MoviesTrailerPage = () => {
  const { apiReadAccessToken } = useSession();
  const { movieID, movieName } = useParams();
  const [trailer, setTrailer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    nProgress.start();
    fetch(`https://api.themoviedb.org/3/movie/${movieID}/videos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const officialTrailer = data.results.find((video) =>
          video.name.includes("Official Trailer")
        );

        if (officialTrailer) {
          setTrailer(officialTrailer);
        } else {
          setTrailer(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching trailer:", error);
      })
      .finally(() => {
        setIsLoading(false);
        nProgress.done();
      });
  }, [movieID]);

  return (
    <div className="trailer-page">
      {!isLoading && trailer ? (
        <>
          <div className="category-results__header mb-4">
            <span className="category-results__title">
              Trailer for {movieName}
            </span>
            <Link to={`/movie/${movieID}/${movieName}`}>
              <IoArrowBackCircleOutline className="category-back__icon" />
            </Link>
          </div>
          <iframe
            className="trailer-wrapper"
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={trailer.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </>
      ) : (
        <Alert className="text-error" variant="filled" severity="error">
          تریلری برای این فیلم وجود ندارد
        </Alert>
      )}
    </div>
  );
};

export default MoviesTrailerPage;
