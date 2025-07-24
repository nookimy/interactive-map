jQuery(document).ready(function ($) {
    const PRICE_PER_SQM = 5303;

    // Статусы
    const STATUS_FREE = 'Свободный участок';
    const STATUS_HOUSE_READY = 'Участок с готовым домом';
    const STATUS_HOUSE_BUILDING = 'Участок со строящимся домом';
    const STATUS_RESERVED = 'Забронированный участок';
    const STATUS_SOLD = 'Проданный участок';

    const statusColors = {
        [STATUS_FREE]: '#91CD2F',
        [STATUS_HOUSE_READY]: '#7113BA',
        [STATUS_HOUSE_BUILDING]: '#1665FF',
        [STATUS_RESERVED]: '#fff',
        [STATUS_SOLD]: '#A62E1B'
    };

    // Данные элементов (ключ — id path)
    const locationData = {
        'path62461': { status: STATUS_FREE, number: '3665', area: 1669 },
        'path62465': { status: STATUS_SOLD, number: '3277', area: 1132 },
        'path62463': { status: STATUS_HOUSE_BUILDING, number: '3276', area: 1810 },
        'path77406': { status: STATUS_HOUSE_READY, number: '3444', area: 1547 },
        'path80784': { status: STATUS_RESERVED, number: '3257', area: 1323 },
        'p1-1': { number: 'Участок 3257' }
    };

    // Функция окраски
    function setStatusColor(element, status) {
        if (statusColors[status]) {
            $(element).css('fill', statusColors[status]);
        }
    }

    // Инициализация: добавляем атрибуты и стили
    Object.keys(locationData).forEach(function (id) {
        const $elem = $('#' + id);
        if (!$elem.length) return;

        const data = locationData[id];
        const attrs = {};

        // Если указан статус
        if (data.status) {
            attrs['data-locationname'] = data.status;
            setStatusColor($elem, data.status);
        }

        // Если указан номер
        if (data.number) {
            attrs['data-locationnumber'] = data.number;
        }

        // Если указана площадь (и цена)
        if (data.area) {
            attrs['data-locationarea'] = data.area;
            attrs['data-locationprice'] = data.area * PRICE_PER_SQM;
        }

        // Применяем атрибуты (если они есть)
        if (Object.keys(attrs).length) {
            $elem.attr(attrs);
        }

        // Стили с плавной прозрачностью для всех элементов
        $elem.css({
            'cursor': 'pointer',
            'opacity': '0.7',
            'transition': 'opacity 0.3s ease'
        }).hover(
            function () { $(this).css('opacity', '1'); },
            function () { $(this).css('opacity', '0.7'); }
        );
    });

    // Клик по элементу (если он есть в locationData)
    $('#map').on('click', 'path', function () {
        const id = $(this).attr('id');
        if (!id || !locationData[id]) return;

        const data = locationData[id];
        const status = data.status || '';
        const number = data.number || '';
        const area = data.area || '';
        const price = data.area ? data.area * PRICE_PER_SQM : '';

        // Функция для замены текста и управления видимостью
        function updateField(selector, value) {
            const $el = $(selector);
            if (value) {
                $el.show().find('span').text(value);
            } else {
                $el.hide();
            }
        }

        // Заполняем balloon с проверкой на наличие данных
        updateField(".location__title", number);
        updateField(".location__status", status);
        updateField(".location__area", area);
        updateField(".location__price", price);

        if (status) setStatusColor($(this), status);
    });

    // Закрытие balloon
    $('.balloon__close-button').on('click', function (event) {
        event.preventDefault();
        $(".balloon").css({ "bottom": "0", "left": "0" });
    });
});
