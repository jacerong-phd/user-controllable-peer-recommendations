import { sessionStorage } from '@utils/storage';


function getCookieIntoArray(key) {
    return sessionStorage.contains(key)
        ? sessionStorage.getString(key).split(',')
        : [];
}


export function getConnectRequests() {
    return getCookieIntoArray('connectRequests');
}


export function setConnectRequests(elem) {
    let connectRequests = getConnectRequests();

    elem = elem.toString();
    if(!connectRequests.includes(elem))
        connectRequests.push(elem);

    sessionStorage.set('connectRequests', connectRequests.join(','));
}


export function connectRequestExists(elem) {
    const connectRequests = getConnectRequests();

    elem = elem.toString();
    return connectRequests.includes(elem);
}


export function getDiscardedRecommendations() {
    return getConnectRequests('discardedRecommendations');
}


export function setDiscardedRecommendations(elem) {
    let discardedRecommendations = getDiscardedRecommendations();

    elem = elem.toString();
    if(!discardedRecommendations.includes(elem)) {
        discardedRecommendations.push(elem);
        sessionStorage.set('discardedRecommendations', discardedRecommendations.join(','));
    }
}


export function isRecommendationDiscarded(elem) {
    const discardedRecommendations = getDiscardedRecommendations();

    elem = elem.toString();
    return discardedRecommendations.includes(elem);
}