var derived_views = []

function getDerivedViews() {
    return derived_views;
}
exports.getDerivedViews = getDerivedViews;

function addDerivedViews(newViews) {
    derived_views = [...derived_views, ...newViews];
}
exports.addDerivedViews = addDerivedViews;

