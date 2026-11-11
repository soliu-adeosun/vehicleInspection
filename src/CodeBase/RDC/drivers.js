loadDriversComponent = function () {
  if (MainApplication.cachedState.mode) {
    whenDriversDependenciesLoaded();
  } else {
    setTimeout(function () {
      MainApplication.cachedState.pageStateCall = loadDriversComponent;
    }, 1000);
  }
};

MainApplication.DriversComponent = MainApplication.DriversComponent || {};

MainApplication.DriversComponent.ApplicationDetails = function () {
  this.editingId = null;
};

var DriversApp;

function whenDriversDependenciesLoaded() {
  globalDefinitions.callLoader();
  DriversApp = new MainApplication.DriversComponent.ApplicationDetails();

  MainApplication.DriversComponent.bindEvents();
  MainApplication.DriversComponent.loadTable();
  setTimeout(function () {
  globalDefinitions.closeLoader();
  }, 2000);
}

MainApplication.DriversComponent.bindEvents = function () {
  $("#driver-form").off("submit").on("submit", function (e) {
    e.preventDefault();
    MainApplication.DriversComponent.saveDriver();
  });

  $("#driver-cancel-btn")
    .off("click")
    .on("click", function () {
      MainApplication.DriversComponent.resetForm();
    });

  $("#driver-refresh-btn")
    .off("click")
    .on("click", function () {
      MainApplication.DriversComponent.loadTable();
    });
};

MainApplication.DriversComponent.resetForm = function () {
  DriversApp.editingId = null;
  $("#driver-title").val("");
  $("#driver-form-title").text("Add Driver");
  $("#driver-save-btn").text("Add Driver");
  $("#driver-cancel-btn").addClass("hidden");
};

MainApplication.DriversComponent.loadTable = function () {
  var query = [
    {
      ascending: "TRUE",
      orderby: "Title",
    },
  ];

  viContext.getItem(
    "Drivers",
    viContext.camlBuilder([query]),
    function (_spMeta) {
      MainApplication.drivers = [];
      var listEnumerator = _spMeta.getEnumerator();
      var rows = "";

      while (listEnumerator.moveNext()) {
        var currentItem = listEnumerator.get_current();
        var id = currentItem.get_id();
        var title = $spcontext.checkNull(currentItem.get_item("Title"));

        MainApplication.drivers.push({
          ID: id,
          Title: title,
        });

        rows += `
          <tr data-id="${id}">
            <td>${title}</td>
            <td>
              <button type="button" class="btn btn-sm btn-primary btn-icon driver-edit-btn" data-id="${id}" title="Edit">
                <i class="fa-solid fa-pen" style="font-size:11px"></i>
              </button>
              <button type="button" class="btn btn-sm btn-ghost btn-icon driver-delete-btn" data-id="${id}" title="Delete">
                <i class="fa-solid fa-trash" style="font-size:11px"></i>
              </button>
            </td>
          </tr>`;
      }

      $("#drivers-table-body").html(
        rows ||
          '<tr><td colspan="2" style="text-align:center;">No drivers found. Add one above.</td></tr>'
      );
      $("#drivers-recordcount").text(MainApplication.drivers.length);

      $(".driver-edit-btn")
        .off("click")
        .on("click", function () {
          var id = $(this).data("id");
          MainApplication.DriversComponent.editDriver(id);
        });

      $(".driver-delete-btn")
        .off("click")
        .on("click", function () {
          var id = $(this).data("id");
          MainApplication.DriversComponent.deleteDriver(id);
        });
    }
  );
  globalDefinitions.closeLoader();
};

MainApplication.DriversComponent.editDriver = function (id) {
  var driver = (MainApplication.drivers || []).find(function (d) {
    return d.ID == id;
  });
  if (!driver) {
    MainApplication.notyf.error("Driver not found");
    return;
  }

  DriversApp.editingId = id;
  $("#driver-title").val(driver.Title);
  $("#driver-form-title").text("Edit Driver");
  $("#driver-save-btn").text("Update Driver");
  $("#driver-cancel-btn").removeClass("hidden");
  $("html, body").animate({ scrollTop: 0 }, 300);
};

MainApplication.DriversComponent.saveDriver = function () {
  var title = $.trim($("#driver-title").val());

  if (!title) {
    MainApplication.notyf.error("Driver name is required");
    return;
  }

  globalDefinitions.callLoader();

  var formData = {
    Title: title,
  };

  if (DriversApp.editingId) {
    formData.ID = DriversApp.editingId;
    viContext.updateItems(
      [formData],
      "Drivers",
      function () {
        MainApplication.notyf.success("Driver updated successfully");
        MainApplication.DriversComponent.resetForm();
        MainApplication.DriversComponent.loadTable();
        globalDefinitions.closeLoader();
        globalDefinitions.AuditLogManager_SaveLog({
          Action: `Updated driver ${title}`,
        });
      }
    );
  } else {
    viContext.createItems(
      [formData],
      "Drivers",
      function () {
        MainApplication.notyf.success("Driver added successfully");
        MainApplication.DriversComponent.resetForm();
        MainApplication.DriversComponent.loadTable();
        globalDefinitions.closeLoader();
        globalDefinitions.AuditLogManager_SaveLog({
          Action: `Added driver ${title}`,
        });
      }
    );
  }
};

MainApplication.DriversComponent.deleteDriver = function (id) {
  if (!confirm("Are you sure you want to delete this driver?")) {
    return;
  }

  globalDefinitions.callLoader();

  if (typeof viContext.deleteItems === "function") {
    viContext.deleteItems(
      [id],
      "Drivers",
      function () {
        MainApplication.notyf.success("Driver deleted");
        MainApplication.DriversComponent.loadTable();
        globalDefinitions.closeLoader();
        globalDefinitions.AuditLogManager_SaveLog({
          Action: `Deleted driver ID ${id}`,
        });
      }
    );
  } else if (typeof viContext.deleteList === "function") {
    viContext.deleteList(
      "Drivers",
      id,
      function () {
        MainApplication.notyf.success("Driver deleted");
        MainApplication.DriversComponent.loadTable();
        globalDefinitions.closeLoader();
      }
    );
  } else {
    try {
      var ctx = new SP.ClientContext.get_current();
      var list = ctx.get_web().get_lists().getByTitle("Drivers");
      var item = list.getItemById(id);
      item.deleteObject();
      ctx.executeQueryAsync(
        function () {
          MainApplication.notyf.success("Driver deleted");
          MainApplication.DriversComponent.loadTable();
          globalDefinitions.closeLoader();
          globalDefinitions.AuditLogManager_SaveLog({
            Action: `Deleted driver ID ${id}`,
          });
        },
        function (sender, args) {
          MainApplication.notyf.error(
            "Delete failed: " + args.get_message()
          );
          globalDefinitions.closeLoader();
        }
      );
    } catch (err) {
      MainApplication.notyf.error(
        "Delete is not supported in this environment. Please delete from the SharePoint list."
      );
      globalDefinitions.closeLoader();
    }
  }
};
