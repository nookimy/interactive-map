jQuery(document).ready(function ($) {
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
    // Теперь цена указывается вручную в data.price
    const locationData = {
        'path62461': { status: STATUS_FREE, name: 'Участок 3665', area: 1669, price: '8 840 000' },
        'path62465': { status: STATUS_SOLD, name: 'Участок 3277', area: 1132, price: '6 000 000' },
        'path62463': { status: STATUS_HOUSE_BUILDING, name: 'Участок 3276', area: 1810, price: '9 500 000' },
        'path77406': { status: STATUS_HOUSE_READY, name: 'Участок 3444', area: 1547, price: '7 900 000' },
        'path80784': { status: STATUS_RESERVED, name: 'Участок 3257', area: 1323, price: '6 700 000' },
        'p1-1': { name: 'Участок 3257', price: '6 700 000' }
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

        // Добавляем имя (номер/название) в data-locationname
        if (data.name) {
            attrs['data-locationname'] = data.name;
        }

        // Добавляем площадь если есть
        if (data.area) {
            attrs['data-locationarea'] = data.area;
        }

        // Добавляем цену из данных
        if (data.price) {
            attrs['data-locationprice'] = data.price;
        }

        if (Object.keys(attrs).length) {
            $elem.attr(attrs);
        }

        // Окрашиваем по статусу
        if (data.status) {
            setStatusColor($elem, data.status);
        }

        // Стили с плавной прозрачностью
        $elem.css({
            'cursor': 'pointer',
            'opacity': '0.7',
            'transition': 'opacity 0.3s ease'
        }).hover(
            function () { $(this).css('opacity', '1'); },
            function () { $(this).css('opacity', '0.7'); }
        );
    });

    // Клик по элементу
    $('#map').on('click', 'path', function () {
        const id = $(this).attr('id');
        if (!id || !locationData[id]) return;

        const data = locationData[id];
        const status = data.status || '';
        const name = data.name || '';
        const area = data.area || '';
        const price = data.price || '';

        // Функция замены текста и управления видимостью
        function updateField(selector, value) {
            const $el = $(selector);
            if (value) {
                $el.show().find('span').text(value);
            } else {
                $el.hide();
            }
        }

        // Заполняем balloon с проверкой
        updateField(".location__title", name);
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
