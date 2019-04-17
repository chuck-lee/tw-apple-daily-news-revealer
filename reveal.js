var PRESERVE_IDS = [
    'playerVideo',
    'video_player'
];

var PRESERVE_CLASSES = [
    'ndAritcle_headPic',
    'ndArticle_margin',
    'mediabox'
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
    try {
        // Restore video content if exists
        var video_data = JSON.parse(
            PRESERVED_DOM_ELEMENTS['playerVideo'].childNodes[0].lastChild.dataset['anvp']
        );

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

        var thoracis = document.getElementsByClassName('thoracis')[0];
        thoracis.appendChild(video);
    } catch (e) {
        ;
    }

    // Restore article content
    var ndArticle_content = document.getElementsByClassName('ndArticle_content')[0];
    ndArticle_content.insertBefore(PRESERVED_DOM_ELEMENTS['ndArticle_margin'],
                                   ndArticle_content.childNodes[0]);
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
