var timeframeSeasonListComponent = {
    templateUrl: 'timeframe/tf-season-list/tf-season-list.html',
    controller: TimeframeSeasonListController,
    controllerAs: 'sl',
    bindings: {
        seasons: '<',
        onRemove: '&'
    }
};

angular.module('mzTimeline').component('tfSeasonList', timeframeSeasonListComponent);

/* @ngInject */
function TimeframeSeasonListController() {
    this.MIN_SEASONS = 1;
}

TimeframeSeasonListController.prototype.removeSeason = function(season) {
    this.onRemove({season: season});
};
