var timeframeSeasonSliderComponent = {
    templateUrl: 'timeframe/tf-season-slider/tf-season-slider.html',
    controller: TimeframeSeasonSliderController,
    controllerAs: 'ss',
    bindings: {
      seasons: '<',
      onAdd: '&',
      onMove: '&'
    }
};

angular.module('mzTimeline').component('tfSeasonSlider', timeframeSeasonSliderComponent);

/* @ngInject */
function TimeframeSeasonSliderController($document) {
    this.$document = $document;

    this.timeline = undefined;

    this.RIGHT_ARROW_KEY = 39;
    this.LEFT_ARROW_KEY = 37;
}

TimeframeSeasonSliderController.prototype.$onInit = function() {};

TimeframeSeasonSliderController.prototype.$onDestroy = function() {
    this.timeline = null;
    this.stopAdjustingSeasonWithMouse();
};

TimeframeSeasonSliderController.prototype.$postLink = function() {
    this.timeline = angular.element('tf-season-slider .timeline');
};

TimeframeSeasonSliderController.prototype.addSeason = function(event) {
  var startDate = this._getDateFromEvent(event);

  this.onAdd({startDate: startDate});
};

TimeframeSeasonSliderController.prototype._getDateFromEvent = function(event) {
    var dayOfYear = this._getDayOfYearFromEvent(event);

    return moment([this.getYear()]).dayOfYear(dayOfYear).toDate();
};

TimeframeSeasonSliderController.prototype._getDayOfYearFromEvent = function(event) {
    var positionInYear = this._getEventPositionInYear(event);
    var yearWidth = this._getYearWidth();

    return Math.round(positionInYear / yearWidth * this.getDaysInYear());
};

TimeframeSeasonSliderController.prototype._getEventPositionInYear = function(event) {
    return event.pageX - this.timeline.offset().left;
};

TimeframeSeasonSliderController.prototype._getYearWidth = function() {
    return this.timeline.width();
};

TimeframeSeasonSliderController.prototype.getDaysInYear = function() {
    return moment([this.getYear()]).isLeapYear() ? 366 : 365;
};

TimeframeSeasonSliderController.prototype.getYear = function() {
    if (this.seasons) {
        return this.seasons[0].start.getFullYear();
    }
};

TimeframeSeasonSliderController.prototype.getDateToYearRatio = function(date) {
    var dayOfYear = this.getDayOfYear(date);

    return dayOfYear / this.getDaysInYear();
};

TimeframeSeasonSliderController.prototype.getDayOfYear = function(date) {
    return moment(date).dayOfYear();
};

TimeframeSeasonSliderController.prototype.getSeasonColor = function(index) {
    return seasonColors[index];
};

TimeframeSeasonSliderController.prototype.startAdjustingSeasonWithMouse = function(season, lBound, rBound) {
    var vm = this;
    this.$document.on('mousemove', _.throttle(function(event) {
        vm.handleMouseMove(event, season, lBound, rBound);
    }, 30));
    this.$document.on('mouseup', this.stopAdjustingSeasonWithMouse.bind(this));
};

TimeframeSeasonSliderController.prototype.handleMouseMove = function(event, season, lBound, rBound) {
    var date = this.getDateWithinBounds(this._getDateFromEvent(event), lBound, rBound);
    this.adjustSeason(date, season);
};

TimeframeSeasonSliderController.prototype.handleKeyDown = function(event, season, lBound, rBound) {
    var date = this.getDateWithinBounds(this._shiftDateByKeyCode(season.end, event.keyCode), lBound, rBound);
    this.adjustSeason(date, season);
};

TimeframeSeasonSliderController.prototype.getDateWithinBounds = function(date, lBound, rBound) {
    var MIN_DISTANCE = 3;
    var min = moment(lBound).add(MIN_DISTANCE, 'days');
    var max = moment(rBound).subtract(MIN_DISTANCE, 'days');
    date = moment(date);

    if (date.isBefore(min, 'days')) {
        date = min;
    } else if (date.isAfter(max, 'days')) {
        date = max;
    }

    return date.toDate();
};

TimeframeSeasonSliderController.prototype._shiftDateByKeyCode = function(date, keyCode) {
    switch(keyCode) {
      case this.RIGHT_ARROW_KEY:
        return moment(date).add(1, 'days').toDate();
      case this.LEFT_ARROW_KEY:
        return moment(date).subtract(1, 'days').toDate();
      default:
        return date;
    }
};

TimeframeSeasonSliderController.prototype.adjustSeason = function(endDate, season, lBound, rBound) {
    if (!moment(endDate).isSame(moment(season.end))) {
        season.end = endDate;
        this.onMove({season: season});
    }
};

TimeframeSeasonSliderController.prototype.stopAdjustingSeasonWithMouse = function() {
    this.$document.off('mousemove');
    this.$document.off('mouseup');
};

var seasonColors = [
    '#272b66',
    '#2d559f',
    '#9ac147',
    '#639b47',
    '#e1e23b',
    '#f7941e',
    '#662a6c',
    '#9a1d34'
];
