/* =========================================================
   ONAM'26
   PERFORMANCE OPTIMIZED INTERACTIONS
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const cursor =
    document.querySelector(".custom-cursor");

const cursorRing =
    document.querySelector(".cursor-ring");

const mouseGlow =
    document.querySelector(".mouse-glow");

const cards =
    document.querySelectorAll(".team-card");

const photoFrame =
    document.querySelector(".group-photo-frame");

const photo =
    document.querySelector(".group-photo");

const scrollButton =
    document.querySelector(".scroll-indicator");

const backToTop =
    document.querySelector("#backToTop");


/* =========================================================
   CURSOR VARIABLES
========================================================= */

let mouseX =
    window.innerWidth / 2;

let mouseY =
    window.innerHeight / 2;

let ringX =
    mouseX;

let ringY =
    mouseY;


/* =========================================================
   MOUSE POSITION
========================================================= */

document.addEventListener(
    "mousemove",
    (event) => {

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;

    },
    {
        passive: true
    }
);


/* =========================================================
   CUSTOM CURSOR
========================================================= */

function updateCursor() {
    if (!cursor) {
        return;
    }

    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    if (cursorRing) {
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    }

    requestAnimationFrame(updateCursor);
}

updateCursor();


/* =========================================================
   INTERACTIVE ELEMENTS
========================================================= */

const interactiveElements =
    document.querySelectorAll(
        "a, .social, .back-to-top, button"
    );


interactiveElements.forEach(
    (element) => {

        element.addEventListener(
            "mouseenter",
            () => {

                document.body.classList.add(
                    "cursor-hover"
                );

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                document.body.classList.remove(
                    "cursor-hover"
                );

            }
        );

    }
);


/* =========================================================
   MOUSE GLOW
========================================================= */

let glowPending =
    false;


