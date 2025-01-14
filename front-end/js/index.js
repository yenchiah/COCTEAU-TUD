(function () {
  "use strict";

  /**
   * Create the html elements for a scenario.
   * @private
   * @param {string} title - the title of the scenario.
   * @param {string} imageSrc - the source URL of an image for the scenario.
   * @returns {Object} - a jQuery DOM object.
   */
  function createScenarioHTML(title, imageSrc) {
    var html = '<a href="javascript:void(0)" class="flex-column"><img src="' + imageSrc + '"><div>' + title + '</div></a>';
    return $(html);
  }

  /**
   * Add the clicking event to a scenario image (for the deployment mode).
   * @private
   * @param {Object} envObj - environment object (in environment.js).
   * @param {Object} $element - the jQuery object of the scenario image.
   */
  function addDeploymentScenarioClickEvent(envObj, $element) {
    $element.on("click", function () {
      var d = $(this).data("raw");
      var scenarioId = d["id"];
      var topicId = d["topic_id"];
      var queryString = "?scenario_id=" + scenarioId + "&topic_id=" + topicId;
      // Get the scenario answers
      envObj.getAnswerOfCurrentUserByScenarioId(scenarioId, function (data) {
        var answer = data["data"];
        if (typeof answer !== "undefined" && answer.length > 0) {
          // Go to the vision page when there are scenario answers
          window.location.href = "vision.html" + queryString;
        } else {
          // Go to the opinion page when there are no scenario answers
          window.location.href = "opinion.html" + queryString;
        }
      });
    });
  }

  /**
   * Initialize the user interface.
   * @private
   * @param {Object} envObj - environment object (in environment.js).
   */
  function initUI(envObj) {
    envObj.getAllScenario(function (data) {
      var scenarios = data["data"];
      if ($.isEmptyObject(scenarios)) {
        envObj.showErrorPage("Oops, no data (please add scenarios)");
      } else {
        var $scenario = $("#scenario");
        for (var i = 0; i < scenarios.length; i++) {
          var d = scenarios[i];
          if (d["mode"] == 0) {
            // Only show mode 0 (i.e., the deployment setting) for the index page
            var $t = createScenarioHTML(d["title"], "img/" + d["image"]);
            $t.data("raw", d);
            addDeploymentScenarioClickEvent(envObj, $t);
            $scenario.append($t);
          }
        }
        envObj.showPage();
      }
    });
  }

  /**
   * Initialize the page.
   * @private
   */
  function init() {
    var env = new periscope.Environment({
      "ready": function (envObj) {
        initUI(envObj);
      },
      "fail": function (message) {
        console.error(message);
      }
    });
  }
  $(init);
})();