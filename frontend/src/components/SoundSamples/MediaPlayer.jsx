import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getSoundsampleFile } from "../../services/soundSampleService";

export default function MediaPlayer({soundSample}){
    
    if (soundSample === null) {
        return null;
    }

    // Check if link or file
    if (soundSample.includes("https://")){
        return <FindLinkType link={soundSample}/>
    } else {
        // Find the type of file: (mp4, mov, webm)
        return <FindFileType fileName={soundSample}/>;
    }
}

// Find the type of link: (YouTube, Instagram, X, Facebook, TikTok)
function FindLinkType({link}){
    const {t} = useTranslation();
    if (link.includes("youtu")) {
        const ytLink = getYtId(link);
        if (!ytLink) {
            return <p className="text-sm text-text-error">{"YouTube " + t("link not supported")}</p>;
        }
        return (
            <iframe
                className="w-full aspect-video"
                src={"https://www.youtube.com/embed/" + ytLink}
                title="YouTube sample"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
            />
        );
        
    } else if (link.includes("instagram.com")) { //Somewhat functional instagram viewer
        const instaURL = getInstaEmbedUrl(link);
        if(!instaURL){
            return <p className="text-sm text-text-error">{"Instagram " + t("link not supported")}</p>;
        }

        return(
            <iframe
                className={`h-190 w-full max-w-[560px]`}
                src={instaURL}
                title="Instagram sample"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
            />
        )
        
    } else if (link.includes("x.com") || link.includes("twitter.com")) {
        console.log("Rendering X embed for:", link);
        //return <XEmbed url={link}/>;
        return <XEmbed url={link}/>;;

    } else if (link.includes("facebook.com")) {
        const fbEmbed = getFbEmbedUrl(link);
        if(!fbEmbed){
            return <p className="text-sm text-text-error">{"Facebook " + t("link not supported")}</p>;
        }
        return (
            <iframe
                src={fbEmbed}
                title="Facebook sample"
                className="w-full h-175"
                allow="encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
            />
        )

    } else if (link.includes("tiktok.com")) {
        const url = link.slice(0, link.indexOf("?"));
        return <TikTokEmbed url={url}/>;
    }

    // If sound sample is not found -> return not found 
    return <p className="text-sm text-text-error">{t("sound sample") + " " + t("not found") + `: ${link}`}</p>;
}

// --- Function to check if the URL is a YouTube link and get the video ID ---
function getYtId(u) {
    try {
        var x = new URL(u); // Tries to read the link as a real URL.
        
        // If it's a short YouTube link like https://youtu.be/abcd
        if (x.hostname.indexOf("youtu.be") !== -1) {
            // Split after the "/" and get the video ID part.
            var parts = x.pathname.split("/").filter(Boolean);
            return parts[0] || null;
        }

        if (u.includes("youtube.com/shorts")) {
            return u.slice(u.lastIndexOf("/") + 1);
        }

        // If it's a normal YouTube link like youtube.com/watch?v=abcd
        if (x.hostname.indexOf("youtube.com") !== -1) {
            return x.searchParams.get("v"); // Get the value of the "v" parameter (the video ID).
        }
    } catch (e) {} // If something goes wrong, just ignore it.
    return null; // If no ID is found, return null.
}

//sets up instagram embed url
function getInstaEmbedUrl(u) {
    try{
        //defines the url
        const url = new URL(u);

        //makes sure it is an instagram url
        if (url.hostname.indexOf("instagram.com")=== -1) return null;

        //removes and replaces any values from the url so make it a proper embed link
        let pathname = url.pathname.split("?")[0].split("#")[0].replace(/\/$/, "");

        //if pathname already has /embed in the end then return it
        if (pathname.endsWith("/embed")){
            return url.origin + pathname;
        }

        //return the link with /embed at the end
        return url.origin + pathname + "/embed";
    } catch (e) {
        console.error("Invalid Instagram URL", e);
        return null;
    }
}

