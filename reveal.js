var PRESERVE_IDS = [
    'playerVideo',
    'video_player'
];

var PRESERVE_CLASSES = [
    'ndAritcle_headPic',
    'ndArticle_margin',
    'mediabox',
    'article-content',
    'articulum'
];

var PRESERVED_DOM_ELEMENTS = {};

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

var debug_div = document.createElement('div');
function debug(message)
{
    var debug_p = document.createElement('p');
    var debug_message = document.createTextNode(message);
    debug_p.appendChild(debug_message);
    debug_div.appendChild(debug_p);
}

function show_debug(element)
{
    element.appendChild(debug_div);
}

function reveal_video_desktop()
{
    var video_data_json = null;
    if (PRESERVED_DOM_ELEMENTS['video_player'] !== undefined) {
        video_data_json = PRESERVED_DOM_ELEMENTS['video_player'].childNodes[0].dataset['anvp'];
    } else if (PRESERVED_DOM_ELEMENTS['playerVideo'] !== undefined) {
        video_data_json = PRESERVED_DOM_ELEMENTS['playerVideo'].childNodes[0].lastChild.dataset['anvp'];
    }

    if (video_data_json === null) {
        return;
    }

    try {
        // Reconstruct video content
        var video_data = JSON.parse(video_data_json);

        var source = document.createElement("source");
        source.src = video_data['url'];
        source.type = 'video/mp4';

        var video = document.createElement('video');
        video.width = parseInt(video_data['width'], 10);
        video.height = parseInt(video_data['height'], 10);
        video.autoplay = false;
        video.controls = true;
        video.appendChild(source);
        video.load();

        // Restore video content
        var thoracis = document.getElementsByClassName('thoracis')[0];
        thoracis.appendChild(video);
    } catch (e) {
        ;
    }
}

function hide_secret_tag_in_destkop_article_element(article_element)
{
    var secret_element_tag_name_regex = /[a-zA-Z0-9]{33}-[a-zA-Z0-9]{32}/;
    var element_tag_list = article_element.getElementsByTagName("*");
    for (var i = 0; i < element_tag_list.length; i++) {
        var element = element_tag_list[i];
        if (element.tagName.search(secret_element_tag_name_regex) >= 0) {
            element.style.display = 'none';
        }
    }
    return article_element
}

function reveal_article_desktop()
{
    try {
        if (PRESERVED_DOM_ELEMENTS['ndArticle_margin'] !== undefined) {
            // Find and hide the secret element in the content to bypass content re-hide
            var article_element = hide_secret_tag_in_destkop_article_element(
                PRESERVED_DOM_ELEMENTS['ndArticle_margin']
            );
            // Restore article content
            var ndArticle_content = document.getElementsByClassName('ndArticle_content')[0];
            ndArticle_content.insertBefore(article_element,
                                           ndArticle_content.childNodes[0]);
        } else if (PRESERVED_DOM_ELEMENTS['articulum'] !== undefined) {
            // Find and hide the secret element in the content to bypass content re-hide
            var article_element = hide_secret_tag_in_destkop_article_element(
                PRESERVED_DOM_ELEMENTS['articulum']
            );
            var abdominis = document.getElementsByClassName('abdominis')[0];
            var article = abdominis.getElementsByTagName('article')[0];
            abdominis.insertBefore(article_element, article.nextSibling);
        } else if (PRESERVED_DOM_ELEMENTS['article-content'] !== undefined) {
            // Find and hide the secret element in the content to bypass content re-hide
            var article_element = hide_secret_tag_in_destkop_article_element(
                PRESERVED_DOM_ELEMENTS['article-content']
            );

            var video_player_wrap_element = article_element.getElementsByClassName('video-player-wrap')[0];
            video_player_wrap_element.style.display = 'none';

            var ndPaywall = document.getElementsByClassName('ndPaywall')[0];
            ndPaywall.parentNode.insertBefore(article_element, ndPaywall.nextSibling);
        }
    } catch (e) {
        ;
    }
}

function reveal_content_desktop()
{
    var ndPaywall = document.getElementsByClassName('ndPaywall');
    for (var i = 0; i < ndPaywall.length; i++) {
        ndPaywall[i].style.display = 'none';
    }

    var ndPaywallVideo = document.getElementsByClassName('ndPaywallVideo');
    for (var i = 0; i < ndPaywallVideo.length; i++) {
        ndPaywallVideo[i].style.display = 'none';
    }

    // Restore deleted content
    reveal_video_desktop();
    reveal_article_desktop();
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
        // Force stop content re-hide
        try {
            // This breaks the barrier between extension and main page, but it
            // seems to be the only way to get interval ID to stop it.
            var contentV = XPCNativeWrapper(window.wrappedJSObject.contentV);
            window.clearInterval(contentV);
        } catch {
            ;
        }

        reveal_content();
    }
})

function preserve_node(node)
{
    for (var i = 0; i < PRESERVE_IDS.length; i++) {
        var preserve_id = PRESERVE_IDS[i];
        if (node.id == preserve_id) {
            node.style.display = '';
            PRESERVED_DOM_ELEMENTS[preserve_id] = node.cloneNode(true);
            return;
        }
    }

    for (var i = 0; i < PRESERVE_CLASSES.length; i++) {
        var preserve_class = PRESERVE_CLASSES[i];
        if (node.classList.contains(preserve_class)) {
            node.style.display = '';
            PRESERVED_DOM_ELEMENTS[preserve_class] = node.cloneNode(true);
            return;
        }
    }
}

var config = {childList: true, subtree: true};
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type != 'childList') {
            return;
        }

        // Preserve content node
        for (var i = 0; i < mutation.removedNodes.length; i++) {
            preserve_node(mutation.removedNodes[i]);
        }
    });
})
observer.observe(document, config);
