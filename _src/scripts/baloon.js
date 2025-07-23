jQuery(document).ready(function ($) {
    // При загрузке документа выбираем все <path> с атрибутом data-locationtype="location"
    $("path[data-locationtype='location']").each(function () {
        console.log("11");
        // Берем название статуса участка
        let nameStatus = $(this).attr('data-locationname');

        // Красим участок в зависимости от его статуса
        if (nameStatus == 'Свободный участок') {
            $(this).css('fill', '#91CD2F'); // зеленый — свободный
        } else if (nameStatus == 'Участок с готовым домом') {
            $(this).css('fill', '#7113BA'); // фиолетовый — с домом
        } else if (nameStatus == 'Участок со строящимся домом') {
            $(this).css('fill', '#1665FF'); // синий — строится
        } else if (nameStatus == 'Забронированный участок') {
            $(this).css('fill', '#fff'); // белый — забронирован
        } else if (nameStatus == 'Проданный участок') {
            $(this).css('fill', '#A62E1B'); // красный — продан
        };
    });

    /* --- Всплывающее окно с данными участка при клике --- */
    let current_nameStatus = '';

    // При клике на любой <path> в обертке карты
    $('#map').on("click", "path", function (e) {
        var target = map.getBoundingClientRect();
        var x = e.clientX - target.left; // координата X клика
        var y = e.clientY - target.top;  // координата Y клика
        console.log(x + ', ' + y);

        // Проверяем, кликнули ли именно на участок
        if ($(this).attr("data-locationtype") == "location") {
            console.log(" участок!!!!");

            // Заполняем блок с информацией данными из атрибутов path
            $(".location__title > span").text($(this).attr("data-locationnumber"));
            $(".location__status > span").text($(this).attr("data-locationname"));
            $(".location__area > span").text($(this).attr("data-locationarea"));
            $(".location__price > span").text($(this).attr("data-locationprice"));


            // Меняем цвет названия участка в зависимости от статуса
            current_nameStatus = $(this).attr('data-locationname');
            if (current_nameStatus == 'Свободный участок') {
                $(".location__status").css('color', '#91CD2F');
            } else if (current_nameStatus == 'Участок с готовым домом') {
                $(".location__status").css('color', '#7113BA');
            } else if (current_nameStatus == 'Участок со строящимся домом') {
                $(".location__status").css('color', '#1665FF');
            } else if (current_nameStatus == 'Забронированный участок') {
                $(".location__status").css('color', '#777777');
            } else if (current_nameStatus == 'Проданный участок') {
                $(".location__status").css('color', '#A62E1B');
            };

            // Если участок продан — скрываем цену и кнопки
            if (current_nameStatus == 'Проданный участок') {
                $('.location__price').hide();
                $('.balloon__button--1').hide();
                $('.balloon__button--2').hide();
            } else {
                $('.location__price').show();
                $('.balloon__button--1').show();
                $('.balloon__button--2').show();
            };
        } else {
            console.log(" не участок");
            removeMessage(); // убираем всплывашку
        };
    });

    // Функция скрытия всплывающего окна
    function removeMessage() {
        $(".balloon").css({ "bottom": "0", "left": "0" });
    }

    // Закрытие всплывающего окна по кнопке
    $('.balloon__close-button').on('click', function (event) {
        event.preventDefault();
        removeMessage();
    });
});
