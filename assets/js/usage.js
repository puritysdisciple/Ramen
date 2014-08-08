(function () {
    var sidebar = jQuery('.usage-sidebar').eq(0),
        root = $('html, body'),
        hash = '#' + location.hash.replace('#docs-', ''),
        codeBlocks = jQuery('pre'),
        scrollTimeout;

    function scrollTo (targetHash) {
        var target = jQuery(targetHash);

        if (!target.length) {
            return false;
        }

        root.animate({
            scrollTop: target.offset().top - 68
        }, 250, function () {
            window.location.hash = '#docs-' + targetHash.replace('#', '');
        });

        return true;
    }

    function scrollSetup () {
        jQuery('body').scrollspy({
            target: '.usage-sidebar',
            offset: 70
        });
        sidebar.affix({
            offset: {
                top: sidebar.offset().top - 48
            }
        });

        jQuery('a[href*="#"]').on('click', function() {
            var el = jQuery(this),
                href = el.attr('href');

            if (scrollTo(href)) {
                return false;
            }
        });

        if (hash !== '#') {
            scrollTo(hash);
        }
    }

    if (codeBlocks.length > 0) {
        Prism.hooks.add('after-highlight', function () {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(scrollSetup, 100);
        });
    } else {
        scrollSetup();
    }
}());
