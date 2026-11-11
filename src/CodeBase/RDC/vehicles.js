loadVehiclesComponent = function () {
  if (MainApplication.cachedState.mode) {
    whenVehiclesDependenciesLoaded();
  } else {
    setTimeout(function () {
      MainApplication.cachedState.pageStateCall = loadVehiclesComponent;
    }, 1000);
  }
};

MainApplication.VehiclesComponent = MainApplication.VehiclesComponent || {};

MainApplication.VehiclesComponent.ApplicationDetails = function () {
  this.editingId = null;
};

var VehiclesApp;

function whenVehiclesDependenciesLoaded() {
  globalDefinitions.callLoader();
  VehiclesApp = new MainApplication.VehiclesComponent.ApplicationDetails();

  MainApplication.VehiclesComponent.bindEvents();
  MainApplication.VehiclesComponent.loadTable();
  setTimeout(function () {
    globalDefinitions.closeLoader();
  }, 2000);
}

MainApplication.VehiclesComponent.bindEvents = function () {
  $("#vehicle-form").off("submit").on("submit", function (e) {
    e.preventDefault();
    MainApplication.VehiclesComponent.saveVehicle();
  });

  $("#vehicle-cancel-btn")
    .off("click")
    .on("click", function () {
      MainApplication.VehiclesComponent.resetForm();
    });

  $("#vehicle-refresh-btn")
    .off("click")
    .on("click", function () {
      MainApplication.VehiclesComponent.loadTable();
    });
};

MainApplication.VehiclesComponent.resetForm = function () {
  VehiclesApp.editingId = null;
  $("#vehicle-title").val("");
  $("#vehicle-registration").val("");
  $("#vehicle-licenseplate").val("");
  $("#vehicle-form-title").text("Add Vehicle");
  $("#vehicle-save-btn").text("Add Vehicle");
  $("#vehicle-cancel-btn").addClass("hidden");
};

MainApplication.VehiclesComponent.loadTable = function () {
  var query = [
    {
      ascending: "TRUE",
      orderby: "Title",
    },
  ];

  viContext.getItem(
    "Vehicles",
    viContext.camlBuilder([query]),
    function (_spMeta) {
      MainApplication.vehicles = [];
      var listEnumerator = _spMeta.getEnumerator();
      var rows = "";

      while (listEnumerator.moveNext()) {
        var currentItem = listEnumerator.get_current();
        var id = currentItem.get_id();
        var title = $spcontext.checkNull(currentItem.get_item("Title"));
        var registeration = $spcontext.checkNull(
          currentItem.get_item("Registeration")
        );
        var licenseplate = $spcontext.checkNull(
          currentItem.get_item("LicensePlate")
        );

        MainApplication.vehicles.push({
          ID: id,
          Title: title,
          Registeration: registeration,
          LicensePlate: licenseplate,
        });

        rows += `
          <tr data-id="${id}">
            <td>${title}</td>
            <td>${registeration}</td>
            <td>${licenseplate}</td>
            <td>
              <button type="button" class="btn btn-sm btn-primary btn-icon vehicle-edit-btn" data-id="${id}" title="Edit">
                <i class="fa-solid fa-pen" style="font-size:11px"></i>
              </button>
              <button type="button" class="btn btn-sm btn-ghost btn-icon vehicle-delete-btn" data-id="${id}" title="Delete">
                <i class="fa-solid fa-trash" style="font-size:11px"></i>
              </button>
            </td>
          </tr>`;
      }

      $("#vehicles-table-body").html(
        rows ||
          '<tr><td colspan="4" style="text-align:center;">No vehicles found. Add one above.</td></tr>'
      );
      $("#vehicles-recordcount").text(MainApplication.vehicles.length);

      $(".vehicle-edit-btn")
        .off("click")
        .on("click", function () {
          var id = $(this).data("id");
          MainApplication.VehiclesComponent.editVehicle(id);
        });

      $(".vehicle-delete-btn")
        .off("click")
        .on("click", function () {
          var id = $(this).data("id");
          MainApplication.VehiclesComponent.deleteVehicle(id);
        });
    }
  );
  globalDefinitions.closeLoader();
};

