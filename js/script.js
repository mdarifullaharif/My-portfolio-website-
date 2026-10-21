/* =========================================
   Md Arifullah (Arif) - Portfolio
   Custom JavaScript
========================================= */

(function () {
    "use strict";

    // Mark that JavaScript is running (used by animation.css)
    document.documentElement.classList.add("js");

    /* ---------- Typing effect ---------- */
    var typingEl = document.querySelector(".typing");

    if (typingEl) {
        var roles = [
            "Front-End Developer",
            "Web Designer",
            "WordPress Developer"
        ];

        if (typeof Typed !== "undefined") {
            new Typed(".typing", {
                strings: roles,
                typeSpeed: 60,
                backSpeed: 35,
                backDelay: 1500,
                loop: true
            });
        } else {
            // Fallback if the Typed.js CDN is unavailable
            typingEl.textContent = roles[0];
        }
    }

    /* ---------- Mobile menu ---------- */
    var menuToggle = document.getElementById("menu-toggle");
    var navMenu = document.getElementById("nav-menu");

    function setMenu(open) {
        navMenu.classList.toggle("active", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute(
            "aria-label",
            open ? "Close navigation menu" : "Open navigation menu"
        );

        var icon = menuToggle.querySelector("i");
        icon.classList.toggle("fa-bars", !open);
        icon.classList.toggle("fa-xmark", open);
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            setMenu(!navMenu.classList.contains("active"));
        });

        // Close menu after clicking a link
        navMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                setMenu(false);
            });
        });

        // Close menu with Escape key
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && navMenu.classList.contains("active")) {
                setMenu(false);
                menuToggle.focus();
            }
        });

        // Reset when resizing to desktop
        window.addEventListener("resize", function () {
            if (window.innerWidth > 900) {
                setMenu(false);
            }
        });
    }

    /* ---------- Header shadow on scroll ---------- */
    var header = document.querySelector("header");

    function onScroll() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 20);
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Scroll reveal ---------- */
    var revealEls = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        revealEls.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add("active");
        });
    }

    /* ---------- Active nav link on scroll ---------- */
    var sections = document.querySelectorAll("main section[id]");
    var navLinks = document.querySelectorAll(".nav-menu a");

    if ("IntersectionObserver" in window && sections.length) {
        var spy = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        navLinks.forEach(function (link) {
                            link.classList.toggle(
                                "active",
                                link.getAttribute("href") === "#" + entry.target.id
                            );
                        });
                    }
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );

        sections.forEach(function (section) {
            spy.observe(section);
        });
    }

    /* ---------- Contact form validation ----------
       Checks every field in the browser and shows a clear
       error under the field. There is no backend yet, so after a
       successful check the form opens the visitor's email app with
       the message pre-filled. */
    var form = document.getElementById("contact-form");

    if (form) {
        // Use our own messages instead of the browser's default popups
        form.setAttribute("novalidate", "");

        // ---- Formspree setup ----
        // Create a free form at https://formspree.io, then replace
        // YOUR_FORM_ID below with your form's ID (e.g. "xyzabcde").
        var FORM_ENDPOINT = "https://formspree.io/f/xjygneoa";
        var CONTACT_EMAIL = "mdarifullaharif1999@gmail.com";

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        // Rules for each field: returns an error text, or "" when valid
        var rules = {
            name: function (v) {
                if (!v) return "Please enter your name.";
                if (v.length < 3) return "Name must be at least 3 characters.";
                if (v.length > 60) return "Name is too long (max 60 characters).";
                return "";
            },
            email: function (v) {
                if (!v) return "Please enter your email address.";
                if (!emailPattern.test(v)) return "Please enter a valid email (e.g. name@example.com).";
                return "";
            },
            subject: function (v) {
                if (!v) return "Please enter a subject.";
                if (v.length < 3) return "Subject must be at least 3 characters.";
                if (v.length > 100) return "Subject is too long (max 100 characters).";
                return "";
            },
            message: function (v) {
                if (!v) return "Please write your message.";
                if (v.length < 10) return "Message must be at least 10 characters.";
                if (v.length > 1000) return "Message is too long (max 1000 characters).";
                return "";
            }
        };

        var fields = Object.keys(rules).map(function (key) {
            return form.elements[key];
        });

        // Create an error line under every field
        fields.forEach(function (field) {
            var error = document.createElement("small");
            error.className = "field-error";
            error.id = field.id + "-error";
            error.setAttribute("aria-live", "polite");
            field.parentNode.appendChild(error);
            field.setAttribute("aria-describedby", error.id);
        });

        // Hidden spam-trap field (bots fill it in, people never see it)
        var honeypot = document.createElement("input");
        honeypot.type = "text";
        honeypot.name = "_gotcha";
        honeypot.tabIndex = -1;
        honeypot.setAttribute("autocomplete", "off");
        honeypot.setAttribute("aria-hidden", "true");
        honeypot.style.display = "none";
        form.appendChild(honeypot);

        // Overall status line (success / failure)
        var status = document.createElement("p");
        status.className = "form-status";
        status.setAttribute("role", "status");
        form.appendChild(status);

        function validateField(field) {
            var message = rules[field.name](field.value.trim());
            var error = document.getElementById(field.id + "-error");

            error.textContent = message;
            field.classList.toggle("invalid", message !== "");
            field.classList.toggle("valid", message === "");
            field.setAttribute("aria-invalid", String(message !== ""));

            return message === "";
        }

        fields.forEach(function (field) {
            // Check when the visitor leaves the field
            field.addEventListener("blur", function () {
                validateField(field);
            });

            // After an error is shown, re-check while typing
            field.addEventListener("input", function () {
                if (field.classList.contains("invalid")) {
                    validateField(field);
                }
                status.textContent = "";
                status.className = "form-status";
            });
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            var firstInvalid = null;

            fields.forEach(function (field) {
                if (!validateField(field) && !firstInvalid) {
                    firstInvalid = field;
                }
            });

            if (firstInvalid) {
                status.textContent = "Please fix the highlighted fields.";
                status.className = "form-status error";
                firstInvalid.focus();
                return;
            }

            var name = form.elements["name"].value.trim();
            var email = form.elements["email"].value.trim();
            var subject = form.elements["subject"].value.trim();
            var message = form.elements["message"].value.trim();

            function resetForm() {
                form.reset();
                fields.forEach(function (field) {
                    field.classList.remove("invalid", "valid");
                    field.removeAttribute("aria-invalid");
                    document.getElementById(field.id + "-error").textContent = "";
                });
            }

            // Spam trap: real visitors never fill this hidden field
            if (honeypot.value) {
                resetForm();
                return;
            }

            // Formspree not set up yet -> fall back to the visitor's email app
            if (FORM_ENDPOINT.indexOf("YOUR_FORM_ID") !== -1) {
                var body =
                    "Name: " + name + "\n" +
                    "Email: " + email + "\n\n" +
                    message;

                window.location.href =
                    "mailto:" + CONTACT_EMAIL +
                    "?subject=" + encodeURIComponent(subject) +
                    "&body=" + encodeURIComponent(body);

                status.textContent = "Opening your email app to send the message...";
                status.className = "form-status success";
                resetForm();
                return;
            }

            // Send the message straight to Formspree
            var submitBtn = form.querySelector('button[type="submit"]');
            var btnText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
            status.textContent = "";
            status.className = "form-status";

            fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    _subject: subject
                })
            })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("Request failed");
                    }
                    status.textContent =
                        "Thank you! Your message has been sent. I'll get back to you soon.";
                    status.className = "form-status success";
                    resetForm();
                })
                .catch(function () {
                    status.textContent =
                        "Sorry, your message could not be sent. Please try again, or email me at " +
                        CONTACT_EMAIL + ".";
                    status.className = "form-status error";
                })
                .then(function () {
                    submitBtn.disabled = false;
                    submitBtn.textContent = btnText;
                });
        });
    }
})();