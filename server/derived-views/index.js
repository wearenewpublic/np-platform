const { ProfileComment } = require("./profile-comment");

var derived_views = [ProfileComment]

function getDerivedViews() {
    return derived_views;
}
exports.getDerivedViews = getDerivedViews;

function addDerivedViews(newViews) {
    derived_views = [...derived_views, ...newViews];
}
exports.addDerivedViews = addDerivedViews;