document.addEventListener(
    "mousemove",
    () => {

        if (glowPending) {
            return;
        }

        glowPending =
            true;


        requestAnimationFrame(
            () => {

                if (mouseGlow) {

                    mouseGlow.style.left =
                        mouseX + "px";

                    mouseGlow.style.top =
                        mouseY + "px";

                    mouseGlow.style.opacity =
                        "1";

                }

                glowPending =
                    false;

            }
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   TEAM CARD 3D EFFECT
========================================================= */

cards.forEach(
    (card) => {

        card.addEventListener(
            "mouseenter",
            () => {

                document.body.classList.add(
                    "cursor-card"
                );

            }
        );


        card.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;


                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;


                const rotateX =
                    ((centerY - y) /
                    centerY) * 3;

                const rotateY =
                    ((x - centerX) /
                    centerX) * 3;


                const percentX =
                    (x / rect.width) * 100;

                const percentY =
                    (y / rect.height) * 100;


                card.style.transform =
                    `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-5px)
                    `;


                card.style.setProperty(
                    "--mouse-x",
                    percentX + "%"
                );


                card.style.setProperty(
                    "--mouse-y",
                    percentY + "%"
                );


                card.style.setProperty(
                    "--image-x",
                    ((percentX - 50) * -0.05) + "px"
                );


                card.style.setProperty(
                    "--image-y",
                    ((percentY - 50) * -0.05) + "px"
                );

            },
            {
                passive: true
            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                document.body.classList.remove(
                    "cursor-card"
                );


                card.style.transform =
                    "";


                card.style.setProperty(
                    "--image-x",
                    "0px"
                );


                card.style.setProperty(
                    "--image-y",
                    "0px"
                );

            }
        );

    }
);


/* =========================================================
   GROUP PHOTO PARALLAX
========================================================= */

if (
    photoFrame &&
    photo
) {

    photoFrame.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                photoFrame.getBoundingClientRect();


            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;


            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;


            photo.style.transform =
                `
                scale(1.018)
                translate(
                    ${x * -8}px,
                    ${y * -6}px
                )
                `;

        },
        {
            passive: true
        }
    );


    photoFrame.addEventListener(
        "mouseleave",
        () => {

            photo.style.transform =
                "";

        }
    );

}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".reveal"
    );


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );


                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(
    (element) => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   SMOOTH SCROLL TO TEAM
========================================================= */

if (scrollButton) {

    scrollButton.addEventListener(
        "click",
        (event) => {

            const team =
                document.querySelector(
                    "#team"
                );


            if (!team) {
                return;
            }


            event.preventDefault();


            team.scrollIntoView({
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   SOCIAL BUTTONS
========================================================= */

const socialButtons =
    document.querySelectorAll(
        ".social"
    );


socialButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

            }
        );

    }
);


/* =========================================================
   BACK TO TOP
========================================================= */

if (backToTop) {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   TOUCH DEVICES
========================================================= */

if (
    window.matchMedia(
        "(pointer: coarse)"
    ).matches
) {

    document.body.style.cursor =
        "auto";


    if (cursor) {

        cursor.style.display =
            "none";

    }


    if (mouseGlow) {

        mouseGlow.style.display =
            "none";

    }

}


/* =========================================================
   MEMORY GALLERY
========================================================= */

const galleryItems =
    document.querySelectorAll(
        ".gallery-item"
    );

const lightbox =
    document.querySelector(
        "#lightbox"
    );

const lightboxImage =
    document.querySelector(
        "#lightboxImage"
    );

const lightboxClose =
    document.querySelector(
        "#lightboxClose"
    );

const lightboxPrev =
    document.querySelector(
        "#lightboxPrev"
    );

const lightboxNext =
    document.querySelector(
        "#lightboxNext"
    );

const lightboxCounter =
    document.querySelector(
        "#lightboxCounter"
    );


let currentGalleryIndex =
    0;


/* =========================================================
   OPEN LIGHTBOX
========================================================= */

function openLightbox(index) {

    if (
        !galleryItems.length ||
        !lightbox ||
        !lightboxImage
    ) {
        return;
    }


    currentGalleryIndex =
        index;


    const item =
        galleryItems[currentGalleryIndex];


    if (!item) {
        return;
    }


    const image =
        item.querySelector("img");


    if (!image) {
        return;
    }


    lightboxImage.src =
        image.src;


    lightboxImage.alt =
        image.alt || "Onam'26 Memory";


    updateLightboxCounter();


    lightbox.classList.add(
        "active"
    );


    document.body.classList.add(
        "lightbox-open"
    );

}


/* =========================================================
   CLOSE LIGHTBOX
========================================================= */

function closeLightbox() {

    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "active"
    );


    document.body.classList.remove(
        "lightbox-open"
    );


    if (lightboxImage) {

        lightboxImage.src =
            "";

    }

}


/* =========================================================
   UPDATE COUNTER
========================================================= */

function updateLightboxCounter() {

    if (!lightboxCounter) {
        return;
    }


    const current =
        String(
            currentGalleryIndex + 1
        ).padStart(
            2,
            "0"
        );


    const total =
        String(
            galleryItems.length
        ).padStart(
            2,
            "0"
        );


    lightboxCounter.textContent =
        `${current} / ${total}`;

}


/* =========================================================
   SHOW PREVIOUS IMAGE
========================================================= */

function showPreviousImage() {

    if (!galleryItems.length) {
        return;
    }


    currentGalleryIndex--;

    
    if (
        currentGalleryIndex < 0
    ) {

        currentGalleryIndex =
            galleryItems.length - 1;

    }


    updateLightboxImage();

}


/* =========================================================
   SHOW NEXT IMAGE
========================================================= */

function showNextImage() {

    if (!galleryItems.length) {
        return;
    }


    currentGalleryIndex++;


    if (
        currentGalleryIndex >=
        galleryItems.length
    ) {

        currentGalleryIndex =
            0;

    }


    updateLightboxImage();

}


/* =========================================================
   UPDATE LIGHTBOX IMAGE
========================================================= */

function updateLightboxImage() {

    const item =
        galleryItems[currentGalleryIndex];


    if (!item || !lightboxImage) {
        return;
    }


    const image =
        item.querySelector("img");


    if (!image) {
        return;
    }


    lightboxImage.style.opacity =
        "0";


    setTimeout(
        () => {

            lightboxImage.src =
                image.src;

            lightboxImage.alt =
                image.alt || "Onam'26 Memory";


            lightboxImage.style.opacity =
                "1";


            updateLightboxCounter();

        },
        120
    );

}


/* =========================================================
   GALLERY ITEM CLICK
========================================================= */

galleryItems.forEach(
    (item, index) => {

        item.addEventListener(
            "click",
            () => {

                openLightbox(index);

            }
        );


        item.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Enter" ||
                    event.key ===
                    " "
                ) {

                    event.preventDefault();

                    openLightbox(index);

                }

            }
        );

    }
);


/* =========================================================
   LIGHTBOX CONTROLS
========================================================= */

if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            closeLightbox();

        }
    );

}


if (lightboxPrev) {

    lightboxPrev.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            showPreviousImage();

        }
    );

}


if (lightboxNext) {

    lightboxNext.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            showNextImage();

        }
    );

}


/* =========================================================
   CLICK OUTSIDE IMAGE TO CLOSE
========================================================= */

if (lightbox) {

    lightbox.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            !lightbox ||
            !lightbox.classList.contains(
                "active"
            )
        ) {
            return;
        }


        switch (event.key) {

            case "Escape":

                closeLightbox();

                break;


            case "ArrowLeft":

                showPreviousImage();

                break;


            case "ArrowRight":

                showNextImage();

                break;

        }

    }
);


/* =========================================================
   PREVENT BACKGROUND SCROLL WHEN LIGHTBOX IS OPEN
========================================================= */

document.addEventListener(
    "wheel",
    (event) => {

        if (
            lightbox &&
            lightbox.classList.contains(
                "active"
            )
        ) {

            if (
                event.target ===
                lightbox
            ) {

                event.preventDefault();

            }

        }

    },
    {
        passive: false
    }
);


/* =========================================================
   IMAGE LOAD ERROR HANDLING
========================================================= */

document.querySelectorAll(
    "img"
).forEach(
    (image) => {

        image.addEventListener(
            "error",
            () => {

                image.classList.add(
                    "image-error"
                );

            }
        );

    }
);


/* =========================================================
   PAGE LOAD
========================================================= */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "page-loaded"
        );

    }
);