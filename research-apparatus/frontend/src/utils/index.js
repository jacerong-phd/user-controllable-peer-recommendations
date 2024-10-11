import { Animated } from 'react-native';


/* Hiding header:
 * https://muhammetaydinn.medium.com/hide-header-when-scrolling-down-in-react-native-without-package-2bc74c35e23
 * https://snack.expo.dev/@almaju/react-navigation:-animated-header-on-scroll
 */
export const HEADER_SCROLL_Y = new Animated.Value(0);
const HEADER_DIFF_CLAMP = Animated.diffClamp(HEADER_SCROLL_Y, 0, 64);
export const HEADER_TRANSLATE_Y = HEADER_DIFF_CLAMP.interpolate({
    inputRange: [0, 64],
    outputRange: [0, -64],
});


export const range = n => [...Array(n).keys()];


export function round(value, precision) {
    /*
     * Source: <https://stackoverflow.com/a/7343013>
     */
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}


export function makePaginationButtons(currentPage, totalPages, maxButtonsToShow=4) {
    /*
     * WARNING:
     * This solution is not scalable since there are no numerical icons beyond 9.
     * Therefore, one workaround would be to increase the number of items per page.
     */

    const buttons = [];

    // First page
    // buttons.push(
    //    ['page-first', 1, currentPage != 1 ? false : true]
    //);

    // Prev. page
    buttons.push(
        ['chevron-left', (currentPage - 1), currentPage > 1 ? false : true]
    );

    const leftSideButtons = Math.floor(maxButtonsToShow / 2);
    const startPage = Math.max(1, currentPage - leftSideButtons);

    const rightSideButtons = maxButtonsToShow - leftSideButtons;
    const endPage = Math.min(totalPages, currentPage + rightSideButtons);

    for (let i=startPage; i<=endPage; i++) {
        buttons.push([`numeric-${i}`, i, i == currentPage ? true : false]);
    }

    // Next page
    buttons.push(
        ['chevron-right', (currentPage + 1), currentPage < totalPages ? false : true]
    );

    // Last page
    // buttons.push(
    //    ['page-last', totalPages, currentPage != totalPages ? false : true]
    //);

    return buttons;
}


export function toTitleCase(str) {
    /*
     * Source: <https://stackoverflow.com/a/196991>
     */
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}


export function textCleaning(str) {
    const txt = str.trim().replace(/\s{2,}/g, ' ');
    return txt.charAt(0).toUpperCase() + txt.substr(1);
}