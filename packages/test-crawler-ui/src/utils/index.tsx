import { unix } from 'moment';

export const timestampToString = (timestamp: number) => unix(timestamp)//.format('YYYY.DD.MM HH:mm')
                                            .calendar()