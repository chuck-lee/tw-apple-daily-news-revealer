function reveal_content_mobile()
{
    var ndgPayway = document.getElementsByClassName('ndgPayway');
    for (var i = 0; i < ndgPayway.length; i++) {
        ndgPayway[i].style.display = 'none';
    }

    document.body.style.overflowY = 'auto';
    // Apple daily sets a timeout to disable scrolling again.
    setTimeout(function(){
        document.body.style.overflowY = 'auto';
    }, 2500);
}

function reveal_content_desktop()
{
    var ndPaywall = document.getElementsByClassName('ndPaywall');
    for (var i = 0; i < ndPaywall.length; i++) {
        ndPaywall[i].style.display = 'none';
    }

    var ndArticle_margin = document.getElementsByClassName('ndArticle_margin');
    for (var i = 0; i < ndArticle_margin.length; i++) {
        ndArticle_margin[i].style.display = '';
    }
}

function reveal_content()
{
    // Detect site mode.
    var isMobile = document.body.classList.contains("ui-mobile-viewport");

    if (isMobile) {
        reveal_content_mobile();
        return;
    }

    reveal_content_desktop();
}

document.addEventListener('readystatechange', (event) => {
    if (document.readyState == "complete") {
        reveal_content();
    }
})
