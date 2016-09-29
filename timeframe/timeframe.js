angular.module('rmsv2', ['angularMoment', 'rzModule']);


var timeframeComponent = {
    templateUrl: 'timeframe/timeframe.html',
    controller: TimeframeController,
    controllerAs: 'tf'
};

angular.module('rmsv2').component('mzTimeframe', timeframeComponent);

/* @ngInject */
function TimeframeController(timeframeService) {
    this.timeframeService = timeframeService;

    this.seasons = [];
    this.timeline = null;
}

TimeframeController.prototype.$onInit = function() {
    this.getSeasons();
};

TimeframeController.prototype.getSeasons = function() {
    var vm = this;

    this.timeframeService.getSeasons()
        .then(function(seasons) {
            vm.seasons = seasons;
        });
};

TimeframeController.prototype.addSeason = function(startDate) {
    this.timeframeService.addSeason(startDate);
    this.getSeasons();
};

TimeframeController.prototype.moveSeason = function(season) {
    this.timeframeService.moveSeason(season);
    this.getSeasons();
};

TimeframeController.prototype.removeSeason = function(season) {
    this.timeframeService.removeSeason(season);
    this.getSeasons();
};
