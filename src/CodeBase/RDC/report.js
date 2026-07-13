loadReportComponent = function () {
    if (MainApplication.cachedState.mode) {
		whenReportDependeciesLoaded();
	}else{
        MainApplication.cachedState.pageStateCall = loadReportComponent;
    }
};

whenReportDependeciesLoaded = function () {
    globalDefinitions.callLoader();
    // globalDefinitions.extendStages();
    globalDefinitions.sortResponse();


    // $("#requeststrDate").datepicker({ dateFormat: 'yy-mm-dd', beforeShow: function () { jQuery(this).datepicker('option', 'maxDate', $('#requestendDate').val()); } });
    // $("#requestendDate").datepicker({ dateFormat: 'yy-mm-dd', beforeShow: function () { jQuery(this).datepicker('option', 'minDate', $('#requeststrDate').val()); } });
    AppRequest = new MainApplication.NewRequestComponent.ApplicationDetails();
    AppRequest.fullTableData = [];
    AppRequest.dataForExport = [];

    customWorkflowEngine = new WorkflowManagerEngine(CurrentUserProperties);
    
    viContext.DataForTable.tablecontentId = "speed-data-table";
    viContext.DataForTable.pagesize = 20;
    viContext.DataForTable.paginateSize = 5;
    viContext.DataForTable.modifyTR = false;
    viContext.DataForTable.context = viContext;
    viContext.DataForTable.paginationbId = "myrequestpagination";
    viContext.DataForTable.paginationuId = "toppagination";
    
    viContext.DataForTable.propertiesHandler = {
        "WkStartKms": function (valueToEva) {
            return valueToEva.WkStartKms + "Kms";
        },
        "WkEndKms": function (valueToEva) {
            return valueToEva.WkEndKms + "Kms";
        },
        "Title": function (valueToEva) {
            var viewStr = `
                <a href="#/viewrequest?itemId=${valueToEva.WorkflowRequestID}" class="btn btn-sm btn-primary btn-icon">
                    <i class="fa-solid fa-eye" style="font-size:11px"></i>
                </a>`;

            var editStr = `
                <a href="#/?itemId=${valueToEva.WorkflowRequestID}" class="btn btn-sm btn-primary btn-icon">
                    <i class="fa-solid fa-pen" style="font-size:11px"></i>
                </a>`;

            if (valueToEva.Status === "Save"){
                return `<div>${editStr} ${viewStr}</div`
            } else {
                return viewStr; 
            }
               
        }
    };

    // $("#searchbtn").click(() => {
    //     MainApplication.ReportComponent.retrieveRequest();
    // });

    // let debounceTimer;

    $("#employeeName, #nextApprover, #statusSelect, #rdcStatusSelect, #requeststrDate, #requestendDate").on("keyup change", function () {
        // clearTimeout(debounceTimer);
        // debounceTimer = setTimeout(() => {
            MainApplication.ReportComponent.retrieveRequest();
        // }, 500);
    });

    $("#exportbtn").click(() => {
        MainApplication.ReportComponent.exportToExcel();
    });

    $("#reportsearchfield").on("keyup", function () {
        var searchQuery = $(this).val();
        var data = AppRequest.fullTableData || [];
        var filteredItems = MainApplication.reportSyncSearch(searchQuery, data);
        MainApplication.ReportComponent.showTableData(filteredItems);
    });

    $("#filter-btn, #closesearchfilter").click(() => {
        $(".sort-box").toggleClass("hidden");
    });

    // if (MainApplication.isUserAnActor) {
        MainApplication.ReportComponent.retrieveRequest();
        globalDefinitions.closeLoader();
    // }
    // else {
    //     globalDefinitions.HandlerError("You are not authorized to access this resource...");
    //     $spcontext.redirect("#/", false);
    //     globalDefinitions.closeLoader();
    // }
    setTimeout(function () {
        globalDefinitions.closeLoader();
    }, 2000);
};

