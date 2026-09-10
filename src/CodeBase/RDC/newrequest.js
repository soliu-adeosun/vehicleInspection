loadNewRequestComponent = function () {
  if (MainApplication.cachedState.mode) {
    whenNewRequestDependeciesLoaded();
  } else {
    setTimeout(function () {
      MainApplication.cachedState.pageStateCall = loadNewRequestComponent;
    }, 1000);
  }
};

var AppRequest;
var customWorkflowEngine;

MainApplication.NewRequestComponent.ApplicationDetails = function () {
  this.url = window.location.href;
  this.itemId = null;
  this.mode = null;
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
  this.returned = null;
  this.sectionArr = [];
  this.sections = {};
  this.finalrating = [];
  this.questionSetCounter = 0;
  this.groupProperties = {};
  this.hodName = "";
  this.hodEmail = "";
  this.ncData = [];
  this.revisionDate = "";
  this.DocumentID = "";
  this.tableRecord = {};
  this.retrievedtableData = {};
  this.action = "";
};

function whenNewRequestDependeciesLoaded() {
  $spcontext.assignAttributes();
  MainApplication.CurrentPageSubmitFunction =
    MainApplication.NewRequestComponent.confirmSubmit;
  AppRequest = new MainApplication.NewRequestComponent.ApplicationDetails();
  globalDefinitions.extendStages();

  AppRequest.itemId = $spcontext.getParameterByName(
    "itemid",
    window.location.href,
  );
  AppRequest.mode = $spcontext.getParameterByName("mode", window.location.href);

  customWorkflowEngine = new WorkflowManagerEngine(CurrentUserProperties);
  globalDefinitions.SetWorkflowRouting(customWorkflowEngine);
  customWorkflowEngine
    .routeEngine(customWorkflowEngine)
    .setCurrentUserAsInitiator();
  if (AppRequest.itemId !== null && AppRequest.itemId !== "") {
    MainApplication.NewRequestComponent.recoverListData();
  } else {
    MainApplication.NewRequestComponent.generateTable();
  }

  globalDefinitions.closeLoader();
}

