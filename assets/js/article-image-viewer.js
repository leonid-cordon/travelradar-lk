document.addEventListener('DOMContentLoaded', function () {
    var desktopViewerQuery = window.matchMedia('(min-width: 1024px)');
    var trioImages = document.querySelectorAll('.image-trio img');
    var viewer;
    var viewerImg;

    if (!trioImages.length) {
        return;
    }

    document.body.classList.add('image-viewer-enabled');

    function createViewer() {
        viewer = document.createElement('div');
        viewer.className = 'image-viewer';
        viewer.id = 'image-viewer';
        viewer.setAttribute('aria-hidden', 'true');

        viewerImg = document.createElement('img');
        viewerImg.id = 'image-viewer-img';
        viewerImg.setAttribute('src', '');
        viewerImg.setAttribute('alt', '');
        viewerImg.setAttribute('loading', 'lazy');

        viewer.appendChild(viewerImg);
        document.body.appendChild(viewer);
    }

    function closeViewer() {
        viewer.classList.remove('is-visible');
        viewer.setAttribute('aria-hidden', 'true');
        viewerImg.setAttribute('src', '');
        viewerImg.setAttribute('alt', '');
        document.body.classList.remove('image-viewer-open');
    }

    function openViewer(img) {
        if (!desktopViewerQuery.matches) {
            return;
        }

        viewerImg.setAttribute('src', img.getAttribute('src') || '');
        viewerImg.setAttribute('alt', img.getAttribute('alt') || '');
        viewer.classList.add('is-visible');
        viewer.setAttribute('aria-hidden', 'false');
        document.body.classList.add('image-viewer-open');
    }

    createViewer();

    trioImages.forEach(function (img) {
        img.addEventListener('click', function () {
            openViewer(img);
        });
    });

    viewer.addEventListener('click', function () {
        closeViewer();
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && viewer.classList.contains('is-visible')) {
            closeViewer();
        }
    });

    if (typeof desktopViewerQuery.addEventListener === 'function') {
        desktopViewerQuery.addEventListener('change', function (event) {
            if (!event.matches) {
                closeViewer();
            }
        });
    } else if (typeof desktopViewerQuery.addListener === 'function') {
        desktopViewerQuery.addListener(function (event) {
            if (!event.matches) {
                closeViewer();
            }
        });
    }
});