MainApplication.ReportComponent.retrieveRequest = function () {
    // globalDefinitions.callLoader();
    var reportQuery = [{
            ascending: "FALSE",
            orderby: "Modified"
        }
    ];

    reportQuery = viContext.formQueryArrayGenerator(reportQuery);

    var query = viContext.camlBuilder(reportQuery);
    var extraProperties = {
        merge: true,
        data: [
            "ID", "Title", "WeekStart", "WeekEnd", "WkStartKms", "WkEndKms", "Operator", "Vehicle", "Registration", "Comment",
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "WeekNumber", "Month", "Year", "WorkflowRequestID"
        ]
    };

    viContext.getListToItems(configProperties.VILIST.setting, query, extraProperties, true, null, function (tableData) {
        
        AppRequest.fullTableData = tableData;
        // var completedItems = tableData.filter(function (item) {
        //     return item.Approval_Status === "Completed";
        // }) || [];

        // var pendingItems = tableData.filter(function (item) {
        //     return item.Approval_Status === "Pending";
        // }) || [];

        $("#recordcount").text(tableData.length || 0);
        MainApplication.ReportComponent.showTableData(tableData);
        // setTimeout(function () {
        //     globalDefinitions.closeLoader();
        // }, 1000);
    });
};

MainApplication.ReportComponent.showTableData = function (tableData) {
    AppRequest.dataForExport = tableData;
    if (tableData.length === 0) {
        $("#tasktable").hide();
        $("#speed-data-table").empty();
        $(".threport").hide();
        $(".norequest").show();
    } else {
        $("#tasktable").show();
        $(".threport").show();
        $(".norequest").hide();
        viContext.manualTable(tableData);
    }
    globalDefinitions.closeLoader();
};

MainApplication.ReportComponent.exportToExcel = function () {
    var excelName = "VehicleInspectionReport" + $spcontext.stringnifyDate() + ".csv";
    var dataStringHeader = [
        "Operator", "Wk. Start Kms", "Wk. End Kms", "Week Number", "Vehicle", "Registeration"
    ];

    var excelData = dataStringHeader.toString() + "\n";

    $.each(AppRequest.dataForExport, function (index, itemProperties) {
        var dataString = [];
        dataString.push(itemProperties.Operator);
        dataString.push($spcontext.stringnifyDate({ value: itemProperties.WkStartKms, includeTime: false }));
        dataString.push($spcontext.stringnifyDate({ value: itemProperties.WkEndKms, includeTime: false }));
        dataString.push(itemProperties.WeekNumber);
        dataString.push(itemProperties.Vehicle);
        dataString.push(itemProperties.Registeration);
        
        /*
        dataString.push(delegateEmail);*/
        excelData += dataString.toString() + "\n";
        excelData = "\uFEFF" + excelData;
    });

    MainApplication.ReportComponent.downloadData(excelName, excelData);
}

MainApplication.ReportComponent.downloadData = function (excelname, data) {
    if (navigator.msSaveOrOpenBlob) {
        var blobContent = data;
        // Works for Internet Explorer and Microsoft Edge
        var blob = new Blob([blobContent], { type: "text/csv" });
        navigator.msSaveOrOpenBlob(blob, excelname);
    }
    else {
        var encodedString;
        var downloadLink
        try {
            encodedString = btoa(data);
            downloadLink = `data:text/csv;base64,${encodedString}`;
        }
        catch (e) {
            var csvContent = "data:text/csv;charset=utf-8,";
            csvContent += data;
            var blob = new Blob([data]);
            if (blob.size > 2000000) {
                globalDefinitions.HandlerError("Please use the filter to reduce the data size, as the size of the data exceeds 2MB");
            }
            downloadLink = encodeURI(csvContent);
        }

        var link = document.createElement("a");
        link.setAttribute("href", downloadLink);
        link.setAttribute("download", excelname);
        link.click();
    }
}

MainApplication.ReportComponent.validateCSVContent = function (data) {
    if (typeof data == "string") {
        //data = data.replace(/,/g, "~");
        data = data.replace(/\n/g, "");
        data = data.replace(/\r/g, "");
        data = data.replace(/\r\n/g, "");
        data = MainApplication.ReportComponent.encloseStringWithCommaCheck(data);
    }
    return data;
}


MainApplication.ReportComponent.encloseStringWithCommaCheck = function (value) {
    if (value.includes(',')) {
        return '"' + value + '"';
    }
    return value;
}

MainApplication.ReportComponent.updateDateConstraints = function () {
    var startDate = $("#requeststrDate").val();
    var endDate = $("#requestendDate").val();
    if (startDate) {
        $("#requestendDate").attr("min", startDate);
    } else {
        $("#requestendDate").removeAttr("min");
    }

    if (endDate) {
        $("#requeststrDate").attr("max", endDate);
    } else {
        $("#requeststrDate").removeAttr("max");
    }
}