MainApplication.NewRequestComponent.recoverListData = function () {
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
      "ID",
      "Title",
      "Date",
      "DriverName",
      "Mileage",
      "Vehicle",
      "Registration",
      "Comment",
      "Status",
      "WeekNumber",
      "ProcessStatus",
      "Month",
      "Year",
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
          //     PageSecurity(customWorkflowEngine.stages.securityModeView, listProperties.Current_Approver, listProperties.Approval_ProcessStatus, function (error) {

          // if (MainApplication.configuredTaskMembers[listProperties.Current_Approver].belongs) {
          if (typeof error === "undefined") {
            listProperties.WeekStart = $spcontext.stringnifyDate({
              value: listProperties.WeekStart,
              includeTime: false,
              format: "yy-mm-dd",
            });

            listProperties.WeekEnd = $spcontext.stringnifyDate({
              value: listProperties.WeekEnd,
              includeTime: false,
              format: "yy-mm-dd",
            });

            listProperties.Status = $spcontext.JSONToObject(
              listProperties.Status,
            );

            AppRequest.retrievedtableData = listProperties.Status;

            MainApplication.buildInspectionTable("data-table", "edit");
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

// Form submission processes
MainApplication.NewRequestComponent.confirmSubmit = function (action) {
  AppRequest.action = action;
  MainApplication.confirmAction =
    MainApplication.NewRequestComponent.actionConfirmed;
  $("#confirmModal").modal("show");
};

MainApplication.NewRequestComponent.actionConfirmed = function () {
  MainApplication.NewRequestComponent.saveDataToList();
};

MainApplication.NewRequestComponent.saveDataToList = function () {
  globalDefinitions.onActionClicked();

  var formData = $spcontext.bind({});

  if ($spcontext.checkPassedValidation()) {
    AppRequest.tableRecord = MainApplication.NewRequestComponent.collectData();
    formData.RequestCreated = $spcontext.serverDate();

    formData.Status = AppRequest.tableRecord;
    formData.Status = JSON.stringify(formData.Status);

    const selectedVehicle = document.getElementById("vehicle-select");

    const selectedOption = selectedVehicle.options[selectedVehicle.selectedIndex];

    const registration = selectedOption.dataset.registration;
    formData.Registration = registration;

    const inspectionDate = new Date($("#cm-date").val());

    formData.WeekNumber =
      MainApplication.NewRequestComponent.getWeekNumber(inspectionDate);
    formData.WeekNumber = Number(formData.WeekNumber);
    formData.Year = $spcontext.serverDate().getFullYear();
    formData.Month = $spcontext.serverDate().getMonth();
    formData.InitiatorName = CurrentUserProperties.title;
    formData.InitiatorEmailAddress = CurrentUserProperties.login;
    formData.HOD = SP.FieldUserValue.fromUser(MainApplication.staffDetails[formData.InitiatorEmailAddress].HodEmail);
    if (AppRequest.action === "save") {
      formData.ProcessStatus = "Save";
    } else if (AppRequest.action === "submit") {
      formData.ProcessStatus = "Submit";
    }

    console.log("Form Data to be submitted:", formData);
    MainApplication.NewRequestComponent.proceedToList(formData);
  } else {
    globalDefinitions.HandlerError("", true);
    globalDefinitions.onActionFailed();
  }
};

MainApplication.NewRequestComponent.proceedToList = function (formData) {
  if (AppRequest.itemId == null) {
    viContext.createItems(
      [formData],
      globalDefinitions.stageDefinitions.listname,
      function (createdItemsProperties) {
        var itemID = createdItemsProperties[0].get_id();
        var updateObj = {};
        updateObj.ID = itemID;
        updateObj.WorkflowRequestID =
          globalDefinitions.stageDefinitions.workflowcode + itemID;

        AppRequest.requestDetails = formData;
        AppRequest.requestDetails.WorkflowRequestID =
          updateObj.WorkflowRequestID;
        updateObj.Title = updateObj.WorkflowRequestID;

        updateObj.Year = $spcontext.serverDate().getFullYear();

        viContext.updateItems(
          [updateObj],
          globalDefinitions.stageDefinitions.listname,
          function () {
            globalDefinitions.HandlerSuccess(`Survey submitted successfully`);
            //   MainApplication.NewRequestComponent.resetFoodInspectionForm();
            // $spcontext.redirect("#/", false);
			$spcontext.resetBind();
            globalDefinitions.closeLoader();

            globalDefinitions.AuditLogManager_SaveLog({
              Action: `Submitted Vehicle Inspection Form ${AppRequest.requestDetails.WorkflowRequestID}`,
            });
            // });

            globalDefinitions.onActionCompleted();
			
			whenNewRequestDependeciesLoaded();
          },
        );
      },
    );
  } else {
    formData.ID = AppRequest.requestDetails.ID;

    viContext.updateItems(
      [formData],
      globalDefinitions.stageDefinitions.listname,
      function () {
        globalDefinitions.HandlerSuccess(`Survey saved successfully`);
        //   MainApplication.NewRequestComponent.resetFoodInspectionForm();
		$spcontext.resetBind();
        // $spcontext.redirect("#/", false);
        globalDefinitions.closeLoader();

        globalDefinitions.AuditLogManager_SaveLog({
          Action: `Saved Vehicle Inspection Form ${AppRequest.requestDetails.WorkflowRequestID}`,
        });
        // });

        globalDefinitions.onActionCompleted();
		whenNewRequestDependeciesLoaded();
      },
    );
  }
};

MainApplication.NewRequestComponent.getWeekNumber = function (date) {
  // Clone the date so we don't modify the original
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );

  // Set to nearest Thursday
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));

  // Get first day of the year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));

  // Calculate full weeks
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};

MainApplication.NewRequestComponent.generateTable = function () {
  const inspectionItems = MainApplication.inspectionItems;

  const tbody = document.getElementById("data-table");
  tbody.innerHTML = "";

  inspectionItems.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>

      <td class="inspection-item">
        ${item}
      </td>

      <td class="status-cell">
        <label class="status-option good">
          <input 
            type="radio" 
            name="status-${index}" 
            value="Good"
            class="status-radio"
            data-item="${item}"
          >
          <span>Good</span>
        </label>

        <label class="status-option bad">
          <input 
            type="radio" 
            name="status-${index}" 
            value="Bad"
            class="status-radio"
            data-item="${item}"
          >
          <span>Bad</span>
        </label>
      </td>
    `;

    tbody.appendChild(row);
  });
};

MainApplication.NewRequestComponent.collectData = function () {
  const radios = document.querySelectorAll(".status-radio");

  const result = [];

  radios.forEach((radio) => {
    if (radio.checked) {
      const item = radio.getAttribute("data-item");
      const status = radio.value;

      const entry = {};
      entry[item] = status;

      result.push(entry);
    }
  });

  console.log(result);

  return result;
};
