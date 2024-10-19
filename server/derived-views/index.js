import {CommentsOnProfile} from "./comments-on-profile";

var derived_views = [CommentsOnProfile]

function getDerivedViews() {
    return derived_views;
}
export {getDerivedViews};

function addDerivedViews(newViews) {
    derived_views = [...derived_views, ...newViews];
}
export {addDerivedViews};

