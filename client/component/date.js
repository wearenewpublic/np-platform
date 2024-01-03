import { translateLabel } from "./translation";

export function formatDate(date, language = 'english') {
    const currentDate = new Date();
    const inputDate = new Date(date);

    const diffInSeconds = Math.floor((currentDate - inputDate) / 1000);

    if (diffInSeconds < 60) {
        return translateLabel({label: 'Just now', language});
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        if (minutes == 1) {
            return translateLabel({label: '1 minute ago', language});
        } else {
            return translateLabel({label: '{minutes} minutes ago', language, formatParams:{minutes}});
        }
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        if (hours == 1) {
            return translateLabel({label: '1 hour ago', language});
        } else {
            return translateLabel({label: '{hours} hours ago', language, formatParams:{hours}});
        }
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        if (days == 1) {
            return translateLabel({label: '1 day ago', language});
        } else {
            return translateLabel({label: '{days} days ago', language, formatParams:{days}});
        }
    } else if (currentDate.getFullYear() == inputDate.getFullYear()) {
        const formattedDate = inputDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
        return formattedDate;
    } else {
        const formattedDate = inputDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
        return formattedDate;
    }
}

export function formatMiniDate(date, language = 'english') {
    const currentDate = new Date();
    const inputDate = new Date(date);

    const diffInSeconds = Math.floor((currentDate - inputDate) / 1000);

    if (diffInSeconds < 60) {
        return translateLabel({label: 'now', language});
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return translateLabel({label: '{minutes}m', language, formatParams:{minutes}});
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return translateLabel({label: '{hours}h', language, formatParams:{hours}});
    } else if (diffInSeconds < 31536000) {
        const days = Math.floor(diffInSeconds / 86400);
        return translateLabel({label: '{days}d', language, formatParams:{days}});
    } else {
        const years = Math.floor(diffInSeconds / 31536000);
        return translateLabel({label: '{years}y', language, formatParams:{years}});
    }
}