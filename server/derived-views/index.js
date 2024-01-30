var derived_views = []
exports.derived_views = derived_views;

function addDerivedViews(newViews) {
    derived_views = [...derived_views, ...newViews];
}
exports.addDerivedViews = addDerivedViews;