MainApplication.VehiclesComponent.editVehicle = function (id) {
  var vehicle = (MainApplication.vehicles || []).find(function (v) {
    return v.ID == id;
  });
  if (!vehicle) {
    MainApplication.notyf.error("Vehicle not found");
    return;
  }

  VehiclesApp.editingId = id;
  $("#vehicle-title").val(vehicle.Title);
  $("#vehicle-registration").val(vehicle.Registeration);
  $("#vehicle-licenseplate").val(vehicle.LicensePlate);
  $("#vehicle-form-title").text("Edit Vehicle");
  $("#vehicle-save-btn").text("Update Vehicle");
  $("#vehicle-cancel-btn").removeClass("hidden");
  $("html, body").animate({ scrollTop: 0 }, 300);
};

MainApplication.VehiclesComponent.saveVehicle = function () {
  var title = $.trim($("#vehicle-title").val());
  var registeration = $.trim($("#vehicle-registration").val());
  var licenseplate = $.trim($("#vehicle-licenseplate").val());

  if (!title) {
    MainApplication.notyf.error("Vehicle title is required");
    return;
  }
  if (!registeration) {
    MainApplication.notyf.error("Registration is required");
    return;
  }
  if (!licenseplate) {
    MainApplication.notyf.error("License plate is required");
    return;
  }

  globalDefinitions.callLoader();

  var formData = {
    Title: title,
    Registeration: registeration,
    LicensePlate: licenseplate,
  };

  if (VehiclesApp.editingId) {
    formData.ID = VehiclesApp.editingId;
    viContext.updateItems(
      [formData],
      "Vehicles",
      function () {
        MainApplication.notyf.success("Vehicle updated successfully");
        MainApplication.VehiclesComponent.resetForm();
        MainApplication.VehiclesComponent.loadTable();
        globalDefinitions.closeLoader();
        globalDefinitions.AuditLogManager_SaveLog({
          Action: `Updated vehicle ${title}`,
        });
      }
    );
  } else {
    viContext.createItems(
      [formData],
      "Vehicles",
      function () {
        MainApplication.notyf.success("Vehicle added successfully");
        MainApplication.VehiclesComponent.resetForm();
        MainApplication.VehiclesComponent.loadTable();
        globalDefinitions.closeLoader();
        globalDefinitions.AuditLogManager_SaveLog({
          Action: `Added vehicle ${title}`,
        });
      }
    );
  }
};

MainApplication.VehiclesComponent.deleteVehicle = function (id) {
  if (!confirm("Are you sure you want to delete this vehicle?")) {
    return;
  }

  globalDefinitions.callLoader();

  // Prefer deleteItems if available on the context helper
  if (typeof viContext.deleteItems === "function") {
    viContext.deleteItems(
      [id],
      "Vehicles",
      function () {
        MainApplication.notyf.success("Vehicle deleted");
        MainApplication.VehiclesComponent.loadTable();
        globalDefinitions.closeLoader();
        globalDefinitions.AuditLogManager_SaveLog({
          Action: `Deleted vehicle ID ${id}`,
        });
      }
    );
  } else if (typeof viContext.deleteList === "function") {
    // fallback naming used in some builds
    viContext.deleteList(
      "Vehicles",
      id,
      function () {
        MainApplication.notyf.success("Vehicle deleted");
        MainApplication.VehiclesComponent.loadTable();
        globalDefinitions.closeLoader();
      }
    );
  } else {
    // Last-resort: use SP REST via the Speed context if exposed
    try {
      var ctx = new SP.ClientContext.get_current();
      var list = ctx.get_web().get_lists().getByTitle("Vehicles");
      var item = list.getItemById(id);
      item.deleteObject();
      ctx.executeQueryAsync(
        function () {
          MainApplication.notyf.success("Vehicle deleted");
          MainApplication.VehiclesComponent.loadTable();
          globalDefinitions.closeLoader();
          globalDefinitions.AuditLogManager_SaveLog({
            Action: `Deleted vehicle ID ${id}`,
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
