jQuery(document).ready(function ($) {
    // Статусы
    const STATUS_FREE = 'Свободный участок';
    const STATUS_HOUSE_READY = 'Участок с готовым домом';
    const STATUS_HOUSE_BUILDING = 'Участок со строящимся домом';
    const STATUS_RESERVED = 'Забронированный участок';
    const STATUS_SOLD = 'Проданный участок';

    const statusColors = {
        [STATUS_FREE]: '#23DD00',
        [STATUS_HOUSE_READY]: '#7113BA',
        [STATUS_HOUSE_BUILDING]: '#00BBFF',
        [STATUS_RESERVED]: '#FFFFFF',
        [STATUS_SOLD]: '#FF4000'
    };

    // Основные данные по участкам
const locationData = {
    'path17610': { status: STATUS_SOLD, name: '3069', area: 1927, price: '99999999' },
    'path27925': { status: STATUS_SOLD, name: '3096', area: 4354, price: '99999999' },
    'path27927': { status: STATUS_SOLD, name: '3105', area: 3204, price: '99999999' },
    'path27929': { status: STATUS_SOLD, name: '3106', area: 3237, price: '99999999' },
    'path27931': { status: STATUS_SOLD, name: '3107', area: 3295, price: '99999999' },
    'path27933': { status: STATUS_SOLD, name: '3108', area: 3144, price: '99999999' },
    'path27935': { status: STATUS_SOLD, name: '3109', area: 3167, price: '99999999' },
    'path27937': { status: STATUS_SOLD, name: '3110', area: 3249, price: '99999999' },
    'path27939': { status: STATUS_SOLD, name: '3111', area: 2722, price: '99999999' },
    'path31974': { status: STATUS_RESERVED, name: '3112', area: 2550, price: '11576960' },
    'path35284': { status: STATUS_RESERVED, name: '3097', area: 2286, price: '10397810' },
    'path36012': { status: STATUS_RESERVED, name: '3098', area: 2760, price: '12547735' },
    'path36014': { status: STATUS_RESERVED, name: '3099', area: 3109, price: '14139460' },
    'path36016': { status: STATUS_FREE, name: '3100', area: 3844, price: '21131605' },
    'path36018': { status: STATUS_FREE, name: '3101', area: 3737, price: '20874058' },
    'path36020': { status: STATUS_FREE, name: '3102', area: 3728, price: '20874058' },
    'path36022': { status: STATUS_FREE, name: '3103', area: 3921, price: '21514260' },
    'path36024': { status: STATUS_FREE, name: '3146', area: 3264, price: '18036425' },
    'path36026': { status: STATUS_SOLD, name: '3229', area: 3260, price: '99999999' },
    'path36028': { status: STATUS_FREE, name: '3240', area: 3321, price: '18215311' },
    'path36030': { status: STATUS_FREE, name: '3251', area: 3418, price: '18648889' },
    'path36032': { status: STATUS_FREE, name: '3262', area: 3413, price: '18698770' },
    'path36034': { status: STATUS_SOLD, name: '3273', area: 4302, price: '99999999' },
    'path36036': { status: STATUS_FREE, name: '3284', area: 4290, price: '23701601' },
    'path95824': { status: STATUS_SOLD, name: '3242', area: 1927, price: '99999999' },
    'path95822': { status: STATUS_SOLD, name: '3241', area: 1316, price: '99999999' },
    'path95820': { status: STATUS_SOLD, name: '3239', area: 1385, price: '99999999' },
    'path95818': { status: STATUS_RESERVED, name: '3238', area: 1427, price: '8990100' },
    'path95816': { status: STATUS_RESERVED, name: '3237', area: 1634, price: '9395500' },
    'path95814': { status: STATUS_RESERVED, name: '3236', area: 1875, price: '10781250' },
    'path95812': { status: STATUS_SOLD, name: '3235', area: 1955, price: '99999999' },
    'path95810': { status: STATUS_SOLD, name: '3234', area: 1878, price: '99999999' },
    'path95808': { status: STATUS_SOLD, name: '3233', area: 1778, price: '99999999' },
    'path95806': { status: STATUS_SOLD, name: '3232', area: 1737, price: '99999999' },
    'path95804': { status: STATUS_SOLD, name: '3231', area: 1682, price: '99999999' },
    'path95802': { status: STATUS_SOLD, name: '3230', area: 1602, price: '99999999' },
    'path80788': { status: STATUS_RESERVED, name: '3259', area: 1650, price: '1039500' },
    'path80786': { status: STATUS_RESERVED, name: '3258', area: 1474, price: '9286200' },
    'path77400': { status: STATUS_HOUSE_READY, name: '3282', area: 1250, price: '7479529' },
    'path77402': { status: STATUS_HOUSE_READY, name: '3442', area: 1547, price: '9123301' },
    'path77404': { status: STATUS_HOUSE_READY, name: '3443', area: 1546, price: '9116455' },
    'path77406': { status: STATUS_HOUSE_READY, name: '3444', area: 1547, price: '7900000' },
    'path62465': { status: STATUS_SOLD, name: '3277', area: 1132, price: '6000000' },
    'path62463': { status: STATUS_HOUSE_BUILDING, name: '3276', area: 1810, price: '10213285' },
    'path84168': { status: STATUS_SOLD, name: '3243', area: 1478, price: '99999999' },
    'path84170': { status: STATUS_SOLD, name: '3244', area: 1193, price: '99999999' },
    'path84172': { status: STATUS_SOLD, name: '3245', area: 1313, price: '99999999' },
    'path84174': { status: STATUS_RESERVED, name: '3246', area: 1422, price: '8958600' },
    'path87558': { status: STATUS_RESERVED, name: '3247', area: 1447, price: '9116100' },
    'path87560': { status: STATUS_RESERVED, name: '3248', area: 1660, price: '99999999' },
    'path87562': { status: STATUS_RESERVED, name: '3249', area: 1653, price: '99999999' },
    'path87564': { status: STATUS_RESERVED, name: '3250', area: 1723, price: '99999999' },
    'path90952': { status: STATUS_RESERVED, name: '3252', area: 1770, price: '99999999' },
    'path90954': { status: STATUS_RESERVED, name: '3253', area: 1726, price: '99999999' },
    'path90956': { status: STATUS_RESERVED, name: '3254', area: 1661, price: '99999999' },
    'path90958': { status: STATUS_RESERVED, name: '3255', area: 1586, price: '99999999' },
    'path80782': { status: STATUS_RESERVED, name: '3256', area: 1378, price: '7041580' },
    'path80784': { status: STATUS_RESERVED, name: '3257', area: 1323, price: '6700000' },
    'path74024': { status: STATUS_SOLD, name: '3662', area: 1683, price: '99999999' },
    'path74026': { status: STATUS_SOLD, name: '3663', area: 1676, price: '99999999' },
    'path74028': { status: STATUS_SOLD, name: '3664', area: 1677, price: '99999999' },
    'path62461': { status: STATUS_FREE, name: '3665', area: 1669, price: '8890945' },
    'path58377': { status: STATUS_FREE, name: '3268', area: 2122, price: '10664219' },
    'path69203': { status: STATUS_HOUSE_BUILDING, name: '3292', area: 2190, price: '12306155' },
    'path69201': { status: STATUS_HOUSE_BUILDING, name: '3291', area: 1820, price: '10312231' },
    'path69199': { status: STATUS_HOUSE_BUILDING, name: '3290', area: 1506, price: '8617469' },
    'path69197': { status: STATUS_HOUSE_BUILDING, name: '3289', area: 1192, price: '6923725' },
    'path65832': { status: STATUS_SOLD, name: '3287', area: 1298, price: '99999999' },
    'path65830': { status: STATUS_SOLD, name: '3286', area: 1547, price: '99999999' },
    'path65828': { status: STATUS_SOLD, name: '3285', area: 1771, price: '99999999' },
    'path65826': { status: STATUS_SOLD, name: '3283', area: 1994, price: '99999999' },
    'path58375': { status: STATUS_SOLD, name: '3269', area: 2125, price: '99999999' },
    'path58373': { status: STATUS_SOLD, name: '3270', area: 2462, price: '99999999' },
    'path55018': { status: STATUS_SOLD, name: '3271', area: 1787, price: '99999999' },
    'path55016': { status: STATUS_SOLD, name: '3272', area: 1400, price: '99999999' },
    'path55014': { status: STATUS_SOLD, name: '3274', area: 1459, price: '99999999' },
    'path55012': { status: STATUS_SOLD, name: '3667', area: 2027, price: '99999999' },
    'path55010': { status: STATUS_SOLD, name: '3666', area: 1675, price: '99999999' },
    'path48285': { status: STATUS_SOLD, name: '3294', area: 1588, price: '99999999' },
    'path48287': { status: STATUS_SOLD, name: '3296', area: 1831, price: '99999999' },
    'path48289': { status: STATUS_SOLD, name: '3297', area: 1733, price: '99999999' },
    'path48291': { status: STATUS_RESERVED, name: '3298', area: 1687, price: '10628100' },
    'path48293': { status: STATUS_RESERVED, name: '3299', area: 1574, price: '9916200' },
    'path44935': { status: STATUS_RESERVED, name: '3305', area: 1886, price: '10571056' },
    'path44937': { status: STATUS_SOLD, name: '3307', area: 1240, price: '99999999' },
    'path44939': { status: STATUS_SOLD, name: '3308', area: 1253, price: '99999999' },
    'path44941': { status: STATUS_SOLD, name: '3309', area: 1134, price: '99999999' },
    'path44943': { status: STATUS_SOLD, name: '3310', area: 1214, price: '99999999' },
    'path44945': { status: STATUS_SOLD, name: '3311', area: 1568, price: '99999999' },
    'path51647': { status: STATUS_RESERVED, name: '3300', area: 1324, price: '8341200' },
    'path51649': { status: STATUS_RESERVED, name: '3301', area: 1421, price: '8952300' },
    'path51651': { status: STATUS_SOLD, name: '3302', area: 1366, price: '99999999' },
    'path51653': { status: STATUS_SOLD, name: '3303', area: 1325, price: '99999999' },
    'path51655': { status: STATUS_SOLD, name: '3304', area: 1171, price: '99999999' },
    'path99968': { status: STATUS_SOLD, name: '3167', area: 1272, price: '99999999' },
    'path99966': { status: STATUS_RESERVED, name: '3166', area: 1645, price: '8800555' },
    'path99964': { status: STATUS_RESERVED, name: '3365', area: 1632, price: '8731777' },
    'path99962': { status: STATUS_RESERVED, name: '3364', area: 1617, price: '8629635' },
    'path99960': { status: STATUS_SOLD, name: '3363', area: 1598, price: '99999999' },
    'path99958': { status: STATUS_FREE, name: '3162', area: 1578, price: '9862500' },
    'path99956': { status: STATUS_SOLD, name: '3161', area: 1558, price: '99999999' },
    'path99954': { status: STATUS_SOLD, name: '3160', area: 1539, price: '99999999' },
    'path107538': { status: STATUS_SOLD, name: '3159', area: 1143, price: '99999999' },
    'path107536': { status: STATUS_SOLD, name: '3157', area: 1079, price: '99999999' },
    'path110969': { status: STATUS_SOLD, name: '3156', area: 1373, price: '99999999' },
    'path110967': { status: STATUS_SOLD, name: '3155', area: 1265, price: '99999999' },
    'path110965': { status: STATUS_SOLD, name: '3154', area: 1082, price: '99999999' },
    'path110963': { status: STATUS_SOLD, name: '3152', area: 1100, price: '99999999' },
    'path110961': { status: STATUS_SOLD, name: '3151', area: 1285, price: '99999999' },
    'path110959': { status: STATUS_SOLD, name: '3150', area: 1357, price: '99999999' },
    'path107534': { status: STATUS_SOLD, name: '3149', area: 1718, price: '99999999' },
    'path104106': { status: STATUS_SOLD, name: '3148', area: 1384, price: '99999999' },
    'path104108': { status: STATUS_SOLD, name: '3316', area: 1453, price: '99999999' },
    'path104110': { status: STATUS_SOLD, name: '3315', area: 1687, price: '99999999' },
    'path104112': { status: STATUS_FREE, name: '3314', area: 1967, price: '12293750' },
    'path104114': { status: STATUS_FREE, name: '3313', area: 2228, price: '13925000' },
    'path104116': { status: STATUS_SOLD, name: '3312', area: 1632, price: '8235596' },
    'path40104': { status: STATUS_SOLD, name: '3744', area: 3292, price: '99999999' },
    'path40106': { status: STATUS_HOUSE_READY, name: '3213', area: 3323, price: '18106174' },
    'path40108': { status: STATUS_SOLD, name: '3202', area: 3612, price: '99999999' },
    'path40110': { status: STATUS_SOLD, name: '3191', area: 3754, price: '99999999' },
    'path40112': { status: STATUS_SOLD, name: '3180', area: 3810, price: '99999999' },
    'path40114': { status: STATUS_SOLD, name: '3169', area: 3832, price: '99999999' },
    'path40116': { status: STATUS_SOLD, name: '3158', area: 3868, price: '99999999' },
    'path40118': { status: STATUS_SOLD, name: '3347', area: 3922, price: '99999999' },
    'path40120': { status: STATUS_SOLD, name: '3306', area: 3893, price: '99999999' },
    'path40122': { status: STATUS_SOLD, name: '3295', area: 3884, price: '99999999' },
    'p1-1': { name: '1.1', area: 1532.24 },
    'p1-2': { name: '1.2', area: 1937.42 },
    'p1-3': { name: '1.3', area: 1600.66 },
    'p1-4': { name: '1.4', area: 1546.21 },
    'p1-5': { name: '1.5', area: 1581.95 },
    'p1-6': { name: '1.6', area: 1511.68 },
    'p1-7': { name: '1.7', area: 1533.03 },
    'p1-8': { name: '1.8', area: 1532.27 },
    'p1-9': { name: '1.9', area: 2198.77 },
    'p1-10': { name: '1.10', area: 1952.33 },
    'p1-11': { name: '1.11', area: 1306.61 },
    'p1-12': { name: '1.12', area: 1202.15 },
    'p1-13': { name: '1.13', area: 1161.47 },
    'p1-14': { name: '1.14', area: 1205.71 },
    'p1-15': { name: '1.15', area: 1533.54 },
    'p1-16': { name: '1.16', area: 1960.06 },
    'p1-17': { name: '1.17', area: 1847.75 },
    'p1-18': { name: '1.18', area: 1769.36 },
    'p2-1': { name: '2.1', area: 1624.28 },
    'p2-2': { name: '2.2', area: 1461.96 },
    'p2-3': { name: '2.3', area: 1368.79 },
    'p2-4': { name: '2.4', area: 1457.66 },
    'p2-5': { name: '2.5', area: 1481.86 },
    'p2-6': { name: '2.6.', area: 1515.20 },
    'p2-7': { name: '2.7', area: 1580.16 },
    'p2-8': { name: '2.8', area: 2286.65 },
    'p2-9': { name: '2.9', area: 2442.72 },
    'p2-10': { name: '2.10', area: 2439.06 },
    'p2-11': { name: '2.11', area: 2577.66 },
    'p2-12': { name: '2.12', area: 2428.12 },
    'p2-13': { name: '2.13', area: 2368.00 },
    'p2-14': { name: '2.14', area: 1972.73 },
    'p2-15': { name: '2.15', area: 1705.55 },
    'p2-16': { name: '2.16', area: 1586.45 },
    'p2-17': { name: '2.17', area: 1235.44 },
    'p2-18': { name: '2.18', area: 1338.75 },
    'p2-19': { name: '2.19', area: 1606.74 },
    'p2-20': { name: '2.20', area: 1592.19 },
    'p2-21': { name: '2.21', area: 1530.72 },
    'p2-22': { name: '2.22', area: 1950.49 },
    'p2-23': { name: '2.23', area: 1558.74 },
    'p2-24': { name: '2.24', area: 1758.26 },
    'p2-25': { name: '2.25', area: 1524.79 },
    'p2-26': { name: '2.26', area: 2565.48 },

    'p3-01': { name: '3.01', area: 1564.65 },
    'p3-1': { name: '3.1', area: 1635.92 },
    'p3-2': { name: '3.2', area: 1918.15 },
    'p3-3': { name: '3.3', area: 1837.33 },
    'p3-4': { name: '3.4', area: 2035.86 },
    'p3-5': { name: '3.5', area: 2230.78 },
    'p3-6': { name: '3.6', area: 1778.91 },
    'p3-7-1': { name: '3.7.1', area: 1281.13 },
    'p3-7-2': { name: '3.7.2', area: 1225.53 },
    'p3-8': { name: '3.8', area: 849.90 },
    'p3-9': { name: '3.9', area: 892.45 },
    'p3-10': { name: '3.10', area: 945.81 },
    'p3-11': { name: '3.11', area: 1014.27 },
    'p3-12': { name: '3.12', area: 1112.27 },
    'p3-13': { name: '3.13', area: 1249.57 },
    'p3-14': { name: '3.14', area: 1401.38 },
    'p3-15': { name: '3.15', area: 1530.18 },
    'p3-16': { name: '3.16', area: 1579.9 },
    'p3-17': { name: '3.17', area: 1413.24 },
    'p3-18': { name: '3.18', area: 2301.19 },
    'p3-20': { name: '3.20', area: 1201.35 },
    'p3-21': { name: '3.21', area: 1333.31 },

    'p5-1': { name: '5.1', area: 1128.26 },
    'p5-2': { name: '5.2', area: 1605.66 },
    'p5-3': { name: '5.3', area: 1161.10 },
    'p5-4': { name: '5.4', area: 1141.37 },
    'p5-5': { name: '5.5', area: 1147.32 },
    'p5-6': { name: '5.6', area: 1183.67 },
    'p5-7': { name: '5.7', area: 1422.28 },
    'p5-8': { name: '5.8', area: 1629.50 },
    'p5-9': { name: '5.9', area: 1583.87 },
    'p5-10': { name: '5.10', area: 1524.85 },
    'p5-11': { name: '5.11', area: 1133.07 },
    'p5-12': { name: '5.12', area: 1331.33 },
    'p5-13': { name: '5.13', area: 1310.17 },
    'p5-14': { name: '5.14', area: 1247.43 },

    'p6-1': { name: '6.1', area: 1180.15 },
    'p6-2': { name: '6.2', area: 1188.50 },
    'p6-3': { name: '6.3', area: 1243.64 },
    'p6-4': { name: '6.4', area: 1439.14 },
    'p6-5': { name: '6.5', area: 1425.48 },
    'p6-6': { name: '6.6', area: 1181.45 },
    'p6-6-2': { name: '6.6.2', area: 1332.98 },
    'p6-6-1': { name: '6.6.1', area: 1923.41 },

    'p7-1': { name: '7.1', area: 1493.18 },
    'p7-2': { name: '7.2', area: 1300.97 },
    'p7-3': { name: '7.3', area: 1418.32 },
    'p7-4': { name: '7.4', area: 1957.95 },
    'p7-5': { name: '7.5', area: 1336.46 },
    'p7-6': { name: '7.6', area: 1327.83 },
    'p7-7': { name: '7.7', area: 1193.35 },
    'p7-8': { name: '7.8', area: 1321.42 },
    'p7-8-1': { name: '7.8.1', area: 1774.56 },
    'p7-9': { name: '7.9', area: 780.36 },
    'p7-9-1': { name: '7.9.1', area: 1693.68 },
    'p7-10': { name: '7.10', area: 776.50 },
    'p7-10-1': { name: '7.10.1', area: 1668.76 },
    'p7-11': { name: '7.11', area: 968.5 },
    'p7-11-1': { name: '7.11.1', area: 1910.01 },
    'p7-12': { name: '7.12', area: 802.72 },
    'p7-12-1': { name: '7.12.1', area: 1634 },
    'p7-13': { name: '7.13', area: 885.44 },
    'p7-13-1': { name: '7.13.1', area: 1799.49 },
    'p7-14': { name: '7.14', area: 818.79 },
    'p7-14-1': { name: '7.14.1', area: 1545.22 },
    'p7-15': { name: '7.15', area: 921.85 },
    'p7-15-1': { name: '7.15.1', area: 1868.1 },
    'p7-16': { name: '7.16', area: 923.82 },
    'p7-16-1': { name: '7.16.1', area: 1744.03 },
    'p7-17': { name: '7.17', area: 988.78 },
    'p7-17-1': { name: '7.17.1', area: 1978.78 },
    'p7-18': { name: '7.18', area: 1308.83 },
    'p7-18-1': { name: '7.18.1', area: 1889.27 },

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

        // Добавляем имя (номер/название)
        if (data.name) {
            attrs['data-locationname'] = data.name;
        }

        // Добавляем площадь
        if (data.area) {
            attrs['data-locationarea'] = data.area;
        }

        // Добавляем цену
        if (data.price) {
            attrs['data-locationprice'] = data.price;
        }

        // Устанавливаем статус или значение по умолчанию
        const status = data.status || STATUS_FREE;
        attrs['data-locationstatus'] = status;

        // Применение атрибутов
        if (Object.keys(attrs).length) {
            $elem.attr(attrs);
        }

        // Окраска
        setStatusColor($elem, status);

        // Стили при наведении
        $elem.css({
            'cursor': 'pointer',
            'opacity': '0.7',
            'transition': 'opacity 0.3s ease'
        }).hover(
            function () { $(this).css('opacity', '1'); },
            function () { $(this).css('opacity', '0.7'); }
        );
    });

    // Клик по участку
    $('#map').on('click', 'path', function () {
        const id = $(this).attr('id');
        if (!id || !locationData[id]) return;

        const data = locationData[id];
        const name = data.name || '';
        const area = data.area || '';
        const price = data.price || '';
        const status = data.status || STATUS_FREE;

        // Функция замены текста и управления видимостью
        function updateField(selector, value) {
            const $el = $(selector);
            if (value) {
                $el.show().text(value);
            } else {
                $el.hide();
            }
        }

        updateField("#location-number", name);
        updateField("#location-status", status);
        updateField("#location-area", area);
        updateField("#location-price", price);

        setStatusColor($(this), status);
    });

    // Закрытие balloon
    $('.balloon__close-button').on('click', function (event) {
        event.preventDefault();
        $(".balloon").css({ "bottom": "0", "left": "0" });
    });
});
