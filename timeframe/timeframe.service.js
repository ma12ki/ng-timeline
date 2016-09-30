angular.module('mzTimeline').service('timeframeService', TimeframeService);

var seasonId = 0;

function TimeframeService($q) {
    this.$q = $q;
    this._seasons = getDummySeasons();
}

TimeframeService.prototype.getSeasons = function() {
    return this.$q.when(this._seasons);
};

TimeframeService.prototype.addSeason = function(startDate) {
    if (!this._hasMaxSeasons()) {
        if (this._isDateWithinBounds(startDate)) {
            this._addSeason(startDate);
        }
    } else {
        // TODO: modal
        alert('max seasons');
    }
};

TimeframeService.prototype._hasMinSeasons = function() {
    var MIN_SEASONS = 1;
    return this._seasons.length === MIN_SEASONS;
};

TimeframeService.prototype._hasMaxSeasons = function() {
    var MAX_SEASONS = 8;
    return this._seasons.length === MAX_SEASONS;
};

TimeframeService.prototype._isDateWithinBounds = function(date) {
    var MIN_DISTANCE = 3;
    var season = this._getOverlappingSeason(date);

    var min = moment(season.start).add(MIN_DISTANCE, 'days');
    var max = moment(season.end).subtract(MIN_DISTANCE, 'days');

    return moment(date).isBetween(min, max, '[]');
};

TimeframeService.prototype._getOverlappingSeason = function(date) {
    date = moment(date);
    return this._seasons.filter(function(season) {
        return date.isBetween(moment(season.start), moment(season.end));
    })[0];
};

TimeframeService.prototype._addSeason = function(startDate) {
    var overlappingSeason = this._getOverlappingSeason(startDate);
    var endDate = moment(overlappingSeason.end).toDate();
    overlappingSeason.end = moment(startDate).subtract(1, 'days').toDate();
    this._updateSeason(overlappingSeason);

    this._seasons.push(this._createSeason(startDate, endDate));
};

TimeframeService.prototype._updateSeason = function(seasonToUpdate) {
    this._seasons = this._seasons.map(function(season) {
        if (season.id === seasonToUpdate.id) {
            return seasonToUpdate;
        }
        return season;
    });
};

TimeframeService.prototype._createSeason = function(startDate, endDate) {
    return {
        start: startDate,
        end: endDate,
        id: seasonId++
    };
};

TimeframeService.prototype.removeSeason = function(season) {
    if (!this._hasMinSeasons()) {
        this._removeSeason(season);
        this._fillRemainder(season);
    } else {
        // TODO: modal
        alert('min seasons');
    }
};

TimeframeService.prototype._removeSeason = function(seasonToRemove) {
    this._seasons = this._seasons.filter(function(season) {
        return season.id !== seasonToRemove.id;
    });
};

// TODO: come up with a better name for this function
TimeframeService.prototype._fillRemainder = function(season) {
    var seasonToUpdate;

    if (this._isFirstSeason(season)) {
        seasonToUpdate = this._getNextSeason(season);
        seasonToUpdate.start = season.start;
    } else {
        seasonToUpdate = this._getPrevSeason(season);
        seasonToUpdate.end = season.end;
    }

    this._updateSeason(seasonToUpdate);
};

TimeframeService.prototype._isFirstSeason = function(season) {
    return moment(season.start).format('DD.MM') === '01.01';
};

TimeframeService.prototype.moveSeason = function(season) {
    var nextSeasonStart = moment(season.end).add(1, 'days').toDate();
    var nextSeason = this._getNextSeason(season);

    nextSeason.start = nextSeasonStart;

    this._updateSeason(season);
    this._updateSeason(nextSeason);
};

TimeframeService.prototype._getNextSeason = function(season) {
    var seasonEnd = moment(season.end);

    return this._getSortedSeasons().filter(function(s) {
        return moment(s.end).isAfter(seasonEnd);
    })[0];
};

TimeframeService.prototype._getPrevSeason = function(season) {
    var seasonStart = moment(season.start);

    return this._getSortedSeasons().filter(function(s) {
        return moment(s.start).isBefore(seasonStart);
    }).reverse()[0];
};

TimeframeService.prototype._getSortedSeasons = function() {
    return this._seasons.sort(function(s1, s2) {
        return moment(s1.start).dayOfYear() - moment(s2.start).dayOfYear();
    });
};

////////////////////////////

function getDummySeasons() {
    return [
        {id: seasonId++, start: new Date('2016-01-01'), end: new Date('2016-06-20')},
        {id: seasonId++, start: new Date('2016-06-21'), end: new Date('2016-12-31')}
    ];
}