//sets up X embeds
function XEmbed({ url }) {
  const containerRef = useRef(null);

  //normalize the url so x urls become twitter urls
  let normalizedUrl = url;
  try {
    const u = new URL(url);
    if (u.hostname === "x.com" || u.hostname === "www.x.com") {
      u.hostname = "twitter.com";
      normalizedUrl = u.toString();
    }
  } catch (err) {
    console.warn("Invalid X/Twitter URL:", url, err);
  }

  //useEffect to set of media container
  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    //X embed widget path
    const scriptSrc = "https://platform.twitter.com/widgets.js";

    //function to load the widget
    function loadWidget() {
      if (!window.twttr || !window.twttr.widgets || !containerRef.current) return;

      // if mediaplayer is already loaded, dont reload it
      if (containerRef.current.getAttribute("data-tweet-rendered") === "true") {
        return;
      }
      containerRef.current.setAttribute("data-tweet-rendered", "true");

      //define the link id from the normalized url
      const linkId = normalizedUrl.split("/").pop().split("?")[0];

      //set up the media player widget using the linkId and the container
      window.twttr.widgets.createTweet(linkId, containerRef.current, {
        align: "center",
      });
    }

    //test if the widget script is inserted, if not insert it, else just load the widget
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.charset = "utf-8";
      script.onload = loadWidget;
      document.body.appendChild(script);
    } else {
      loadWidget();
    }

    //end out with removing the attributes from the container, so its reset for future link inserstions which are not X
    return () => {
      if (containerRef.current) {
        containerRef.current.removeAttribute("data-tweet-rendered");
      }
    };
  }, [normalizedUrl]);

  //return the widget
  return (
    <div
      ref={containerRef}
      style={{ maxWidth: "100%" }}
      data-media-max-width="400"
    />
  );
}



// Setup TikTok embeds
function TikTokEmbed({ url }) {
    const {t} = useTranslation();
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return (
        <blockquote 
            className="tiktok-embed transform -translate-y-5"
            cite={url}
            data-video-id={url.split('/').pop()}
        >
            <a href={url}>{t("loading")} TikTok...</a>
        </blockquote>
    );
}

//function to get fb embed
function getFbEmbedUrl(u){
    try{
        //create new url using u
        const url = new URL(u);

        //check if url is a facebook url if not return null
        if(!url.hostname.includes("facebook.com")) return null;

        //collect the encoded part of the url
        const encoded = encodeURIComponent(url.toString());

        //insert the encoded part into links including video
        if(url.pathname.includes("/videos/") || url.searchParams.get("v")){
            return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=0&width=560&height=400`;
        }

        //insert the encoded part into posts (mainly shorts)
        return `https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=0&width=560&height=400`;
    } catch (err) {
        console.error("Invalid FB URL", err);
        return null;
    }
}


function FindFileType({ fileName }) {
    const {t} = useTranslation();
    const [filePath, setFilePath] = useState(null);
    const [fileType, setFileType] = useState(null); // "video" | "audio" | "link" | null
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try{
                setError(null);
                setFilePath(null);
                setFileType(null);

                const path = await getSoundsampleFile(fileName);
                if (cancelled) return;

                let type = "other";
                if (/\.(mp4|webm|mov|m4v)(\?.*)?$/.test(path)) {
                    type = "video";
                } else if (/\.(mp3|wav|ogg|m4a|flac)(\?.*)?$/.test(path)) {
                    type = "audio";
                }

                setFilePath(path);
                setFileType(type);
            } catch (err) {
                if(!cancelled) {
                    console.error(err);
                    setError(t("noFile") + fileName);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [fileName]);

    if(error) {
        return <p className="text-red-600 text-sm">{error}</p>;
    }

    if (!filePath || !fileType){
        return <p className="text-sm text-gray-500">{`${t("loading")} ${t("file")}...`}</p>;
    }
    
    // --- Check if it's a video file by seeing if the URL ends in .mp4, .webm, .mov, etc ---
    if (fileType === "video") {
        return (
            <video
                className="aspect-video"
                src={filePath}
                controls
                preload="metadata"
                onError={function(){ console.error("Video failed:", filePath); }} // Logs error if video can't play
            />
        );
    }

    // --- Check if it's an audio file like .mp3, .wav, .ogg, etc ---
    if (fileType === "audio") {
        return (
            <audio
                className="aspect-video"
                src={filePath}
                controls
                preload="metadata"
                onError={function(){ console.error("Audio failed:", filePath); }} // Logs error if audio can't play
            />
        );
    }

    // if it's not a file return not supported
    return <p className="text-sm text-gray-700">{t("supportFile")}</p>;
}