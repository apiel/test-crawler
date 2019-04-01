import { unix } from 'moment';

export const timestampToString = (timestamp) => unix(timestamp)//.format('YYYY.DD.MM HH:mm')
                                            .calendar()