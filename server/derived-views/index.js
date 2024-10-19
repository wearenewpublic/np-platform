const { CommentsOnProfile } = require("./comments-on-profile");

var derived_views = [CommentsOnProfile]

function getDerivedViews() {
    return derived_views;
}
exports.getDerivedViews = getDerivedViews;

function addDerivedViews(newViews) {
    derived_views = [...derived_views, ...newViews];
}
exports.addDerivedViews = addDerivedViews;

