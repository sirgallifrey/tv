var React = require('react');
var moment = require('moment');
var ServerLogs = require('./serverLogs');
var DateTimeFormatter = require('../utils/dateTimeFormatter');

var Requests = React.createClass({

    render: function() {
        return (
            <div>
                {this.props.requests.map(this._requestRow)}
            </div>
        );
    },

    _requestRow: function(request, index) {
        var stripe = index % 2 === 0 ? 'dark' : 'light';
        var statusCodeContent = request.statusCode !== undefined ? request.statusCode : <div className="spinner"></div>;

        rowClasses = ['request', stripe, 'row'];

        if(this._requestHasErrors(request)) {
            rowClasses.push('error');
        } else if(this._requestHasWarnings(request)) {
            rowClasses.push('warning');
        }

        var serverLogs = null;
        if(request.active) {
            rowClasses.push('active');
            serverLogs = <ServerLogs stripe={stripe} serverLogs={request.serverLogs} />;
        }

        return (
            <div key={request.id}>
                <div className={rowClasses.join(' ')} onClick={this._toggle.bind(this, index)}>
                    <div className="col-xs-3 path">{request.path}</div>
                    <div className="col-xs-1 method">{request.method}</div>
                    <div className="col-xs-1 status">{statusCodeContent}</div>
                    <div className="col-xs-5 data">{JSON.stringify(request.data)}</div>
                    <div className="col-xs-2 timestamp">
                        <span className="time">{DateTimeFormatter.longTime(request.timestamp)}</span>
                        <span className="date">{DateTimeFormatter.shortDate(request.timestamp)}</span>
                    </div>
                </div>
                {serverLogs}
            </div>
        );
    },

    _requestHasErrors: function(request) {
        return request.responseTimeout || request.statusCode >= 500;
    },

    _requestHasWarnings: function(request) {
        return request.statusCode >= 400 && request.statusCode < 500;
    },

    _toggle: function(requestIndex) {
        var request = this.props.requests[requestIndex];
        request.active = !!!request.active;
        this.setState(this.props.requests);
    },

});

module.exports = Requests;
