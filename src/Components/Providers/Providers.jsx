import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";
import { useSession } from "../../Contexts/sessionContext";
import { IoIosClose } from "react-icons/io";

import "./Providers.css";

function Providers({
  media,
  setShowProvidersModal,
  mediaId,
  mediaDetails,
}) {
  const { apiReadAccessToken } = useSession();
  const [tvProviders, setTvProviders] = useState({});
  const [movieProviders, setMovieProviders] = useState({});
  const [loading, setLoading] = useState(true);

  const getAllSeasonProviders = () => {
    fetch(
      `https://api.themoviedb.org/3/tv/${mediaId}/watch/providers`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiReadAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((providersData) => {
        console.log(providersData);

        setTvProviders(providersData.results ? providersData.results.US : null);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error rating movie:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllProvidersMovie = () => {
    fetch(`https://api.themoviedb.org/3/movie/${mediaId}/watch/providers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiReadAccessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((providersData) => {
        setMovieProviders(
          providersData.results ? providersData.results.US : null
        );
      })
      .catch((error) => {
        console.error("Error fetching providers:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (media === "movie") {
      getAllProvidersMovie();
    } else {
      getAllSeasonProviders();
    }
  }, [mediaId]);

  // Custom Header
  const customHeader = (
    <>
      <IoIosClose
        className="modal-container-close-icon"
        onClick={() => setShowProvidersModal(false)}
      />
      <h1 className="modal-container-title">Providers</h1>
    </>
  );

  // Custom Body
  const customBody =
    media === "tv" ? (
      <>
        {loading ? (
          <span className="loading-icon"></span>
        ) : (
          <div className="providers_wrapper">
            {tvProviders ? (
              <Link
                title={`Watch ${mediaDetails.name} on TMDB`}
                target="_blank"
                to={tvProviders.link}
              >
                <img
                  className="provider_img"
                  src="/images/logo/tmdb-logo.svg"
                  alt="Provider Img"
                />
              </Link>
            ) : (
              <p>در حال حاضر برای این سریال providerای وجود ندارد</p>
            )}
          </div>
        )}
        {/* {tvProviders && (
          <p className="justwatch-text">
            Streaming information provided by{" "}
            <a
              href="https://www.justwatch.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              JustWatch
            </a>
          </p>
        )} */}
      </>
    ) : (
      <>
        {loading ? (
          <span className="loading-icon"></span>
        ) : (
          <div className="providers_wrapper">
            {movieProviders ? (
              <Link
                title={`Watch ${mediaDetails.title} on TMDB`}
                target="_blank"
                to={movieProviders.link}
              >
                <img
                  className="provider_img"
                  src="/images/logo/tmdb-logo.svg"
                  alt="Provider Img"
                />
              </Link>
            ) : (
              <p>در حال حاضر برای این فیلم providerای وجود ندارد</p>
            )}
          </div>
        )}
        {/* {movieProviders && (
        <p className="justwatch-text">
          Streaming information provided by{" "}
          <a
            href="https://www.justwatch.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            JustWatch
          </a>
        </p>
      )} */}
      </>
    );

  // media === "tv" ? (
  //   <>
  //     {loading ? (
  //       <span className="loading-icon"></span>
  //     ) : (
  //       <div className="providers_wrapper">
  //         {tvProviders.length ? (
  //           tvProviders.flatrate.map((p) => (
  //             <Link
  //               key={p.provider_id}
  //               title={`Watch ${mediaDetails.name} on ${p.provider_name}`}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               to={tvProviders.link}
  //             >
  //               <img
  //                 className="provider_img"
  //                 src={`https://media.themoviedb.org/t/p/original/${p.logo_path}`}
  //                 alt={`${p.provider_name}`}
  //               />
  //             </Link>
  //           ))
  //         ) : (
  //           <p>در حال حاضر برای این قسمت از سریال providerای وجود ندارد</p>
  //         )}
  //       </div>
  //     )}
  //     {tvProviders.length && (
  //       <p className="justwatch-text">
  //         Streaming information provided by{" "}
  //         <a
  //           href="https://www.justwatch.com"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           JustWatch
  //         </a>
  //       </p>
  //     )}
  //   </>
  // ) : (
  //   <>
  //     {loading ? (
  //       <span className="loading-icon"></span>
  //     ) : (
  //       <div className="providers_wrapper">
  //         {movieProviders ? (
  //           movieProviders.buy.map((p) => (
  //             <Link
  //               key={p.provider_id}
  //               title={`Watch ${mediaDetails.title} on ${p.provider_name}`}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               to={movieProviders.link}
  //             >
  //               <img
  //                 className="provider_img"
  //                 src={`https://media.themoviedb.org/t/p/original/${p.logo_path}`}
  //                 alt={`${p.provider_name}`}
  //               />
  //             </Link>
  //           ))
  //         ) : (
  //           <p>در حال حاضر برای این فیلم providerای وجود ندارد</p>
  //         )}
  //       </div>
  //     )}
  //     {movieProviders.length && (
  //       <p className="justwatch-text">
  //         Streaming information provided by{" "}
  //         <a
  //           href="https://www.justwatch.com"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           JustWatch
  //         </a>
  //       </p>
  //     )}
  //   </>
  // );

  // Custom Footer
  const customFooter = (
    <button
      className="rate-button"
      onClick={() => setShowProvidersModal(false)}
    >
      بستن
    </button>
  );

  return (
    <Modal
      headerContent={customHeader}
      bodyContent={customBody}
      footerContent={customFooter}
      setShowModal={setShowProvidersModal}
    />
  );
}

export default Providers;
