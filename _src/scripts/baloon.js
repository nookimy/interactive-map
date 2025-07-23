jQuery(document).ready(function ($) {
    const statusColors = {
        'Свободный участок': '#91CD2F',
        'Участок с готовым домом': '#7113BA',
        'Участок со строящимся домом': '#1665FF',
        'Забронированный участок': '#fff',
        'Проданный участок': '#A62E1B'
    };

    function setStatusColor(element, status) {
        if (statusColors[status]) {
            $(element).css('fill', statusColors[status]);
            $(".location__status").css('color', statusColors[status]);
        }
    }

    // Красим участки при загрузке
    $("path[data-locationtype='location']").each(function () {
        const nameStatus = $(this).attr('data-locationname');
        setStatusColor(this, nameStatus);
    });

    // Показываем balloon (общая функция)
    function showBalloon($element, e) {
        $(".location__title > span").text($element.attr("data-locationnumber"));
        $(".location__status > span").text($element.attr("data-locationname"));
        $(".location__area > span").text($element.attr("data-locationarea"));
        $(".location__price > span").text($element.attr("data-locationprice"));

        const currentStatus = $element.attr('data-locationname');
        setStatusColor($element, currentStatus);

        const isSold = currentStatus === 'Проданный участок';
        $('.location__price, .balloon__button--1, .balloon__button--2').toggle(!isSold);

        const targetRect = map.getBoundingClientRect();
        const x = e.clientX - targetRect.left;
        const y = e.clientY - targetRect.top;

        const $balloon = $(".balloon");
        const balloonHeight = $balloon.outerHeight() || 150;
        const balloonWidth = $balloon.outerWidth() || 200;

        $balloon.css({
            position: 'absolute',
            left: `${x - balloonWidth / 2}px`,
            top: `${y - balloonHeight - 10}px`,
            display: 'block'
        });
    }

    function removeBalloon() {
        $(".balloon").hide();
    }

    // На мобильных (≤1024px) — показываем balloon по клику
    if (window.innerWidth <= 1024) {
        $('#map').on("click", "path[data-locationtype='location']", function (e) {
            showBalloon($(this), e);
        });
    } else {
        // На десктопе — показываем balloon при наведении
        $('#map').on("mouseenter", "path[data-locationtype='location']", function (e) {
            showBalloon($(this), e);
        });

        $('#map').on("mouseleave", "path[data-locationtype='location']", function () {
            removeBalloon();
        });
    }

    // Скрытие при клике вне balloon или при скролле
    $('.balloon__close-button').on('click', function (event) {
        event.preventDefault();
        removeBalloon();
    });

    $(window).on('scroll', removeBalloon);
    $('#map').on('scroll wheel', removeBalloon);

    $(document).on('click', function (e) {
        const $balloon = $(".balloon");
        if ($balloon.is(':visible') && !$(e.target).closest('.balloon, path[data-locationtype="location"]').length) {
            removeBalloon();
        }
    });
});
