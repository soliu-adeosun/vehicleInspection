import * as React from "react";
import ClientButton from "../../../../Global/ClientButton";

require("newrequest");

export default class NewRequest extends React.Component<{}, {}> {
  public render(): React.ReactElement {
    return (
      <div className="form-card">
        <h1 className="form-card-title">Vehicle Inspection Checklist</h1>

        <div className="form-card">
          <div id="create-menu-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="cm-date">
                  Date
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  className="form-input"
                  type="date"
                  id="cm-date"
                  speed-bind-validate="Date"
                  speed-bind-class="MetaData"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="">
                  Mileage
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  className="form-input"
                  type="number"
                  speed-bind-validate="Mileage"
                  speed-bind-class="MetaData"
                  placeholder="Enter mileage e.g. 1000"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Driver Name
                  <span className="req" aria-hidden="true">
                      *
                    </span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  speed-bind-validate="DriverName"
                  speed-bind-class="MetaData"
                  placeholder="Enter driver name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Vehicle
                  <span className="req" aria-hidden="true">
                      *
                    </span>
                </label>
                <select
                  className="form-select"
                  speed-bind-validate="Vehicle"
                  speed-bind-class="MetaData"
                  id="vehicle-select"
                >
                  <option value="">Select a vehicle</option>
                  <option value="Vehicle 1" data-registration="REG001">Vehicle 1</option>
                  <option value="Vehicle 2" data-registration="REG002">Vehicle 2</option>
                  <option value="Vehicle 3" data-registration="REG003">Vehicle 3</option>
                </select>
              </div>
            </div>
            
          </div>

          <div className="table-wrap" style={{ marginTop: "20px" }}>
          <table aria-label="Staff bookings">
            <thead>
              <tr>
                <th>S/N</th>
                <th scope="col">
                  Inspection Items
                </th>
                <th data-bind="Status" scope="col">
                  Status
                </th>
              </tr>
            </thead>
            <tbody id="data-table" />
          </table>
          
        </div>
        </div>

        <div id="food-inspection-form" style={{ marginTop: "20px" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="fh-comments">
              Comments / Recommendations
              <span className="req" aria-hidden="true">
                      *
                    </span>
            </label>
            <textarea
              className="form-input"
              id="fh-comments"
              rows={4}
              placeholder="Add any comments or recommendations from the inspection..."
              speed-bind-validate="Comment"
              speed-validate-msg="Please enter comments or recommendations"
            />
          </div>

          <div className="form-actions">
            <ClientButton
              func="NewRequestComponent.confirmSubmit"
              clax="btn btn-primary"
              prop="submit"
            >
              <i className="fa-solid fa-check" aria-hidden="true" /> Submit
              Inspection
            </ClientButton>
            <ClientButton
              func="NewRequestComponent.confirmSubmit"
              clax="btn btn-ghost hidden"
              prop="save"
            >
              Save for later
            </ClientButton>
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount(): void {
    window.loadNewRequestComponent();
  }
}
