export type ContractBreachRecord = { id:string;contractor:string;subsidiary:string;service:string;field:string;month:'Июл'|'Авг'|'Сен';category:'ПБ'|'Пропускной режим'|'Убытки'|'Нарушение условий договора'|'НПВ'|'Прочее';kind:'Типовое'|'Нетиповое';resolution:'ДПР'|'Замена на мероприятие'|'Не предъявлять'|'В работе' };
export const CONTRACT_BREACHES:ContractBreachRecord[]=[
{id:'НАР-001',contractor:'Альфа-Строй',subsidiary:'ГПН-Ямал',service:'Бурение',field:'Ярудейское',month:'Июл',category:'ПБ',kind:'Типовое',resolution:'ДПР'},
{id:'НАР-002',contractor:'БетаГрупп',subsidiary:'ГПН-Ямал',service:'ТКРС',field:'Новопортовское',month:'Июл',category:'Пропускной режим',kind:'Нетиповое',resolution:'В работе'},
{id:'НАР-003',contractor:'Гамма-ТЭК',subsidiary:'Мессояханефтегаз',service:'Бурение',field:'Мессояхское',month:'Июл',category:'Убытки',kind:'Типовое',resolution:'Замена на мероприятие'},
{id:'НАР-004',contractor:'Дельта Инж',subsidiary:'Мессояханефтегаз',service:'КС',field:'Мессояхское',month:'Авг',category:'Нарушение условий договора',kind:'Типовое',resolution:'ДПР'},
{id:'НАР-005',contractor:'Сигма Плюс',subsidiary:'Газпромнефть-Хантос',service:'ТКРС',field:'Вынгапуровское',month:'Авг',category:'НПВ',kind:'Нетиповое',resolution:'Не предъявлять'},
{id:'НАР-006',contractor:'Омега-Сервис',subsidiary:'Газпромнефть-Хантос',service:'ГРП',field:'Ямбургское',month:'Авг',category:'ПБ',kind:'Типовое',resolution:'В работе'},
{id:'НАР-007',contractor:'БетаГрупп',subsidiary:'ГПН-Ямал',service:'ТКРС',field:'Новопортовское',month:'Сен',category:'Прочее',kind:'Нетиповое',resolution:'ДПР'},
{id:'НАР-008',contractor:'Омега-Сервис',subsidiary:'Газпромнефть-Хантос',service:'ГРП',field:'Ямбургское',month:'Сен',category:'ПБ',kind:'Типовое',resolution:'Замена на мероприятие'},
{id:'НАР-009',contractor:'Альфа-Строй',subsidiary:'ГПН-Ямал',service:'Бурение',field:'Ярудейское',month:'Сен',category:'НПВ',kind:'Типовое',resolution:'В работе'},
{id:'НАР-010',contractor:'Дельта Инж',subsidiary:'Мессояханефтегаз',service:'КС',field:'Мессояхское',month:'Сен',category:'Убытки',kind:'Нетиповое',resolution:'Не предъявлять'},
];
