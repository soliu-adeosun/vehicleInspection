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
                  Week Start
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  className="form-input"
                  type="date"
                  id="cm-date"
                  speed-bind-validate="WeekStart"
                  speed-bind-class="MetaData"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="">
                  Week End
                  <span className="req" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  className="form-input"
                  type="date"
                  speed-bind-validate="WeekEnd"
                  speed-bind-class="MetaData"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Wk. Start Kms
                  <span className="req" aria-hidden="true">
                      *
                    </span>
                </label>
                <input
                  className="form-input"
                  type="number"
                  speed-bind-validate="WkStartKms"
                  speed-bind-class="MetaData"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Wk. End Kms
                  <span className="req" aria-hidden="true">
                      *
                    </span>
                </label>
                <input
                  className="form-input"
                  type="number"
                  speed-bind-validate="WkEndKms"
                  speed-bind-class="MetaData"
                />
              </div>
            </div>

            <div className="form-group">
                <label className="form-label">
                  Operator
                  <span className="req" aria-hidden="true">
                      *
                    </span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  speed-bind-validate="Operator"
                  speed-bind-class="MetaData"
                />
              </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Vehicle
                  <span className="req" aria-hidden="true">
                      *
                    </span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  speed-bind-validate="Vehicle"
                  speed-bind-class="MetaData"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Registration
                  <span className="req" aria-hidden="true">
                      *
                    </span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  speed-bind-validate="Registration"
                  speed-bind-class="MetaData"
                />
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
                <th data-bind="Monday" scope="col">
                  Monday 
                </th>
                <th data-bind="Tuesday" scope="col">
                  Tuesday 
                </th>
                <th data-bind="Wednesday" scope="col">
                  Wednesday 
                </th>
                <th data-bind="Thursday" scope="col">
                  Thursday 
                </th>
                <th data-bind="Friday" scope="col">
                  Friday 
                </th>
                <th data-bind="Defect" scope="col">
                  Defect 
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
            </label>
            <textarea
              className="form-input"
              id="fh-comments"
              rows={4}
              placeholder="Add any comments or recommendations from the inspection..."
              speed-bind="Comment"
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
              clax="btn btn-ghost"
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
