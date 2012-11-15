/* This program is free software: you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public License
   as published by the Free Software Foundation, either version 3 of
   the License, or (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>. 
*/

otp.namespace("otp.modules.calltaker");

otp.modules.calltaker.PastQueryModel = 
    Backbone.Model.extend({});
    
otp.modules.calltaker.PastQueryCollection = 
    Backbone.Collection.extend({
    
    url: 'http://localhost:9000/getQueries',
    model: otp.modules.calltaker.PastQueryModel,
    
    sync: function(method, model, options) {
        //options.dataType = 'jsonp';
        options.data = options.data || {};
        return Backbone.sync(method, model, options);
    },
});    


/*otp.modules.calltaker.PastQueryWidget = 
    otp.Class(otp.widgets.Widget, {

    //module : null,
    
    header : null,
    queryList : null,
    
    initialize : function(id) {//, module) {
    
        otp.widgets.Widget.prototype.initialize.apply(this, arguments);
        //this.module = module;
        this.$().addClass('otp-pastQueryWidget');
        this.$().resizable();
        this.header = $("<div>Past Queries:</div>").appendTo(this.$());
        this.queryList = $("<div class='otp-pastQueryList'>Past Queries:</div>").appendTo(this.$());
    },
});*/    
        

otp.modules.calltaker.CallTakerModule = 
    otp.Class(otp.modules.multimodal.MultimodalPlannerModule, {

    moduleName  : "Call Taker Interface",
    moduleId    : "calltaker",

    queryLogger : null,    
    userName    : "anonymous",
    
    initialize : function(webapp) {
        otp.modules.multimodal.MultimodalPlannerModule.prototype.initialize.apply(this, arguments);

        this.queryLogger = new otp.core.QueryLogger(this);        
        this.userName = "demory";
        
        this.pastQueries = new otp.modules.calltaker.PastQueryCollection();
        this.pastQueries.on('reset', this.onResetQueries, this);
        this.fetchQueries();
    },
    
    onResetQueries : function(queries) {
        console.log("reset, size="+queries.length);
        queries.each(function(query) {
        }, this);
    },
    
    processPlan : function(tripPlan, queryParams, restoring) {
        otp.modules.multimodal.MultimodalPlannerModule.prototype.processPlan.apply(this, arguments);
        this.queryLogger.logQuery(queryParams, this.userName);    
    },

    queryLogged : function() {
        this.fetchQueries();
    },
    
    fetchQueries : function() {
        this.pastQueries.fetch({ data: { userName: this.userName }});
    },  
        
    CLASS_NAME : "otp.modules.calltaker.CallTakerModule"
});