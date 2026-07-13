loadViewRequestComponent = function () {
  if (MainApplication.cachedState.mode) {
    whenViewRequestDependeciesLoaded();
  } else {
    MainApplication.cachedState.pageStateCall = loadViewRequestComponent;
  }
};

var AppRequest;
var customWorkflowEngine;

MainApplication.ViewRequestComponent.ApplicationDetails = function () {
  this.url = window.location.href;
  this.itemId = null;
  this.requestDetails = {};
  this.Attachments = [];
  this.FileUrls = {};
  this.FolderUrl = "";
  this.AttachmentLoader = {};
  this.messageTemplate = {};
  this.feedback = false;
  this.approverComments = "";
  this.transactionHistory = [];
  this.defaultStage = "AA0";
  this.returned = false;
  this.messageType = "standard";
  this.documentsToUpdate = {};
  this.retrievedtableData = {};
};

whenViewRequestDependeciesLoaded = function () {
  globalDefinitions.callLoader();
  globalDefinitions.extendStages();
  $spcontext.assignAttributes();

  $spcontext.filesDictionary = {};

  AppRequest = new MainApplication.ViewRequestComponent.ApplicationDetails();
  // globalDefinitions.extendStages();
  // customWorkflowEngine = new WorkflowManagerEngine(CurrentUserProperties);
  // globalDefinitions.SetWorkflowRouting(customWorkflowEngine);
  AppRequest.itemId = $spcontext.getParameterByName(
    "itemid",
    window.location.href,
  );


  $spcontext.applyValidationEvents();
  console.log("View Request Dependencies Loaded");
  MainApplication.ViewRequestComponent.recoverListData();
  setTimeout(function () {
    globalDefinitions.closeLoader();
  }, 2000);
};

MainApplication.ViewRequestComponent.recoverListData = function () {
  if (AppRequest.itemId !== null && AppRequest.itemId !== "") {
    var query = viContext.camlBuilder([
      {
        rowlimit: 1,
      },

      {
        operator: "Eq",
        field: "WorkflowRequestID",
        type: "Text",
        val: AppRequest.itemId,
      },
    ]);

    var extraProperties = [
            "ID", "Title", "WeekStart", "WeekEnd", "WkStartKms", "WkEndKms", "Operator", "Vehicle", "Registration", "Comment",
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "WeekNumber", "Month", "Year", "WorkflowRequestID"
        ];

    viContext.getListToControl(
      globalDefinitions.stageDefinitions.listname,
      query,
      extraProperties,
      function (listProperties) {
        if ($.isEmptyObject(listProperties)) {
          MainApplication.notyf.error("Request does not exist...");
          $spcontext.redirect("#/", false);
          globalDefinitions.closeLoader();
        } else {
          // customWorkflowEngine.routeEngine(customWorkflowEngine).updateRoutesinFlow(listProperties, function (resolved) {
          //     customWorkflowEngine.routeEngine(customWorkflowEngine).
          //     PageSecurity(customWorkflowEngine.stages.securityModeView, listProperties.Current_Approver, listProperties.Approval_Status, function (error) {

          // if (MainApplication.configuredTaskMembers[listProperties.Current_Approver].belongs) {
          if (typeof error === "undefined") {
            listProperties.WeekStart = $spcontext.stringnifyDate({
              value: listProperties.WeekStart,
              includeTime: false,
              format: "dd/mm/yy",
            });

            listProperties.WeekEnd = $spcontext.stringnifyDate({
              value: listProperties.WeekEnd,
              includeTime: false,
              format: "dd/mm/yy",
            });

            listProperties.Monday = $spcontext.JSONToObject(listProperties.Monday);
            listProperties.Tuesday = $spcontext.JSONToObject(listProperties.Tuesday);
            listProperties.Wednesday = $spcontext.JSONToObject(listProperties.Wednesday);
            listProperties.Thursday = $spcontext.JSONToObject(listProperties.Thursday);
            listProperties.Friday = $spcontext.JSONToObject(listProperties.Friday);

            AppRequest.retrievedtableData = {Monday : listProperties.Monday, Tuesday: listProperties.Tuesday,
              Wednesday: listProperties.Wednesday, Thursday: listProperties.Thursday, Friday: listProperties.Friday
            }

            MainApplication.buildInspectionTable("view-table", "view");
            AppRequest.requestDetails = listProperties;

            $spcontext.htmlBind(listProperties);
            globalDefinitions.closeLoader();
          } else {
            globalDefinitions.HandlerError(
              "You are not allowed to access this request",
            );
            globalDefinitions.AuditLogManager_SaveLog({
              Action: `Unauthorized action on Request for document change ${listProperties.WorkflowRequestID}`,
              Message: "User is not allowed to act on this request",
            });
            setTimeout(function () {
              globalDefinitions.closeLoader();
            }, 1000);
            $spcontext.redirect("#/", false);
          }
          // }); //commented here

          // }); //commented here
        }
      },
    );
  } else {
    globalDefinitions.closeLoader();
    MainApplication.notyf.error("Invalid Request...");
    $spcontext.redirect("#/", false);
  }
};

// MainApplication.ViewRequestComponent.buildViewOnlyInspectionTable = function () {
//     const data = AppRequest.retrievedtableData;
//     if (!data || !data.Monday || !data.Tuesday) {
//         console.warn("No inspection data available");
//         return;
//     }

//     // Get all unique items from Monday (assuming all days have same items)
//     const sampleDay = data.Monday;
//     const items = sampleDay.map(entry => {
//         return Object.keys(entry).find(key => key !== "Defect");
//     }).filter(Boolean);

//     let html = `
//             <thead>
//                 <tr>
//                     <th>S/N</th>
//                     <th>Inspection Items</th>
//                     <th>Monday</th>
//                     <th>Tuesday</th>
//                     <th>Wednesday</th>
//                     <th>Thursday</th>
//                     <th>Friday</th>
//                     <th>Defect / Notes</th>
//                 </tr>
//             </thead>
//             <tbody>
//     `;

//     items.forEach((item, index) => {
//         const defect = data.Monday.find(entry => entry[item])?.Defect || "Nil";

//         html += `
//             <tr>
//                 <td>${index + 1}</td>
//                 <td style="border:1px solid #ccc; padding:10px; text-align:left;">${item}</td>
//                 <td>${data.Monday.find(e => e[item])?.[item] === "Yes" ? "✔" : "✘"}</td>
//                 <td>${data.Tuesday.find(e => e[item])?.[item] === "Yes" ? "✔" : "✘"}</td>
//                 <td>${data.Wednesday.find(e => e[item])?.[item] === "Yes" ? "✔" : "✘"}</td>
//                 <td>${data.Thursday.find(e => e[item])?.[item] === "Yes" ? "✔" : "✘"}</td>
//                 <td>${data.Friday.find(e => e[item])?.[item] === "Yes" ? "✔" : "✘"}</td>
//                 <td>${defect}</td>
//             </tr>
//         `;
//     });

//     html += `</tbody>`;

//     // Insert into your page - CHANGE THIS SELECTOR to match your container
//     const container = document.getElementById("view-table");

//     if (container) {
//         container.innerHTML = html;
//     } else {
//         console.error("Could not find container to append table");
//         document.body.insertAdjacentHTML('beforeend', `<table>${html}</table>`);
//     }
// };