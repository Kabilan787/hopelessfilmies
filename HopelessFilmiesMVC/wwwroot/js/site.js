$(document).ready(function () {
    // --- Mobile Menu Toggle ---
    const $mobileMenuToggle = $('#mobileMenuToggle');
    const $mainNavMenu = $('#mainNavMenu');

    if ($mobileMenuToggle.length && $mainNavMenu.length) {
        $mobileMenuToggle.on('click', function () {
            $mainNavMenu.toggleClass('active');
        }); 

        // Close menu when a nav link is clicked
        $mainNavMenu.find('.nav-link').on('click', function () {
            if ($mainNavMenu.hasClass('active')) {
                $mainNavMenu.removeClass('active');
            }
        });
    } else {
        console.error("Mobile menu elements not found. Check IDs: 'mobileMenuToggle', 'mainNavMenu'.");
    }

    

    const $signInBtn = $('#signInBtn');

    function updateSignInButtonText() {
        // Read the server-rendered 'data-signed-in' attribute
        // This value is true or false based on the server's knowledge
        const isSignedIn = $signInBtn.data('signed-in') === true; // Ensure strict comparison to true boolean

        // The text is already set by Razor on initial load, but this function
        // could be useful if you had other client-side events that needed to
        // dynamically change the button text without a page reload (less common for auth buttons).
        // For now, it mostly confirms the data attribute is correctly read.
        $signInBtn.text(isSignedIn ? 'Sign Out' : 'Sign In');
    }

    $signInBtn.on('click', function () {
        // Read the current state from the data attribute that was set by the server
        const isSignedIn = $(this).data('signed-in') === true;

        if (isSignedIn) {
            // Redirect to the server-side SignOut route
            // No returnUrl typically needed for logout as it often goes to home/login page
            window.location.href = '/Account/SignOut';
        } else {
            // Redirect to the server-side SignIn route, passing current URL as returnUrl
            window.location.href = '/Account/SignIn';  //?returnUrl=' + encodeURIComponent(window.location.href);
        }
    });

    function attachWatchLinkHandlers() {
        // Check sign-in status from the Razor-rendered data attribute
        const isUserSignedIn = $('#signInBtn').data('signed-in') === true;

        // Attach click handler to all "watch-link" anchors
        $('.watch-link').off('click').on('click', function (event) {
            if (!isUserSignedIn) {
                event.preventDefault(); // Block the link from navigating

                // Redirect to SignIn page with a custom message in the query string
                const message = encodeURIComponent("Please sign in to watch our films");
                window.location.href = `/Account/SignIn?message=${message}`;
            }
            // If user is signed in, link works as usual
        });
    }


    // Call this on document ready to ensure it runs after the DOM is fully loaded.
    // It will pick up the 'data-signed-in' attribute set by Razor.
    $(document).ready(function () {
        updateSignInButtonText();
        attachWatchLinkHandlers();
    });

    // --- Team Members Carousel ---
    let currentIndex = 0; // Tracks the currently displayed member

    // Function to update carousel display
    function updateCarousel() {
        const $carouselInner = $('#carouselInner');
        const $carouselItems = $carouselInner.find('.carousel-item');
        const $prevMemberBtn = $('#prevMemberBtn');
        const $nextMemberBtn = $('#nextMemberBtn');

        if ($carouselInner.length === 0 || $carouselItems.length === 0) {
            console.warn("Carousel elements not found. Cannot update carousel.");
            return;
        }

        const offset = -currentIndex * 100;
        $carouselInner.css('transform', `translateX(${offset}%)`);

        // Disable/enable arrows at the ends
        $prevMemberBtn.prop('disabled', currentIndex === 0);
        $nextMemberBtn.prop('disabled', currentIndex === $carouselItems.length - 1);
    }

    // Navigation functions
    function showNextMember() {
        const $carouselInner = $('#carouselInner');
        const $carouselItems = $carouselInner.find('.carousel-item');
        if (currentIndex < $carouselItems.length - 1) {
            currentIndex++;
        }
        updateCarousel();
    }

    function showPrevMember() {
        if (currentIndex > 0) {
            currentIndex--;
        }
        updateCarousel();
    }

    // Event listeners for navigation buttons
    function initializeCarousel() {
        const $prevMemberBtn = $('#prevMemberBtn');
        const $nextMemberBtn = $('#nextMemberBtn');

        $prevMemberBtn.off('click').on('click', showPrevMember);
        $nextMemberBtn.off('click').on('click', showNextMember);
        updateCarousel(); // Initial display
    }
    initializeCarousel();
    // --- Interactive Social Links (JavaScript-driven) ---
    const $socialLinks = $('.social-links .social-link');

    $socialLinks.each(function () {
        const $this = $(this);
        const originalColor = $this.css('color') || '#f0f0f0'; // Default if not explicitly set in CSS

        $this.on('mouseenter', function () {
            $this.css('transform', 'scale(1.2)'); // Enlarge on hover
            // Set specific colors based on class
            if ($this.hasClass('facebook')) {
                $this.css('color', '#3b5998'); // Facebook blue
            } else if ($this.hasClass('instagram')) {
                $this.css('color', '#C13584'); // Instagram pink/purple
            } else if ($this.hasClass('twitter')) {
                $this.css('color', '#1DA1F2'); // Twitter blue
            } else {
                $this.css('color', '#FFD700'); // Generic gold for others
            }
        }).on('mouseleave', function () {
            $this.css('transform', 'scale(1)'); // Revert size
            $this.css('color', originalColor); // Revert to original color
        });
    });

    function displayMessage(message, type) {
        const $popup = $('#contactPopup');
        $popup.removeClass('success error show').addClass(type).text(message).addClass('show');

        setTimeout(() => {
            $popup.removeClass('show');
        }, 4000);
    }

    $('#contactForm').on('submit', function (event) {
        event.preventDefault();

        const $form = $(this);
        const name = $form.find('input[name="name"]').val().trim();
        const email = $form.find('input[name="email"]').val().trim();
        const message = $form.find('textarea[name="message"]').val().trim();

        if (!name || !email || !message) {
            displayMessage("Please fill in all fields.", "error");
            return;
        }

        $.ajax({
            url: '/Contact/Submit',
            method: 'POST',
            data: {
                name: name,
                email: email,
                message: message
            },
            success: function () {
                displayMessage(`Thank you ${name} for contacting us!`, "success");
                $form[0].reset();
            },
            error: function () {
                displayMessage("Something went wrong. Please try again.", "error");
            }
        });
    });


    // --- Custom Message Display Function (replaces alert()) ---
    function displayMessage(message, type = 'info') {
        const $messageBox = $('<div>')
            .addClass('message-box ' + type)
            .text(message);

        // Basic styling for the message box (could be moved to CSS for more control)
        $messageBox.css({
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '15px 25px',
            borderRadius: '8px',
            zIndex: '10000', // Ensure it's above everything
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
            opacity: '0', // Start invisible
            pointerEvents: 'none' // Don't block clicks
        });

        if (type === 'success') {
            $messageBox.css('backgroundColor', '#28a745'); // Green
        } else if (type === 'error') {
            $messageBox.css('backgroundColor', '#dc3545'); // Red
        } else {
            $messageBox.css('backgroundColor', '#007bff'); // Blue (info)
        }

        $('body').append($messageBox);

        // Animate in
        setTimeout(() => {
            $messageBox.css({
                opacity: '1',
                transform: 'translateX(-50%) translateY(0)'
            });
        }, 100);

        // Animate out and remove after a few seconds
        setTimeout(() => {
            $messageBox.css({
                opacity: '0',
                transform: 'translateX(-50%) translateY(20px)' // Slide down slightly
            });
            $messageBox.one('transitionend', function () {
                $messageBox.remove();
            });
        }, 3000);
    }

    // Initialize the sign-in button text on page load
    updateSignInButtonText();
});
