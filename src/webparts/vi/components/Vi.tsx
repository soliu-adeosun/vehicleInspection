import * as React from 'react';
// import styles from './Vi.module.scss';
import type { IViProps } from './IViProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import {Route, Routes, HashRouter} from "react-router-dom";
import {Layout} from "../../../Global/Layout";
import NewRequest from "./pages/NewRequest";
import Report from './pages/Report';
import ViewRequest from './pages/ViewRequest';

require('main');

declare global {
    interface Window {
        globalProp: any;
        loadNewRequestComponent: () => void;
        loadReportComponent : () => void;
        loadViewRequestComponent : () => void;
    }
}
export default class Vi extends React.Component<IViProps> {
  public render(): React.ReactElement<IViProps> {
    const {} = this.props;

    return (
      <>
          <HashRouter>
              <Routes>
                  <Route path="/" element={<Layout />}>
                      <Route index element={<NewRequest />} />
                      <Route path="report" element={<Report />} />
                      <Route path="viewrequest" element={<ViewRequest />} />
                  </Route>
              </Routes>
          </HashRouter>
      </>
    );
  }
}
